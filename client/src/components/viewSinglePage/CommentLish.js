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
import { formatDistanceToNow } from "date-fns";
import { useTheme } from "@mui/material/styles";

const CommentList = ({ comments }) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 10); // Show 10 more comments
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        width: { xs: "80vw", md: "25vw" },
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper, // Using theme's background color
        padding: 2,
        border: `2px solid ${theme.palette.grey[700]}`, // Using theme's grey color
      }}
    >
      <List>
        {comments?.slice(0, visibleCount).map((comment) => (
          <React.Fragment key={comment._id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                padding: 2,
                borderBottom: `1px solid ${theme.palette.grey[500]}`, // Using theme's grey color
              }}
            >
              <Avatar
                sx={{ marginRight: 2, bgcolor: theme.palette.primary.main }}
              >
                {comment?.user?.username.charAt(0)} {/* Initials */}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: theme.palette.text.primary }} // Using theme's primary text color
                >
                  {comment?.user?.username}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    wordBreak: "break-word",
                    marginBottom: 1,
                    color: theme.palette.text.secondary, // Using theme's secondary text color
                  }}
                >
                  {comment?.commentText}
                </Typography>
                <Typography
                  sx={{ color: theme.palette.text.disabled, fontSize: "10px" }}
                >
                  {formatDistanceToNow(new Date(comment?.createdAt), {
                    addSuffix: true,
                  })}
                </Typography>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {comments?.length > visibleCount && (
        <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
          <Button
            variant="outlined"
            onClick={handleSeeMore}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            See More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentList;
