import styled from "styled-components";
import { GridCloseIcon } from "@mui/x-data-grid";
export const customModalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    margin: "auto",
    zIndex: 999,
  },
  content: {
    borderRadius: "16px",
    height: "fit-content",
    maxHeight: "95vh",
    maxWidth: "900px",
    margin: "auto",
    border: "none",
    padding: "0",
    background: "#2a2a2a",
    color: "#f5f5f5",
    zIndex: 999,
    border: "1px solid #444",
    overflow: "hidden",
  },
};

export const ModalBody = styled.div`
  padding: 16px;
  overflow-y: auto;
  max-height: 82vh;
`;

export const ModalHeader = ({ title, onClose }) => {
  return (
    <Header>
      <h3 className="text-md font-semibold">{title}</h3>
      <GridCloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1976d2;
  color: white;
  padding: 6px 26px;
  border-radius: 8px 8px 0 0;
  max-height: 40px;
`;
