// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import "./index.css";
const Index = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
