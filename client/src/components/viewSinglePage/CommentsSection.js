import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Popover,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react";
import io from "socket.io-client";

import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import {
  useGetAllCommentsQuery,
  useStoreCommentsMutation,
} from "../../Apis/commentsApiSlice";
import useAuth from "../../customHooks/useAuth";
import CommentList from "./CommentLish";
import Reactions from "../viewPage/Reactions";

const socket = io(process.env.REACT_APP_SOCKET_CONNECTION_BACKEND_BASE_URL, {
  reconnectionAttempts: 5,
});

const CommentsSection = ({ whiteboard }) => {
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

  const open = Boolean(anchorEl);
  const id = open ? "emoji-popover" : undefined;

  return (
    <Box className="comments-container">
      <Reactions whiteboard={whiteboard} />
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
