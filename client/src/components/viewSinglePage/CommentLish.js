import React, { useState } from "react";
import {
  List,
  ListItem,
  Avatar,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { format } from "timeago.js";

const CommentList = ({ comments }) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 10); // Show 10 more comments
  };

  return (
    <Box
      sx={{
        width: { xs: "95vw", md: "30vw" },
        maxHeight: "45vh",
        overflow: "auto",
        borderRadius: 2,

        backgroundColor: "#f9f9f9",
        padding: 2,
      }}
    >
      <List>
        {comments.slice(0, visibleCount).map((comment) => (
          <React.Fragment key={comment._id}>
            <ListItem
              alignItems="flex-start"
              sx={{ padding: 2, borderBottom: "1px solid #ddd" }}
            >
              <Avatar sx={{ marginRight: 2, bgcolor: "primary.main" }}>
                {comment.user.username.charAt(0)} {/* Initials */}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {comment.user.username}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  sx={{
                    display: "block",
                    wordBreak: "break-word",
                    marginBottom: 1,
                  }}
                >
                  {comment.commentText}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {format(comment.createdAt)}
                </Typography>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {comments.length > visibleCount && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <Button variant="outlined" onClick={handleSeeMore}>
            See More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentList;
