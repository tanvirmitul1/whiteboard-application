import React from "react";
import { Box, CircularProgress, Grid, Paper, Skeleton } from "@mui/material";

const DrawPageLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Display skeletons while loading */}
      <Box sx={{ width: "100%", maxWidth: 1800 }}>
        <Grid container spacing={3}>
          {Array.from(new Array(9)).map((_, index) => (
            <Grid item xs={12} sm={6} md={6} key={index}>
              <Paper
                sx={{
                  padding: 2,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Skeleton variant="text" height={40} />
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" height={20} width="60%" />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default DrawPageLoader;
