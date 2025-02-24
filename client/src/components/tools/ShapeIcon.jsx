import {
  FaRegCircle as CircleIcon, // Circle icon
  FaRegSquare as RectangleIcon, // Rectangle icon
  FaRegHandshake as LineIcon, // For a line, you might use a generic line-like icon
  FaTextHeight as TextIcon, // Text icon from React Icons
  FaPen as PenIcon, // Pen icon
} from "react-icons/fa"; // Importing icons from react-icons/fa

import { IoTriangle as TriangleIcon } from "react-icons/io5";
import { BsPentagon as PentagonIcon } from "react-icons/bs";
import { MdOutlineHexagon as HexagonIcon } from "react-icons/md";

const ShapeIcon = ({ selectedShape }) => {
  const shapeType = selectedShape?.type;

  let IconComponent;

  switch (shapeType) {
    case "line":
      IconComponent = LineIcon;
      break;
    case "circle":
      IconComponent = CircleIcon;
      break;
    case "rectangle":
      IconComponent = RectangleIcon;
      break;
    case "triangle":
      IconComponent = TriangleIcon;
      break;
    case "pentagon":
      IconComponent = PentagonIcon;
      break;
    case "hexagon":
      IconComponent = HexagonIcon;
      break;
    case "text":
      IconComponent = TextIcon;
      break;
    case "pen":
      IconComponent = PenIcon;
      break;
    default:
      return null; // or return a default icon
  }

  return <IconComponent size={24} />;
};

export default ShapeIcon;
