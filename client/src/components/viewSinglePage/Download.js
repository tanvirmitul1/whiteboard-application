import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
import DownloadIcon from "@mui/icons-material/Download";
const Download = ({ resolution, setResolution, handleDownload }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        gap: "10px",
        marginTop: 2,
      }}
    >
      <FormControl
        size="small"
        sx={{
          color: "white",
          border: "3px solid grey",

          borderRadius: 2,

          "& .MuiInputBase-input": {
            color: "white",
          },
        }}
      >
        <Select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
        >
          <MenuItem value={1}>1x</MenuItem>
          <MenuItem value={2}>2x</MenuItem>
          <MenuItem value={3}>3x</MenuItem>
          <MenuItem value={4}>4x</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        startIcon={<DownloadIcon />}
      >
        Download
      </Button>
    </Box>
  );
};

export default Download;
