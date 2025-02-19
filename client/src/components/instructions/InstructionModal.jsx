import React, { useState } from "react";
import styled from "styled-components";
import CustomModal from "../modal/CustomModal";
import {
  MdUndo,
  MdRedo,
  MdContentCopy,
  MdDelete,
  MdFormatColorFill,
  MdMoveToInbox,
  MdTextFields,
  MdGesture,
  MdBrush,
  MdColorLens,
  MdDownload,
  MdEdit,
  MdSearch,
  MdOutlineFormatSize,
  MdLayers,
  MdFileDownload,
} from "react-icons/md";

const activityInstructions = [
  {
    activity: "Draw Pencil/Pen",
    icon: <MdBrush />,
    details: [
      "Use the pencil for freehand sketching.",
      "The pen tool allows smoother, controlled strokes.",
    ],
  },
  {
    activity: "Shapes",
    icon: <MdGesture />,
    details: [
      "Draw rectangles, circles, and other shapes.",
      "Use the fill option to color inside shapes.",
    ],
  },
  {
    activity: "Move Shapes",
    icon: <MdMoveToInbox />,
    details: [
      "Drag shapes to reposition them.",
      "Right-click for additional options like bring to front or send to back.",
    ],
  },
  {
    activity: "Change Color",
    icon: <MdFormatColorFill />,
    details: [
      "Click the shape to change its color.",
      "Use the background color tool to set a canvas background.",
    ],
  },
  {
    activity: "Copy & Paste",
    icon: <MdContentCopy />,
    details: [
      "Press Ctrl + C to copy a shape.",
      "Press Ctrl + V to paste the copied shape beside the original.",
    ],
  },
  {
    activity: "Undo/Redo",
    icon: <MdUndo />,
    details: [
      "Press Ctrl + Z to undo the last action.",
      "Press Ctrl + Y to redo the last undone action.",
    ],
  },
  {
    activity: "Delete",
    icon: <MdDelete />,
    details: [
      "Press Delete to remove the selected shape.",
      "Click the 'Clear' button to remove all shapes on the canvas.",
    ],
  },
  {
    activity: "Text",
    icon: <MdTextFields />,
    details: [
      "Click to add text anywhere on the canvas.",
      "Right-click to change font size and color.",
    ],
  },
  {
    activity: "Download/Save",
    icon: <MdDownload />,
    details: [
      "Save your drawing to your account.",
      "Download your work as an image file.",
    ],
  },
  {
    activity: "Search & Filter Drawings",
    icon: <MdSearch />,
    details: [
      "Search drawings based on user.",
      "Filter drawings by type, date, or creator.",
    ],
  },
  {
    activity: "Edit Drawings",
    icon: <MdEdit />,
    details: [
      "Modify existing drawings easily.",
      "Use selection tools to adjust properties of a shape.",
    ],
  },
  {
    activity: "Context Menu",
    icon: <MdOutlineFormatSize />,
    details: [
      "Right-click a text to change font size.",
      "Right-click a shape to adjust color or layer positioning.",
    ],
  },
  {
    activity: "Layering",
    icon: <MdLayers />,
    details: [
      "Move shapes forward or backward in the layer stack.",
      "Use right-click options for fine control.",
    ],
  },
  {
    activity: "File Download",
    icon: <MdFileDownload />,
    details: [
      "Save your drawing as PNG or JPG.",
      "Option to keep high-quality resolution.",
    ],
  },
];

const InstructionModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInstructions = activityInstructions.filter(
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
          type="text"
          placeholder="Search instructions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredInstructions.map(({ activity, icon, details }) => (
          <InstructionCard key={activity}>
            <CardHeader>
              <Icon>{icon}</Icon>
              <ActivityTitle>{activity}</ActivityTitle>
            </CardHeader>
            <InstructionList>
              {details.map((text, index) => (
                <InstructionItem key={index}>• {text}</InstructionItem>
              ))}
            </InstructionList>
          </InstructionCard>
        ))}
        {filteredInstructions.length === 0 && (
          <NoResults>No instructions found.</NoResults>
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
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out;
  background-color: #333;
  color: #f5f5f5;

  &:hover {
    box-shadow: 0 0 0 2px #00d1b2;
  }
`;

const InstructionCard = styled.div`
  background: #222;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
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
  color: #ff6f61;
`;

const ActivityTitle = styled.h3`
  font-size: 1.2rem;
  color: #00d1b2;
  font-weight: bold;
`;

const InstructionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InstructionItem = styled.li`
  font-size: 1rem;
  color: #f5f5f5;
  line-height: 1.6;
  margin-bottom: 5px;
`;

const NoResults = styled.p`
  text-align: center;
  color: #f5f5f5;
  font-size: 1rem;
  font-style: italic;
`;
