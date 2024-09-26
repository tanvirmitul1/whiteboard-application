import React, { useState } from "react";
import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useColors from "../../customHooks/useColors";
import useAuth from "../../customHooks/useAuth";

// Dark mode colors
const darkModeColors = {
  background: "#1b1b1b",
  text: "#fff",
  iconColor: "#bbb",
  hover: "#555",
};

const ActionButton = ({
  whiteboard,
  handleEditClick,
  handleDeleteClick,
  handleDownload,
}) => {
  const { user } = useAuth();
  console.log({ whiteboard, user });

  const isAuthenticated = () => {
    return user?._id === whiteboard?.user?._id;
  };
  const { colors } = useColors();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    switch (action) {
      case "edit":
        handleEditClick(whiteboard);

        console.log("edit");
        break;
      case "delete":
        handleDeleteClick(whiteboard._id);
        break;
      case "report":
        toast.error(`${action} action not implemented yet`);
        break;
      case "download":
        handleDownload(whiteboard);
        break;
      default:
        break;
    }

    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        style={{
          color: colors.textColor,
          position: "absolute",
          top: "10px",
          right: "10px",
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            backgroundColor: colors.popoverBg,
            color: colors.textColor,
            cursor: "pointer",
          },
        }}
      >
        <List>
          <ListItem
            button
            onClick={() => handleAction("download")}
            style={{
              color: darkModeColors.text,
              "&:hover": { backgroundColor: colors.secondaryBgColor },
            }}
          >
            <ListItemIcon style={{ color: colors.textColor }}>
              <FileDownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Download" />
          </ListItem>
          {isAuthenticated() && (
            <ListItem
              button
              onClick={() => handleAction("edit")}
              style={{
                color: darkModeColors.text,
                "&:hover": { backgroundColor: colors.secondaryBgColor },
              }}
            >
              <ListItemIcon style={{ color: colors.textColor }}>
                <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </ListItem>
          )}

          {isAuthenticated() && (
            <ListItem
              button
              onClick={() => handleAction("delete")}
              style={{
                color: darkModeColors.text,
                "&:hover": { backgroundColor: colors.secondaryBgColor },
              }}
            >
              <ListItemIcon style={{ color: colors.textColor }}>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Delete" />
            </ListItem>
          )}

          <ListItem
            button
            onClick={() => handleAction("report")}
            style={{
              color: darkModeColors.text,
              "&:hover": { backgroundColor: colors.secondaryBgColor },
            }}
          >
            <ListItemIcon style={{ color: colors.textColor }}>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
};

export default ActionButton;
