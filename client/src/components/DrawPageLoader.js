import React from "react";
import { Box, CircularProgress, Grid, Paper, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const DrawPageLoader = () => {
  const theme = useTheme(); // Accessing theme colors

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default, // Using theme background color
        minHeight: "100vh", // Ensure full-screen height
      }}
    >
      {/* Display skeletons while loading */}
      <Box sx={{ width: "90%", maxWidth: 1800 }}>
        <Grid container spacing={3}>
          {Array.from(new Array(9)).map((_, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Paper
                sx={{
                  backgroundColor: theme.palette.background.paper, // Using theme paper background color
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Skeleton
                  variant="text"
                  height={40}
                  animation="wave"
                  sx={{
                    bgcolor: theme.palette.background.default,
                  }}
                />
                <Skeleton
                  variant="rectangular"
                  height={200}
                  animation="wave"
                  sx={{
                    bgcolor: theme.palette.background.default,
                  }}
                />
                <Skeleton
                  variant="text"
                  height={20}
                  width="60%"
                  animation="wave"
                  sx={{
                    bgcolor: theme.palette.background.default,
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DrawPageLoader;
