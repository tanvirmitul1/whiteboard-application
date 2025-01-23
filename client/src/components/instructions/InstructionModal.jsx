import React, { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";

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
      ],
    },
    {
      category: "Keyboard Shortcuts",
      items: [
        { id: 6, text: "Undo: Press Ctrl + Z." },
        { id: 7, text: "Redo: Press Ctrl + Y." },
        { id: 8, text: "Select a shape and use the arrow keys to nudge." },
        { id: 9, text: "Press ESC to remove fill color mode." },
        { id: 10, text: "Press Delete to remove the selected shape." },
        { id: 11, text: "Press Ctrl + C to copy the selected shape." },
        {
          id: 12,
          text: "Press Ctrl + V to paste the copied shape beside the original.",
        },
      ],
    },
    {
      category: "Other Features",
      items: [
        { id: 13, text: "Use the text tool to add text to the canvas." },
        {
          id: 14,
          text: "Resize shapes dynamically by dragging while drawing.",
        },
        {
          id: 15,
          text: "Change shape color by clicking the shape color icon.",
        },
        {
          id: 16,
          text: "Change canvas background color by clicking the background color icon.",
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
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
          borderRadius: "10px",
          padding: "20px 40px",
          width: "90%",
          maxWidth: "70%",
          height: "90%",
          background: "linear-gradient(135deg, #2e2e2e, #4b4b4b)",
          color: "#fff",
        },
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
      }}
      ariaHideApp={false}
    >
      <ModalContainer>
        <ModalHeader>How to Use the Color board App</ModalHeader>
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
      <CloseButton onClick={onClose}>Got It!</CloseButton>
    </Modal>
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

const CloseButton = styled.button`
  background-color: #00d1b2;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  transition: background-color 0.3s;
  &:hover {
    background-color: #007acc;
  }
`;
