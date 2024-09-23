import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import useAuth from "../customHooks/useAuth";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthRoute =
    location.pathname === "/" || location.pathname === "/change-password";

  useEffect(() => {
    // Redirect to homepage if there is no user and not on auth routes
    if (!user && !isAuthRoute) {
      navigate("/");
    }
  }, [user, isAuthRoute, navigate]);

  return (
    <div className="App">
      <>
        {!isAuthRoute && <Navbar />}
        <div>{children}</div>
      </>
    </div>
  );
};

export default Layout;
