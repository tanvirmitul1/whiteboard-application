import styled from "styled-components";
import Typography from "@mui/material/Typography";

export const StyledTypography = styled(Typography)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #b8b0b0;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  opacity: 0.1;
  pointer-events: none;
`;
