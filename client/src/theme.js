import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",

    // 🎨 Primary UI Colors
    primary: {
      main: "#1976d2", // Main UI color (toolbar, active icons)
      contrastText: "#ffffff", // Text on primary-colored buttons
    },
    secondary: {
      main: "#ff9800", // Accent color (secondary actions)
      contrastText: "#ffffff",
    },

    // 📌 UI Backgrounds
    background: {
      default: "#ffffff", // Main background (canvas area)
      paper: "#f5f5f5", // Sidebar / toolbars
      toolbar: "#e0e0e0", // Toolbar background
      button: "#e3f2fd", // Button default background
    },

    // ✏️ Drawing Colors
    draw: {
      default: "#000000", // Default drawing color
      highlight: "#ff0000", // Highlight color
      disabled: "#bdbdbd", // Disabled tool color
    },

    // 🖌 Shapes, Borders & Fill Colors
    shape: {
      line: "#000000", // Default line color
      rectangle: "#ff5722", // Default rectangle color
      circle: "#4caf50", // Default circle color
      text: "#673ab7", // Default text color
      border: "#616161", // Border for shapes
      fill: "#e0e0e0", // Default fill color for shapes
    },

    // 🔲 Grid, Guidelines & Selection Colors
    grid: {
      main: "#e0e0e0", // Grid lines for alignment
      guide: "#ff5722", // Guidelines for snapping
      selection: "#64b5f6", // Selection box color
    },

    // 🖱 Icons & Buttons
    icon: {
      default: "#616161", // Default icon color
      active: "#1976d2", // Active tool icon color
      hover: "#64b5f6", // Hover state for icons
      disabled: "#bdbdbd", // Disabled icon
    },
    button: {
      default: "#e3f2fd", // Default button background
      hover: "#bbdefb", // Hover state
      active: "#90caf9", // Active button state
    },

    // 🧽 Eraser & Clear Colors
    eraser: {
      main: "#ffffff", // Eraser color (matches canvas)
      background: "#f5f5f5", // Eraser icon background
    },

    // 📝 Text & Labels
    text: {
      primary: "#000000",
      secondary: "#555555",
      label: "#9e9e9e", // Label color for tools
    },
    // Custom Input Colors
    input: {
      border: "#bdbdbd", // Input border color
      background: "#ffffff", // Input background color
      focus: "#1976d2", // Focus border color
      placeholder: "#9e9e9e", // Placeholder text color
    },
    whiteBoard: {
      background: "#ffffff",
      border: "#bdbdbd",
      fill: "#ff5722",
      draw: "#ff5722",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--primary-main": "#1976d2",
          "--primary-contrast-text": "#ffffff",
          "--secondary-main": "#ff9800",
          "--secondary-contrast-text": "#ffffff",
          "--background-default": "#ffffff",
          "--background-paper": "#f5f5f5",
          "--background-toolbar": "#e0e0e0",
          "--background-button": "#e3f2fd",
          "--draw-default": "#000000",
          "--draw-highlight": "#ff0000",
          "--draw-disabled": "#bdbdbd",
          "--shape-line": "#000000",
          "--shape-rectangle": "#ff5722",
          "--shape-circle": "#4caf50",
          "--shape-text": "#673ab7",
          "--shape-border": "#616161",
          "--shape-fill": "#e0e0e0",
          "--grid-main": "#e0e0e0",
          "--grid-guide": "#ff5722",
          "--grid-selection": "#64b5f6",
          "--icon-default": "#616161",
          "--icon-active": "#1976d2",
          "--icon-hover": "#64b5f6",
          "--icon-disabled": "#bdbdbd",
          "--button-default": "#e3f2fd",
          "--button-hover": "#bbdefb",
          "--button-active": "#90caf9",
          "--eraser-main": "#ffffff",
          "--eraser-background": "#f5f5f5",
          "--text-primary": "#000000",
          "--text-secondary": "#555555",
          "--text-label": "#9e9e9e",
          "--input-border": "#bdbdbd",
          "--input-background": "#ffffff",
          "--input-focus": "#1976d2",
          "--input-placeholder": "#9e9e9e",
          "--whiteboard-background": "#ffffff",
          "--whiteboard-border": "#bdbdbd",
          "--whiteboard-fill": "#ff5722",
          "--whiteboard-draw": "#ff5722",
          "--primary-bg-color": "#0A0A13",
          "--secondary-bg-color": "#131324",
          "--text-color": "#c4c2c2",
          "--white": "rgb(255, 255, 255)",
          "--canvas-bg-color": "#242441",
          "--canvas-draw-color": "#ff3be5",
          "--drawing-card-background": "#242526",
          "--title-text-color": "#ffcc80",
          "--background-read": "#f5f5f5",
          "--background-unread": "#e0e0e0",
          "--button-bg": "#90caf9",
          "--button-text": "#000000",
          "--popover-bg": "#1e1e1e",
          "--scrollbar-bg": "rgba(255, 255, 255, 0.1)",
          "--scrollbar-thumb-bg": "#4a90e2",
          "--scrollbar-thumb-hover-bg": "#3572b0",
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#06D69B",
      contrastText: "#000000",
    },
    secondary: {
      main: "#ffb74d",
      contrastText: "#000000",
    },

    background: {
      default: "#121212",
      paper: "#1e1e1e",
      toolbar: "#ffffff",
      button: "#424242",
    },

    draw: {
      default: "#ffffff",
      highlight: "#ff4081",
      disabled: "#757575",
    },

    shape: {
      line: "#ffffff",
      rectangle: "#ff7043",
      circle: "#66bb6a",
      text: "#9575cd",
      border: "#bdbdbd",
      fill: "#333333",
    },

    grid: {
      main: "#444444",
      guide: "#ff7043",
      selection: "#64b5f6",
    },

    icon: {
      default: "#bdbdbd",
      active: "#bb86fc",
      hover: "#e1bee7",
      disabled: "#616161",
    },
    button: {
      default: "#424242",
      hover: "#616161",
      active: "#757575",
    },

    eraser: {
      main: "#121212",
      background: "#1e1e1e",
    },

    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
      label: "#9e9e9e",
    },
    // Custom Input Colors
    input: {
      border: "#757575", // Input border color
      background: "#333333", // Input background color
      focus: "#bb86fc", // Focus border color
      placeholder: "#9e9e9e", // Placeholder text color
    },
    whiteBoard: {
      background: "#242441",
      border: "#424242",
      fill: "#4dd0e1",
      draw: "#4dd0e1",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--primary-main": "#bb86fc",
          "--primary-contrast-text": "#000000",
          "--secondary-main": "#ffb74d",
          "--secondary-contrast-text": "#000000",
          "--background-default": "#121212",
          "--background-paper": "#1e1e1e",
          "--background-toolbar": "#282828",
          "--background-button": "#424242",
          "--draw-default": "#ffffff",
          "--draw-highlight": "#ff4081",
          "--draw-disabled": "#757575",
          "--shape-line": "#ffffff",
          "--shape-rectangle": "#ff7043",
          "--shape-circle": "#66bb6a",
          "--shape-text": "#9575cd",
          "--shape-border": "#bdbdbd",
          "--shape-fill": "#333333",
          "--grid-main": "#444444",
          "--grid-guide": "#ff7043",
          "--grid-selection": "#64b5f6",
          "--icon-default": "#bdbdbd",
          "--icon-active": "#bb86fc",
          "--icon-hover": "#e1bee7",
          "--icon-disabled": "#616161",
          "--button-default": "#424242",
          "--button-hover": "#616161",
          "--button-active": "#757575",
          "--eraser-main": "#121212",
          "--eraser-background": "#1e1e1e",
          "--text-primary": "#ffffff",
          "--text-secondary": "#b0b0b0",
          "--text-label": "#9e9e9e",
          "--input-border": "#757575",
          "--input-background": "#333333",
          "--input-focus": "#bb86fc",
          "--input-placeholder": "#9e9e9e",
          "--whiteboard-background": "#242441",
          "--whiteboard-border": "#424242",
          "--whiteboard-fill": "#4dd0e1",
          "--whiteboard-draw": "#4dd0e1",
          "--primary-bg-color": "#0A0A13",
          "--secondary-bg-color": "#131324",
          "--text-color": "#c4c2c2",
          "--white": "rgb(255, 255, 255)",
          "--canvas-bg-color": "#242441",
          "--canvas-draw-color": "#ff3be5",
          "--drawing-card-background": "#242526",
          "--title-text-color": "#ffcc80",
          "--background-read": "#292828",
          "--background-unread": "#444647",
          "--button-bg": "#90caf9",
          "--button-text": "#000000",
          "--popover-bg": "#1e1e1e",
          "--scrollbar-bg": "rgba(255, 255, 255, 0.1)",
          "--scrollbar-thumb-bg": "#2c3e50",
          "--scrollbar-thumb-hover-bg": "#34495e",
        },
      },
    },
  },
});
