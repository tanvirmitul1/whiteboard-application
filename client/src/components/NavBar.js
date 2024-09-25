import React from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
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
        backgroundColor: "#131324",
        color: "white",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
              <EditCalendarIcon sx={{ color: "#ea05ff", fontSize: 50 }} />
            </IconButton>
            {isPc && (
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Chalk Board App
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
