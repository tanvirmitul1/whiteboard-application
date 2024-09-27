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
        padding: "5px 20px",
        backgroundColor: "#131324",
        color: "white",
        top: 0,
        zIndex: 1000,
        height: "5vh",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/create-drawing"
          style={{ textDecoration: "none", color: "white" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 1 }}>
              <EditCalendarIcon sx={{ color: "#ea05ff", fontSize: 25 }} />
            </IconButton>
            {isPc && (
              <Typography variant="h7" sx={{ fontWeight: "bold" }}>
                Chalk Board App
              </Typography>
            )}
          </Box>
        </Link>
      </Box>
      {userName && <UserInfo />}
    </Box>
  );
};

export default NavBar;
