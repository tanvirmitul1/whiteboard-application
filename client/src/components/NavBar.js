import React from "react";
import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import UserInfo from "./UserInfo";
import { Link } from "react-router-dom";
import useAuth from "../customHooks/useAuth";
import { useTheme } from "@mui/material/styles"; // To access the theme

const NavBar = () => {
  const { palette } = useTheme(); // Accessing the current theme
  const isPc = useMediaQuery("(min-width: 960px)");
  const { userName } = useAuth();

  return (
    <Box
      sx={{
        padding: "5px 20px",
        backgroundColor: palette.background.default,
        borderBottom: `1px solid ${palette.divider}`,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        color: palette.text.primary,
        top: 0,
        zIndex: 1000,
        height: "6vh",
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
          style={{ textDecoration: "none", color: palette.text.primary }} // Link color from the theme
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton sx={{ mr: 1 }}>
              <EditCalendarIcon
                sx={{ color: palette.primary.main, fontSize: 25 }}
              />{" "}
              {/* Icon color from the theme */}
            </IconButton>
            {isPc && (
              <Typography variant="h7" sx={{ fontWeight: "bold" }}>
                Drawing Board
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
