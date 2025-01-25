import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ChromePicker } from "react-color";
import {
  FaTrashAlt,
  FaCopy,
  FaPaste,
  FaArrowUp,
  FaArrowDown,
  FaFillDrip,
} from "react-icons/fa";
import {
  copyShape,
  deleteShape,
  pasteShape,
  takeToFront,
  takeToBack,
  changeFillColor,
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const colorPickerRef = useRef(null);
  const [pickerType, setPickerType] = useState("fill");
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

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
    changeFillColor(
      pickerType,
      selectedShapeIndex,
      color.hex,
      shapes,
      setShapes,
      drawAllShapes
    );
  };

  const handleOpenColorPicker = (pickerType) => {
    setPickerType(pickerType);
    setShowColorPicker(true);
  };

  const handleClickOutside = (event) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target)
    ) {
      setShowColorPicker(false);
    }
  };

  useEffect(() => {
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

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
          <ContextMenuItem disable={!copiedShape} onClick={handlePaste}>
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
          {!["text", "pen", "line"].includes(selectedShape?.type) && (
            <ContextMenuItem onClick={() => handleOpenColorPicker("fill")}>
              <FaFillDrip /> Change Fill Color
            </ContextMenuItem>
          )}
          <ContextMenuItem onClick={() => handleOpenColorPicker("stroke")}>
            <FaFillDrip /> Change Color
          </ContextMenuItem>
        </ContextMenu>
      )}

      {showColorPicker && (
        <ColorPickerContainer ref={colorPickerRef}>
          <ChromePicker
            color={currentColor}
            onChangeComplete={handleColorChange}
          />
        </ColorPickerContainer>
      )}
    </div>
  );
};

export default ShapeContextBar;

const SuggestionBox = styled.span`
  opacity: 0.4;
`;

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
  pointer-events: ${(props) => (props.disable ? "none" : "auto")};
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  opacity: ${(props) => (props.disable ? 0.5 : 1)};

  &:hover {
    background-color: #4caf50;
    color: #ffffff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const ColorPickerContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  background: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
`;
