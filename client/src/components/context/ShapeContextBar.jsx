import React from "react";
import styled from "styled-components";
import { copyShape, deleteShape, pasteShape } from "../../utils/otherFunctions";

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
    closeContextMenu(); // Close context menu after deleting
  };

  const handleCopy = () => {
    copyShape(selectedShapeIndex, shapes, setCopiedShape);
    closeContextMenu(); // Close context menu after copying
  };

  const handlePaste = () => {
    pasteShape(copiedShape, setShapes, drawAllShapes);
    closeContextMenu(); // Close context menu after pasting
  };

  return (
    <div>
      {contextMenu.visible && selectedShape && (
        <ContextMenu
          top={contextMenu.y}
          left={contextMenu.x}
          onMouseLeave={closeContextMenu}
        >
          <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
          <ContextMenuItem onClick={handleCopy}>Copy</ContextMenuItem>
          <ContextMenuItem onClick={handlePaste}>Paste</ContextMenuItem>
        </ContextMenu>
      )}
    </div>
  );
};

export default ShapeContextBar;

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
  min-width: 150px;
  transition: opacity 0.3s ease-in-out;
  opacity: 0.95;

  &:hover {
    opacity: 1;
  }
`;

const ContextMenuItem = styled.li`
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
