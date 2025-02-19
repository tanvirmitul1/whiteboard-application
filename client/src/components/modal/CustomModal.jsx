import React from "react";
import ReactModal from "react-modal";
import { customModalStyles, ModalBody, ModalHeader } from "./ModalUI";

const CustomModal = ({
  children,
  open,
  onClose,
  customStyle = customModalStyles,
  title = "Modal Title",
}) => {
  return (
    <ReactModal
      isOpen={open}
      onRequestClose={onClose}
      style={customStyle}
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
