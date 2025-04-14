import React, { useState, useMemo, useEffect } from "react";
import { keyMappings } from "./data";

const VirtualKeyboard = ({ onKeyPress }) => {
  const [shiftActive, setShiftActive] = useState(false);
  const [altActive, setAltActive] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Function to record and log key presses
  // const recordKeyPress = (key, source) => {
  //   console.log(`Key pressed: "${key}" via ${source}`);
  // };

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

  const handleVirtualKeyPress = (key) => {
    const normalizedKey = key.toLowerCase();

    if (isMobile) {
      // Mobile: Toggle Shift and Alt
      if (["shift", "⇧", "⬆"].includes(normalizedKey)) {
        setShiftActive((prev) => !prev);
        return;
      }
      if (["alt", "⎇"].includes(normalizedKey)) {
        setAltActive((prev) => !prev);
        return;
      }
    } else {
      // Desktop: Modifier states are toggled temporarily for mouse clicks
      if (["shift", "⇧", "⬆"].includes(normalizedKey)) {
        setShiftActive(true);
        return;
      }
      if (["alt", "⎇"].includes(normalizedKey)) {
        setAltActive(true);
        return;
      }
    }

    // Construct the key identifier based on modifiers
    let keyIdentifier = normalizedKey;
    if (shiftActive && altActive) {
      keyIdentifier = `shift + alt + ${normalizedKey}`;
    } else if (shiftActive) {
      keyIdentifier = `shift + ${normalizedKey}`;
    } else if (altActive) {
      keyIdentifier = `alt + ${normalizedKey}`;
    }

    // Map virtual key to event object for GameArea
    let eventKey;
    switch (normalizedKey) {
      case "backspace":
      case "⌫":
        eventKey = "Backspace";
        break;
      case "enter":
      case "⏎":
      case "↩":
        eventKey = "Enter";
        break;
      case "space":
      case "␣":
        eventKey = " ";
        break;
      case "tab":
      case "↹":
        eventKey = "Tab";
        break;
      default:
        eventKey = key;
        break;
    }

    const event = {
      key: eventKey,
      shiftKey: shiftActive,
      altKey: altActive,
      preventDefault: () => {},
      repeat: false,
      keyIdentifier,
    };
    onKeyPress(event);
  };

  const handleKeyPress = (key) => {
    setActiveKey(key);
    // recordKeyPress(
    //   shiftActive ? `shift + ${key}` : altActive ? `alt + ${key}` : key,
    //   isMobile ? "touch" : "mouse"
    // );
    handleVirtualKeyPress(key);
  };

  const handleKeyRelease = (key) => {
    setActiveKey(null);
    const normalizedKey = key.toLowerCase();
    if (!isMobile) {
      if (["shift", "⇧", "⬆"].includes(normalizedKey)) {
        setShiftActive(false);
      }
      if (["alt", "⎇"].includes(normalizedKey)) {
        setAltActive(false);
      }
    }
  };

  const getDisplayChar = (key) => {
    const specialKeys = {
      shift: "⇧",
      alt: "⎇",
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
    let identifier = key.toLowerCase();
    if (shiftActive && altActive) {
      identifier = `shift + alt + ${key}`;
    } else if (shiftActive) {
      identifier = `shift + ${key}`;
    } else if (altActive) {
      identifier = `alt + ${key}`;
    }
    return reverseKeyMapping[identifier.toLowerCase()] || key;
  };

  // Styles
  const baseKeyClasses = `rounded flex justify-center items-center shadow select-none transition-all duration-150 ${
    isMobile ? "text-xs p-1 min-h-[2rem]" : "text-sm p-2 min-h-[2.5rem]"
  }`;
  const specialKeyStyle = `bg-[var(--primary-color)] text-white font-semibold ${shiftActive && 'bg-white text-[var(--primary-color)]'}`;
  const defaultKeyStyle = "bg-white text-gray-900 hover    -gray-200";
  const pressedKeyStyle = "shadow-md scale-95";
  const toggledKeyStyle = "bg-[var(--primary-color)] text-white";
  const rowClass = (rowIndex) =>
    `grid grid-cols-13 m-0.5 w-full max-w-3xl ${
      isMobile ? "gap-0.5" : "gap-1"
    } ${rowIndex === keyboardLayout.length - 1 ? "" : "justify-center"}`;
  

  // Keyboard layout (corrected)
  const keyboardLayout = [
    ["=", "-", "0", "9", "8", "7", "6", "5", "4", "3", "2", "1", "`"],
    ["\\", "]", "[", "p", "o", "i", "u", "y", "t", "r", "e", "w", "q"],
    ["'", ";", "l", "k", "j", "h", "g", "f", "d", "s", "a", "⇧"],
    ["⌫", "/", ".", ",", "m", "n", "b", "v", "c", "x", "z","⎇"],
    ["space"],
  ];

  // Define column spans for special keys
  const getColumnSpan = (key) => {
    switch (key) {
      case "space":
      case "␣":
        return "span 13";
      case "⇧":
      case "shift":
      case "⬆":
        return "span 2";
      case "⎇":
      case "alt":
        return "span 1";
      case "⌫":
      case "backspace":
        return "span 2";
      default:
        return "span 1";
    }
  };

  return (
    <div className="absolute bottom-0 right-0 left-0 p-4 md:max-w-6xl flex flex-col items-center mx-auto mt-4 bg-gray-50 py-4">
      {keyboardLayout.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={rowClass(rowIndex)}
        >
          {row.map((key, keyIndex) => {
            const isSpecial = ["⇧", "⎇", "⌫", "⏎", "↹", "⇪", "␣"].includes(key);
            const isPressed = activeKey === key;
            const isToggled =
              (["shift", "⇧", "⬆"].includes(key.toLowerCase()) && shiftActive) ||
              (["alt", "⎇"].includes(key.toLowerCase()) && altActive);
  
            return (
              <button
                key={`${key}-${keyIndex}`}
                onMouseDown={() => !isMobile && handleKeyPress(key)}
                onMouseUp={() => !isMobile && handleKeyRelease(key)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleKeyPress(key);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleKeyRelease(key);
                }}
                className={`${baseKeyClasses} ${
                  isPressed
                    ? pressedKeyStyle
                    : isToggled && isMobile
                    ? toggledKeyStyle
                    : isSpecial
                    ? specialKeyStyle
                    : defaultKeyStyle
                }`}
                style={{
                  gridColumn: getColumnSpan(key),
                }}
                tabIndex={-1}
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