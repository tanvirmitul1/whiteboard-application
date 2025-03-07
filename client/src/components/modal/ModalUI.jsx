import styled from "styled-components";
import { GridCloseIcon } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";

export const ModalHeader = ({ title, onClose }) => {
  const theme = useTheme(); // Get theme inside the component

  return (
    <Header theme={theme}>
      <h3 className="text-md font-semibold">{title}</h3>
      <GridCloseIcon sx={{ cursor: "pointer" }} onClick={onClose} />
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) =>
    theme.palette.primary.main}; /* Use MUI theme */
  color: ${({ theme }) => theme.palette.primary.contrastText};
  padding: 6px 26px;
  border-radius: 8px 8px 0 0;
  max-height: 40px;
`;
export const ModalBody = styled.div`
  padding: 16px;
  overflow-y: auto;
  max-height: 82vh;
`;

export const getCustomModalStyles = (theme) => ({
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
    background: theme.palette.background.default, // Use MUI theme
    color: theme.palette.text.primary,
    zIndex: 999,
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden",
  },
});
