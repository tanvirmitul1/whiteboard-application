import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import useAuth from "../../customHooks/useAuth";
import { useTheme } from "@mui/material/styles";

const DrawingFilters = ({
  selectedUser,
  onUserChange,
  filterTitle,
  onTitleChange,
  users,
}) => {
  const { userId } = useAuth();
  const theme = useTheme(); // Accessing theme colors

  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: theme.palette.text.primary }}>
            User
          </InputLabel>{" "}
          {/* Dynamic text color */}
          <Select
            value={selectedUser}
            onChange={onUserChange}
            label="User"
            className="filter-user-select"
            sx={{
              backgroundColor: theme.palette.background.default, // Dynamic background color
              color: theme.palette.text.primary, // Dynamic text color
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main, // Dynamic border color
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.dark, // Hover border color
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.primary.main, // Focused border color
              },
            }}
          >
            <MenuItem value="" sx={{ color: theme.palette.text.primary }}>
              <em>All</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem
                key={user._id}
                value={user._id}
                sx={{
                  color: theme.palette.text.primary, // Dynamic text color
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover, // Dynamic hover color
                  },
                }}
              >
                <span>{user.username}</span>
                {user._id === userId && (
                  <span style={{ color: theme.palette.info.main }}>
                    (Myself)
                  </span> // Dynamic "Myself" color
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          className="filter-user-select"
          sx={{
            color: theme.palette.text.primary, // Dynamic text color
            label: { color: theme.palette.text.primary }, // Label color
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.default, // Background color
              "& fieldset": {
                borderColor: theme.palette.primary.main, // Border color
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.dark, // Hover border color
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main, // Focused border color
              },
            },
          }}
          InputProps={{
            style: { color: theme.palette.text.primary }, // Input text color
          }}
          label="Filter by Title"
          variant="outlined"
          fullWidth
          value={filterTitle}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default DrawingFilters;
