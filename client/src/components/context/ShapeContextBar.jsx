import React from "react";
import styled from "styled-components";
import {
  FaTrashAlt,
  FaCopy,
  FaPaste,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa"; // Importing icons
import {
  copyShape,
  deleteShape,
  pasteShape,
  takeToFront,
  takeToBack,
} from "../../utils/otherFunctions";

const ShapeContextBar = ({
  contextMenu,
  closeContextMenu,
  selectedShapeIndex,
  shapes,
  setShapes,
  drawAllShapes,
  copiedShape,
  setCopiedShape,
}) => {
  const selectedShape = shapes[selectedShapeIndex];

  const handleDelete = () => {
    deleteShape(selectedShapeIndex, shapes, setShapes, drawAllShapes);
    closeContextMenu();
  };

  const handleCopy = () => {
    copyShape(selectedShapeIndex, shapes, setCopiedShape);
    closeContextMenu();
  };

  const handlePaste = () => {
    pasteShape(copiedShape, setShapes, drawAllShapes);
    closeContextMenu();
  };

  const handleTakeToFront = () => {
    takeToFront(selectedShapeIndex, shapes, setShapes, drawAllShapes);
    closeContextMenu();
  };

  const handleTakeToBack = () => {
    takeToBack(selectedShapeIndex, shapes, setShapes, drawAllShapes);
    closeContextMenu();
  };

  return (
    <div>
      {contextMenu.visible && selectedShape && (
        <ContextMenu
          top={contextMenu.y}
          left={contextMenu.x}
          onMouseLeave={closeContextMenu}
        >
          <ContextMenuItem onClick={handleDelete}>
            <FaTrashAlt /> Delete
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCopy}>
            <FaCopy /> Copy <SuggestionBox>(Ctrl + C)</SuggestionBox>
          </ContextMenuItem>
          <ContextMenuItem onClick={handlePaste}>
            <FaPaste /> Paste <SuggestionBox>(Ctrl + V)</SuggestionBox>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleTakeToFront}>
            <FaArrowUp /> Take to Front{" "}
            <SuggestionBox>(Ctrl + F)</SuggestionBox>
          </ContextMenuItem>
          <ContextMenuItem onClick={handleTakeToBack}>
            <FaArrowDown /> Take to Back{" "}
            <SuggestionBox>(Ctrl + B)</SuggestionBox>
          </ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  );
};

export default ShapeContextBar;

const SuggestionBox = styled.span`
  opacity: 0.4;
`;

// Styled components
const ContextMenu = styled.ul`
  position: absolute;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  list-style: none;
  padding: 10px 0;
  border-radius: 8px;
  z-index: 1000;
  min-width: 180px;
  opacity: 0.95;

  &:hover {
    opacity: 1;
  }
`;

const ContextMenuItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px; /* Spacing between icon and text */
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

  &:hover {
    background-color: #4caf50;
    color: #ffffff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
`;
