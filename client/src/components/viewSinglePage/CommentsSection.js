import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Avatar,
  Popover,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";

import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

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

    // Clean up the socket connection when the component is unmounted
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

  const onEmojiClick = (event, emojiObject) => {
    console.log({ emojiObject });
    setNewComment((prevComment) => prevComment + emojiObject.emoji);
  };

  const handleEmojiClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEmojiClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "emoji-popover" : undefined;

  return (
    <Box
      sx={{
        width: { xs: "95vw", md: "35vw" },
        overflow: "auto",
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          marginTop: 1,
        }}
      >
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

      {/* New Comment Input */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "90vw", md: "30vw" },
          padding: 2,
        }}
      >
        <TextField
          placeholder="Write a comment..."
          variant="outlined"
          size="small"
          multiline
          maxRows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          helperText={`${newComment.length}/200`}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handlePostComment}
            sx={{ textTransform: "none" }}
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
          <IconButton onClick={handleEmojiClick}>
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

      {/* Comment List */}
      {commentsData && <CommentList comments={comments} />}
    </Box>
  );
};

export default CommentsSection;
