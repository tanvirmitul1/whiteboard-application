import React from "react";
import ReactModal from "react-modal";
import { getCustomModalStyles, ModalBody, ModalHeader } from "./ModalUI";
import { useTheme } from "@mui/material";

const CustomModal = ({
  children,
  open,
  onClose,
  customStyle,
  title = "Modal Title",
}) => {
  const theme = useTheme();

  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      style={customStyle || getCustomModalStyles(theme)}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={false}
    >
      <ModalHeader title={title} onClose={onClose} />
      <ModalBody>{children}</ModalBody>
    </ReactModal>
  );
};

export default CustomModal;
