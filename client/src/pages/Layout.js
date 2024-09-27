import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import useAuth from "../customHooks/useAuth";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthRoute =
    location.pathname === "/" ||
    location.pathname === "/change-password" ||
    location.pathname === "/register/public";

  useEffect(() => {
    if (!user && !isAuthRoute) {
      navigate("/");
    }
  }, [user, isAuthRoute, navigate]);

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <div>{children}</div>
    </>
  );
};

export default Layout;
