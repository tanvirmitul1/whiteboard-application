import React from "react";
import { toast } from "react-toastify";
const ActionButton = () => {
  const handleAction = () => {
    console.log("Action not implemented yet");
    toast.error("Action not implemented yet");
  };
  return (
    <div
      onClick={handleAction}
      style={{
        cursor: "pointer",
        color: "White",
        position: "absolute",
        top: "10px",
        right: "10px",
      }}
    >
      ...
    </div>
  );
};

export default ActionButton;
