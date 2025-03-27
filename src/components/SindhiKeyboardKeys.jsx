import React, { useState, useEffect } from "react";

// 1) NORMAL LAYOUT (example)
const normalLayout = [
  // Row 1
  ["’", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ڏ", "ڌ"],
  // Row 2
  ["ق", "ص", "ي", "ر", "ت", "ٿ", "ع", "ڳ", "و", "پ", "ڇ", "چ", "ڍ"],
  // Row 3
  [ "ا", "س", "د", "ف", "گ", "ه", "ج", "ڪ", "ل", "ک", "ڱ", ],
  // Row 4
  [ "ز", "خ", "ط", "ڀ", "ب", "ن", "م", "،", ".", "ئ"],
  // Row 5
  ["Caps","Shift", "Alt", "Space", "Control", "Backspace"],
];

// 2) SHIFT LAYOUT (example)
const shiftLayout = [
  // Row 1
  ["‘", "!", "ٰ", "ءِ", "ءَ", "ءُ", "ءٌ", "۽", "*", ")", "(","_", "+"],
  // Row 2
  ["َ", "ض", "ِ", "ڙ", "ٽ", "ث", "غ", "ھ", "ُ", "ڦ", "ڃ", "ڄ", "ٺ"],
  // Row 3
  ["آ", "ش", "ڊ", "ڦ", "گھ", "ح", "جھ", "ۡ",":", "؛", "ـ"],
  // Row 4
  ["ذ", "ّ", "ظ", "ء", "ٻ", "ڻ", "۾", "“", "”", "؟"],
  // Row 5
  ["Caps","Shift", "Alt", "Space", "Control", "Backspace"],
];

// 3) SHIFT+ALT LAYOUT (example)
const shiftAltLayout = [
  // Row 1
  ["", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "…", "-", "="],
  // Row 2
  ["Tab", "صليٰ", "عليٰ", "وسلم", "ـ", "ژِ", "ثه", "بِ", "ٖ", "[", "]", "\\", "Return"],
  // Row 3
  ["Caps", "يٰ", "#", "$", "%", "ةَ", "@", "&", "ةِ", ".", "…", "Shift"],
  // Row 4
  ["~", "%", "…", "ٖ", "وُ", "ٻِ", "ــ", "<", ">", "/", "Shift"],
  // Row 5
  ["Caps","Shift", "Alt", "Space", "Control", "Backspace"],
];



// Helper function to pick the correct layout
function getCurrentLayout(shiftActive, altActive) {
  if (shiftActive && altActive) {
    return shiftAltLayout;
  } else if (shiftActive) {
    return shiftLayout;
  }
  return normalLayout;
}

const CombinedSindhiKeyboard = ({ onKeyPress }) => {
  const [shiftActive, setShiftActive] = useState(false);
  const [altActive, setAltActive] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  // Handle a key press from either the on‑screen button or physical keyboard
  const handleKeyClick = (key) => {
    // If user clicks "Shift", toggle shift state
    if (key.toLowerCase() === "shift") {
      setShiftActive((prev) => !prev);
      return;
    }
    // If user clicks "Alt", toggle alt state
    // if (key.toLowerCase() === "alt") {
    //   setAltActive((prev) => !prev);
    //   return;
    // }

    // Otherwise pass key to the parent or log it
    if (onKeyPress) {
      onKeyPress(key);
    } else {
      console.log("Key pressed:", key);
    }
  };

  // Listen for physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      setActiveKey(e.key);

      // If Shift is pressed, turn on shift
      if (e.key === "Shift") {
        setShiftActive(true);
      }
      // If Alt is pressed, turn on alt
      // if (e.key.toLowerCase() === "alt") {
      //   setAltActive(true);
      // }

      // Some common keys to simulate a click
      if (e.key === "Backspace") {
        handleKeyClick("Backspace");
      } else if (e.key === "Tab") {
        handleKeyClick("Tab");
        e.preventDefault(); // avoid tab focus
      } else if (e.key === "Enter") {
        handleKeyClick("Return");
      } else if (e.key === " ") {
        handleKeyClick("Space");
      } else if (e.key.length === 1) {
        handleKeyClick(e.key);
      }
    };

    const handleKeyUp = (e) => {
      setActiveKey(null);
      if (e.key === "Shift") {
        setShiftActive(false);
      }
      if (e.key.toLowerCase() === "alt") {
        setAltActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Return true if the layout key is currently pressed physically
  const isActive = (layoutKey) => {
    if (!activeKey) return false;
    const physical = activeKey.toLowerCase();
    const keyLower = layoutKey.toLowerCase();

    if (keyLower === "space" && physical === " ") return true;
    if (keyLower === "backspace" && physical === "backspace") return true;
    if (keyLower === "tab" && physical === "tab") return true;
    if (keyLower === "return" && physical === "enter") return true;
    // Compare normal letters/punctuation
    return keyLower === physical;
  };

  // Pick the correct layout based on shift/alt states
  const currentLayout = getCurrentLayout(shiftActive, altActive);

  return (
    <div className="inline-block border border-white p-4 rounded-lg">
      {currentLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((key, keyIndex) => {
            // Highlight if physically pressed
            const activeClass = isActive(key)
              ? "bg-purple-600 text-white"
              : "bg-white text-black";

            const buttonClasses =
              "mx-1 px-3 py-2 border border-gray-400 rounded hover:bg-purple-100 focus:outline-none h-12 w-12";

            return (
              <button
                key={keyIndex}
                onClick={() => handleKeyClick(key)}
                className={`${buttonClasses} ${activeClass}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default CombinedSindhiKeyboard;
