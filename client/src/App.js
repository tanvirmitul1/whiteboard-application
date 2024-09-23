// src/App.js
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout"; // Import Layout

import LoginPage from "./pages/LoginPage";
import CreateDrawingPage from "./pages/CreateDrawingPage";

import RegisterPage from "./pages/RegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserPage from "./pages/UsersPage";
import ViewDrawingPage from "./pages/ViewDrawingPage";
import EditDrawingPage from "./pages/EditDrawingPage";
import ViewSingleDrawingPage from "./pages/ViewSingleDrawingPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPublic from "./pages/RegisterPublic";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/create-drawing" element={<CreateDrawingPage />} />
          <Route path="/drawing-list" element={<ViewDrawingPage />} />
          <Route path="/edit/:id" element={<EditDrawingPage />} />
          <Route path="/user-list" element={<UserPage />} />
          <Route
            path="/drawing/:drawingId"
            element={<ViewSingleDrawingPage />}
          />
          <Route path="/register/public" element={<RegisterPublic />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </Router>
  );
}

export default App;
