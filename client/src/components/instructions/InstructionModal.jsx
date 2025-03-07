import React, { useState } from "react";
import styled from "styled-components";
import CustomModal from "../modal/CustomModal";

import { useTheme } from "@mui/material";
import { activityInstructions } from "../../utils/constants";

const InstructionModal = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredInstructions = activityInstructions?.filter(
    ({ activity, details }) =>
      activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      details.some((detail) =>
        detail.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <CustomModal open={isOpen} onClose={onClose} title="Instructions">
      <ModalContainer>
        <SearchInput
          theme={theme}
          type="text"
          placeholder="Search instructions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredInstructions.map(({ activity, icon, details }) => (
          <InstructionCard theme={theme} key={activity}>
            <CardHeader theme={theme}>
              <Icon theme={theme}>{icon}</Icon>
              <ActivityTitle theme={theme}>{activity}</ActivityTitle>
            </CardHeader>
            <InstructionList theme={theme}>
              {details.map((text, index) => (
                <InstructionItem theme={theme} key={index}>
                  • {text}
                </InstructionItem>
              ))}
            </InstructionList>
          </InstructionCard>
        ))}
        {filteredInstructions.length === 0 && (
          <NoResults theme={theme}>No instructions found.</NoResults>
        )}
      </ModalContainer>
    </CustomModal>
  );
};

export default InstructionModal;

// Styled Components
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 10px;
  justify-content: center;
`;

const SearchInput = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  font-size: 1rem;
  width: 100%;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px ${({ theme }) => theme.palette.primary.contrastText};
  transition: box-shadow 0.3s ease-in-out;
  background-color: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};

  &:hover {
    box-shadow: 0 4px 8px ${({ theme }) => theme.palette.primary.contrastText};
  }
`;

const InstructionCard = styled.div`
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 6px ${({ theme }) => theme.palette.primary.contrastText};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Icon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.palette.secondary.main};
`;

const ActivityTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.palette.secondary.main};
  font-weight: bold;
`;

const InstructionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InstructionItem = styled.li`
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.draw.default};
  line-height: 1.6;
  margin-bottom: 5px;
`;

const NoResults = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 1rem;
  font-style: italic;
`;
