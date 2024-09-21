import React from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard"; // New Icon for a more professional look
import UserInfo from "./UserInfo";
import { Link } from "react-router-dom";
import useAuth from "../customHooks/useAuth";

const NavBar = () => {
  const isPc = useMediaQuery("(min-width: 960px)");
  const { userName } = useAuth();

  return (
    <Box
      sx={{
        padding: "10px 20px",
        backgroundColor: "#283593",
        color: "white",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/create-drawing"
          style={{ textDecoration: "none", color: "white" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ color: "white", mr: 1 }}>
              <DashboardIcon fontSize="large" /> {/* New Icon */}
            </IconButton>
            {isPc && (
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                WhiteBoard App
              </Typography>
            )}
          </Box>
        </Link>
        {userName && <UserInfo />}
      </Box>
    </Box>
  );
};

export default NavBar;
