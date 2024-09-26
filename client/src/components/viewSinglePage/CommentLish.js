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
import useColors from "../../customHooks/useColors";

const CommentList = ({ comments }) => {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleSeeMore = () => {
    setVisibleCount((prevCount) => prevCount + 10); // Show 10 more comments
  };
  const { colors } = useColors();

  return (
    <Box
      sx={{
        width: { xs: "80vw", md: "25vw" },
        maxHeight: "45vh",
        overflow: "auto",
        borderRadius: 2,
        backgroundColor: colors.primaryBgColor,
        padding: 2,
        border: "2px solid #4e4c4c",
      }}
    >
      <List>
        {comments?.slice(0, visibleCount).map((comment) => (
          <React.Fragment key={comment._id}>
            <ListItem
              alignItems="flex-start"
              sx={{ padding: 2, borderBottom: "1px solid #635e5e" }}
            >
              <Avatar sx={{ marginRight: 2, bgcolor: "primary.main" }}>
                {comment?.user?.username.charAt(0)} {/* Initials */}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: "#ebeaea" }}
                >
                  {comment?.user?.username}
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    wordBreak: "break-word",
                    marginBottom: 1,
                    color: "grey",
                  }}
                >
                  {comment?.commentText}
                </Typography>
                <Typography sx={{ color: "grey", fontSize: "10px" }}>
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
          <Button variant="outlined" onClick={handleSeeMore}>
            See More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentList;
