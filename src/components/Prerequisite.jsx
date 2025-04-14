import React, { useState, useEffect } from "react";

const Prerequisite = ({ children }) => {
  const [isSindhiKeyboardInstalled, setIsSindhiKeyboardInstalled] =
    useState(null);
  const [showWarning, setShowWarning] = useState(false);

  // Check for Sindhi language support and attempt to detect keyboard
  useEffect(() => {
    const checkKeyboard = async () => {
      console.log("System languages:", navigator.languages);
      // Check if Sindhi is in user's language preferences
      const hasSindhiLanguage =
        navigator.languages.includes("sd") ||
        navigator.languages.includes("sd-PK");

      // Check if navigator.keyboard API is available (limited support)
      if ("keyboard" in navigator && navigator.keyboard.getLayoutMap) {
        try {
        //   const layoutMap = await navigator.keyboard.getLayoutMap();
          // MB-Sindhi SK 2.0 uses a phonetic layout; we can't check specific keyboards,
          // but we can assume Sindhi support if language is present
          setIsSindhiKeyboardInstalled(hasSindhiLanguage);
        } catch (error) {
          console.error("Error accessing keyboard layout:", error);
          setIsSindhiKeyboardInstalled(hasSindhiLanguage); // Fallback to language check
        }
      } else {
        // Fallback: Assume installed if Sindhi language is detected
        setIsSindhiKeyboardInstalled(hasSindhiLanguage);
      }

      // Show warning if Sindhi keyboard is not detected
      if (!hasSindhiLanguage) {
        setShowWarning(true);
      }
    };

    checkKeyboard();
  }, []);

  // Attempt to switch to Sindhi keyboard
  useEffect(() => {
    if (isSindhiKeyboardInstalled) {
      // Automatic switching is OS-dependent and not fully supported in browsers
      // We can prompt the user or set input method if possible
      try {
        // Placeholder for switching logic (OS-specific, not directly possible in JS)
        // For example, guide user to switch manually
        console.log("Switched to MB-Sindhi SK 2.0 keyboard (simulated)");
        // In a real app, you might focus an input and suggest pressing Alt+Shift
      } catch (error) {
        console.error("Error switching keyboard:", error);
        setShowWarning(true); // Show warning if switching fails
      }
    }
  }, [isSindhiKeyboardInstalled]);

  // Handle closing the warning
  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  // Handle user confirming keyboard installation
  const handleConfirmKeyboard = () => {
    setIsSindhiKeyboardInstalled(true);
    setShowWarning(false);
  };

  // Render loading state while checking
  if (isSindhiKeyboardInstalled === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-700">
          Checking for MB-Sindhi SK 2.0 keyboard...
        </p>
      </div>
    );
  }

  return (
    <>
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-[var(--background-color)] bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              MB-Sindhi SK 2.0 Keyboard Not Detected
            </h2>
            <p className="text-gray-700 mb-4">
              The MB-Sindhi SK 2.0 keyboard is required to type in Sindhi.
              Please install it or confirm if it’s already installed.
            </p>
            <p className="text-gray-700 mb-4">
              <a
                href="https://keyman.com/keyboards/mbsindhi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download MB-Sindhi SK 2.0
              </a>{" "}
              or follow your OS instructions to add the Sindhi keyboard.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmKeyboard}
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded"
              >
                I Have Installed It
              </button>
              <button
                onClick={handleCloseWarning}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default Prerequisite;
