// components/DrawingFilters.js
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

const DrawingFilters = ({
  selectedUser,
  onUserChange,
  filterTitle,
  onTitleChange,
  users,
}) => {
  const { userId } = useAuth();
  return (
    <Grid container spacing={2} mb={2}>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }}>User</InputLabel>
          <Select
            value={selectedUser}
            onChange={onUserChange}
            label="User"
            className="filter-user-select"
          >
            <MenuItem value="" className="filter-user-list">
              <em>All</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem
                key={user._id}
                value={user._id}
                className="filter-user-list"
              >
                <span> {user.username}</span>{" "}
                {user._id === userId && (
                  <span style={{ color: "blue" }}>(Myself)</span>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          className="filter-user-select"
          sx={{ color: "white", label: { color: "white" } }}
          InputProps={{
            style: { color: "white" },
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
