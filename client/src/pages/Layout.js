// src/components/Layout.js
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthRoute =
    location.pathname === "/" || location.pathname === "/change-password";

  return (
    <div className="App">
      {!isAuthRoute && <Navbar />}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
