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
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import EmojiPicker from "emoji-picker-react"; // For emoji picker
import io from "socket.io-client";
import { format } from "timeago.js"; // For "time ago" formatting
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions"; // Emoji icon
import {
  useGetAllCommentsQuery,
  useStoreCommentsMutation,
} from "../../Apis/commentsApiSlice";

import useAuth from "../../customHooks/useAuth";

// Initialize socket connection
const socket = io(process.env.REACT_APP_SOCKET_CONNECTION_BACKEND_BASE_URL, {
  reconnectionAttempts: 5, // Attempt reconnection up to 5 times
});

const CommentsSection = () => {
  const { drawingId } = useParams();
  const [storeComments] = useStoreCommentsMutation();
  const { data: commentsData } = useGetAllCommentsQuery(drawingId);
  const { userId } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // For emoji picker popover

  useEffect(() => {
    // Real-time updates for new comments
    socket.on("newComment", (comment) => {
      setComments((prevComments) => [comment, ...prevComments]);
    });

    // Real-time updates for reactions
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

      setNewComment(""); // Clear the input field
      toast.success("Comment posted successfully!");
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
    setNewComment((prevComment) => prevComment + emojiObject.emoji);
    setAnchorEl(null); // Hide popover after emoji selection
  };

  const handleEmojiClick = (event) => {
    setAnchorEl(event.currentTarget); // Show popover on emoji icon click
  };

  const handleEmojiClose = () => {
    setAnchorEl(null); // Close popover
  };

  const open = Boolean(anchorEl);
  const id = open ? "emoji-popover" : undefined;

  return (
    <Box
      sx={{
        borderRadius: 2,
        backgroundColor: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        margin: "auto",
        position: "relative",
        padding: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginBottom: 2,
          textAlign: "center",
          fontWeight: 600,
          color: "#283593",
          backgroundColor: "#f9f9f9",
          padding: 1,
          borderRadius: 1,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Comments
      </Typography>

      {/* Reaction Buttons for Drawing */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          marginBottom: 2,
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
          marginBottom: 3,
        }}
      >
        <Box sx={{ padding: 2, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
          <TextField
            placeholder="Write a comment..."
            variant="outlined"
            fullWidth
            multiline
            maxRows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            helperText={`${newComment.length}/200`}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
        </Box>
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
            onClick={handlePostComment}
          >
            Post Comment
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
      <List>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <React.Fragment key={comment._id}>
              <ListItem alignItems="flex-start">
                <Avatar sx={{ marginRight: 2 }}>{comment.userName}</Avatar>
                <ListItemText
                  primary={comment.userName}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        sx={{ display: "block", wordBreak: "break-word" }}
                      >
                        {comment.commentText}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {format(comment.createdAt)}{" "}
                        {/* Time formatted as "time ago" */}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", marginTop: 2 }}>
            No comments yet.
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default CommentsSection;
