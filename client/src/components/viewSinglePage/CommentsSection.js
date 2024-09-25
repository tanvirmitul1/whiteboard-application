import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Popover,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import axios from "axios";
import {
  useGetAllCommentsQuery,
  useStoreCommentsMutation,
} from "../../Apis/commentsApiSlice";
import useAuth from "../../customHooks/useAuth";
import CommentList from "./CommentLish";

const socket = io(process.env.REACT_APP_SOCKET_CONNECTION_BACKEND_BASE_URL, {
  reconnectionAttempts: 5,
});

const CommentsSection = () => {
  const { drawingId } = useParams();
  const [storeComments, { isLoading: isCommentPosting }] =
    useStoreCommentsMutation();
  const { data: commentsData } = useGetAllCommentsQuery(drawingId);
  const { userId } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    socket.on("newComment", (comment) => {
      setComments((prevComments) => [comment, ...prevComments]);
    });

    socket.on("updateReaction", (updatedComment) => {
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    });

    return () => {
      socket.off("newComment");
      socket.off("updateReaction");
    };
  }, [drawingId]);

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData);
    }
  }, [commentsData]);

  const handlePostComment = async () => {
    if (!newComment.trim()) {
      return toast.error("Comment cannot be empty.");
    }

    try {
      await storeComments({
        drawingId,
        commentText: newComment,
        user: userId,
      }).unwrap();

      setNewComment("");
      toast.success("Comment posted successfully!");
      const sound = new Audio("/audio/sendComment.mp3");
      sound.play();
    } catch (error) {
      toast.error("Failed to post comment.");
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setNewComment((prevComment) => prevComment + emojiObject.emoji);
  };

  const handleEmojiClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setAnchorEl(null);
  };
  const handleReaction = async (reactionType) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/drawings/reaction`,
        {
          drawingId,
          reactionType,
        }
      );
      toast.success("Reaction added!");
    } catch (error) {
      toast.error("Failed to add reaction.");
    }
  };
  const open = Boolean(anchorEl);
  const id = open ? "emoji-popover" : undefined;

  return (
    <Box className="comments-container">
      <Box className="comments-reactions">
        <IconButton onClick={() => handleReaction("like")} color="primary">
          <ThumbUpAltIcon />
        </IconButton>
        <IconButton onClick={() => handleReaction("love")} color="secondary">
          <FavoriteIcon />
        </IconButton>
        <IconButton onClick={() => handleReaction("laugh")} color="success">
          <SentimentVerySatisfiedIcon />
        </IconButton>
        <IconButton onClick={() => handleReaction("sad")} color="warning">
          <SentimentDissatisfiedIcon />
        </IconButton>
        <IconButton onClick={() => handleReaction("angry")} color="error">
          <SentimentVeryDissatisfiedIcon />
        </IconButton>
      </Box>

      <Box className="new-comment-input">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="text-field"
        />

        <Box className="comment-action-buttons">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handlePostComment}
            disabled={isCommentPosting}
          >
            {isCommentPosting ? (
              <>
                <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                Processing...
              </>
            ) : (
              "Add comment"
            )}
          </Button>
          <IconButton onClick={handleEmojiClick} className="emoji-button">
            <EmojiEmotionsIcon />
          </IconButton>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleEmojiClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </Popover>
        </Box>
      </Box>

      {commentsData && <CommentList comments={comments} />}
    </Box>
  );
};

export default CommentsSection;
