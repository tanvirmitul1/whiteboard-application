import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import CustomModal from "../modal/CustomModal";

const InstructionModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const instructions = [
    {
      category: "Mouse Features",
      items: [
        { id: 1, text: "Draw lines by clicking and dragging." },
        { id: 2, text: "Draw rectangles with or without fill color." },
        { id: 3, text: "Move shapes by clicking and dragging them." },
        {
          id: 4,
          text: "Erase shapes by clicking near them (like a blackboard eraser).",
        },
        {
          id: 5,
          text: "Draw independently with the Pen tool (click and drag to draw).",
        },
        {
          id: 6,
          text: "Resize shapes dynamically by dragging the edges while drawing.",
        },
        {
          id: 7,
          text: "Change the size of drawn lines, circles, and rectangles directly on the canvas.",
        },
      ],
    },
    {
      category: "Keyboard Shortcuts",
      items: [
        { id: 8, text: "Undo: Press Ctrl + Z." },
        { id: 9, text: "Redo: Press Ctrl + Y." },
        { id: 10, text: "Select a shape and use the arrow keys to nudge." },
        { id: 11, text: "Press ESC to remove fill color mode." },
        { id: 12, text: "Press Delete to remove the selected shape." },
        { id: 13, text: "Press Ctrl + C to copy the selected shape." },
        {
          id: 14,
          text: "Press Ctrl + V to paste the copied shape beside the original.",
        },
        {
          id: 15,
          text: "Move a shape by holding down 'Ctrl' and dragging it.",
        },
      ],
    },
    {
      category: "Other Features",
      items: [
        { id: 16, text: "Use the text tool to add text to the canvas." },
        {
          id: 17,
          text: "Resize text dynamically by dragging the text box corners.",
        },
        {
          id: 18,
          text: "Change shape color by clicking the shape color icon in the toolbar.",
        },
        {
          id: 19,
          text: "Change canvas background color by clicking the background color icon.",
        },
        {
          id: 20,
          text: "Move drawn objects (shapes or text) with a move tool.",
        },
        {
          id: 21,
          text: "Undo or redo your drawing actions using the toolbar buttons.",
        },
        {
          id: 22,
          text: "You can clear all shapes on the canvas by clicking the 'Clear' button.",
        },
        {
          id: 23,
          text: "Save the drawing to your local device or cloud storage.",
        },
        {
          id: 24,
          text: "Zoom in or out by holding 'Ctrl' and scrolling with your mouse.",
        },
      ],
    },
  ];

  const filteredInstructions = instructions.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <CustomModal open={isOpen} onClose={onClose} title="Instructions">
      <ModalContainer>
        <SearchBar
          type="text"
          placeholder="Search instructions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredInstructions.map(
          (section) =>
            section.items.length > 0 && (
              <InstructionSection key={section.category}>
                <SectionTitle>{section.category}</SectionTitle>
                <InstructionList>
                  {section.items.map((item) => (
                    <InstructionItem key={item.id}>
                      {highlightText(item.text, searchQuery)}
                    </InstructionItem>
                  ))}
                </InstructionList>
              </InstructionSection>
            )
        )}
      </ModalContainer>
    </CustomModal>
  );
};

export default InstructionModal;

// Helper function to highlight search query
const highlightText = (text, query) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <HighlightedText key={index}>{part}</HighlightedText>
    ) : (
      part
    )
  );
};

// Styled Components
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ModalHeader = styled.h2`
  color: #ff6f61;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

const SearchBar = styled.input`
  width: 95%;
  padding: 12px;

  border: none;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  background-color: #444;
  color: #fff;
  transition: all 0.3s;
  ::placeholder {
    color: #bbb;
  }
  &:focus {
    background-color: #333;
    border: 2px solid #ff6f61;
  }
`;

const InstructionSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: #00d1b2;
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const InstructionList = styled.ul`
  list-style: none;
  padding: 0;
`;

const InstructionItem = styled.li`
  margin-bottom: 12px;
  font-size: 1rem;
  line-height: 1.6;
  color: #f5f5f5;
  transition: color 0.3s;
  &:hover {
    color: #ff6f61;
  }
`;

const HighlightedText = styled.span`
  background-color: #ffeb3b;
  color: #000;
  padding: 0 3px;
  border-radius: 3px;
`;
