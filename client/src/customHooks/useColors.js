import { useMemo } from "react";

const useColors = () => {
  const colors = useMemo(() => {
    return {
      primaryBgColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-bg-color")
        .trim(),
      secondaryBgColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--secondary-bg-color")
        .trim(),
      scrollbarThumbColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--scrollbar-thumb-color")
        .trim(),
      scrollbarThumbHoverColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--scrollbar-thumb-hover-color")
        .trim(),
      scrollbarTrackColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--scrollbar-track-color")
        .trim(),
      scrollbarTrackHoverColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--scrollbar-track-hover-color")
        .trim(),
      textColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--text-color")
        .trim(),
      canvasBgColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--canvas-bg-color")
        .trim(),
      drawingCardBackground: getComputedStyle(document.documentElement)
        .getPropertyValue("--drawing-card-background")
        .trim(),
      titleTextColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--title-text-color")
        .trim(),
      backgroundRead: getComputedStyle(document.documentElement)
        .getPropertyValue("--background-read")
        .trim(),
      backgroundUnread: getComputedStyle(document.documentElement)
        .getPropertyValue("--background-unread")
        .trim(),
      buttonBg: getComputedStyle(document.documentElement)
        .getPropertyValue("--button-bg")
        .trim(),
      buttonText: getComputedStyle(document.documentElement)
        .getPropertyValue("--button-text")
        .trim(),
      white: getComputedStyle(document.documentElement)
        .getPropertyValue("--white")
        .trim(),
      linkColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--link-color")
        .trim(),
      popoverBg: getComputedStyle(document.documentElement)
        .getPropertyValue("--popover-bg")
        .trim(),
      canvasDrawColor: getComputedStyle(document.documentElement)
        .getPropertyValue("--canvas-draw-color")
        .trim(),
    };
  }, []);

  const getColorNames = () => Object.keys(colors);

  return { colors, getColorNames };
};

export default useColors;
