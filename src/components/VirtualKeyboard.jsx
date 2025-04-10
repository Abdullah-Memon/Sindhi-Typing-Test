import React, { useState, useMemo, useEffect } from "react";
import { keyMappings } from "./data";

const VirtualKeyboard = ({ onKeyPress }) => {
  const [shiftActive, setShiftActive] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const reverseKeyMapping = useMemo(() => {
    const mapping = {};
    Object.entries(keyMappings).forEach(([sindhiChar, engKey]) => {
      mapping[engKey.toLowerCase()] = sindhiChar;
    });
    return mapping;
  }, []);

  const handleKeyPress = (key) => {
    const normalizedKey = key.toLowerCase();
    setActiveKey(key);

    switch (normalizedKey) {
      case "shift":
      case "⇧":
      case "⬆":
        setShiftActive(true);
        return;
      case "backspace":
      case "⌫":
        onKeyPress("backspace");
        return;
      case "enter":
      case "⏎":
      case "↩":
        onKeyPress("\n");
        return;
      case "space":
      case "␣":
        onKeyPress(" ");
        return;
      case "tab":
      case "↹":
        onKeyPress("\t");
        return;
      default:
        break;
    }

    const keyIdentifier = shiftActive
      ? `shift + ${normalizedKey}`
      : normalizedKey;
    const mappedChar =
      reverseKeyMapping[keyIdentifier] ||
      reverseKeyMapping[normalizedKey] ||
      key;
    onKeyPress(mappedChar);
  };

  const handleKeyRelease = (key) => {
    setActiveKey(null);
    if (["shift", "⇧", "⬆"].includes(key.toLowerCase())) {
      setShiftActive(false);
    }
  };

  const getDisplayChar = (key) => {
    const specialKeys = {
      shift: "⇧",
      alt: "alt",
      backspace: "⌫",
      enter: "⏎",
      tab: "↹",
      caps: "⇪",
      space: "␣",
      "↩": "⏎",
      "⬆": "⇧",
      "⌫": "⌫",
    };

    if (specialKeys[key.toLowerCase()]) return specialKeys[key.toLowerCase()];
    const identifier = shiftActive ? `shift + ${key}` : key;
    return reverseKeyMapping[identifier.toLowerCase()] || key;
  };

  // Styles
  const baseKeyClasses = `rounded flex justify-center items-center shadow select-none transition-all duration-100 ${
    isMobile ? "text-xs px-1 py-0.5" : "text-sm px-2 py-1"
  }`;
  const specialKeyStyle = "bg-[var(--primary-color)] w-max text-white font-semibold";
  const defaultKeyStyle = "bg-white text-gray-900 hover:bg-gray-200";
  const pressedKeyStyle = "ring-2 ring-[var(--primary-color)] scale-95";
  const rowClass = `flex ${isMobile ? "mb-1" : "mb-2"}`;

  // Unified keyboard layout (corrected to match QWERTY)
  const keyboardLayout = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=",],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    [ "z", "x", "c", "v", "b", "n", "m", ",", ".", "/",  "⌫"],
    ["⇧","space","alt"],
  ];

  // Calculate key widths accounting for margins
  const getKeyWidth = (key, row) => {
    const totalKeys = row.length;
    const marginPerKey = isMobile ? 1 : 2; // Total horizontal margin (0.5rem * 2 or 1rem * 2)
    const totalMargin = marginPerKey * (totalKeys - 1);

    if (key === "space" || key === "␣") {
      const spacePercentage = isMobile ? 30 : 40;
      return `calc(${spacePercentage}% - ${
        totalMargin * (spacePercentage / 100)
      }px)`;
    }

    const regularKeysCount = row.filter(
      (k) => k !== "space" && k !== "␣"
    ).length;
    const remainingPercentage =
      72 -
      (row.includes("space") || row.includes("␣") ? (isMobile ? 30 : 40) : 0);
    return `calc(${remainingPercentage / regularKeysCount}% - ${
      (totalMargin * (remainingPercentage / 100)) / regularKeysCount
    }px)`;
  };

  return (
    <div
      className={`w-full flex flex-col items-center mx-auto mt-4 bg-gray-100 py-4 rounded-lg shadow-md overflow-hidden`}
    >
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className={rowClass}>
          {row.map((key, keyIndex) => {
            const isSpecial = [
              "⇧",
              "⎇",
              "⌫",
              "⏎",
              "↹",
              "⇪",
              "␣",
            ].includes(key);
            const isPressed = activeKey === key;

            return (
              <button
                key={`${key}-${rowIndex}`}
                onMouseDown={() => handleKeyPress(key)}
                onMouseUp={() => handleKeyRelease(key)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyPress(key);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleKeyRelease(key);
                }}
                className={`${baseKeyClasses} ${
                  isPressed ? pressedKeyStyle : ""
                } ${isSpecial ? specialKeyStyle : defaultKeyStyle}`}
                style={{
                  width: getKeyWidth(key, row),
                  marginLeft: keyIndex === 0 ? 0 : isMobile ? "0.5rem" : "1rem",
                  flexShrink: 0,
                  flexGrow: 0,
                }}
              >
                {getDisplayChar(key)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
