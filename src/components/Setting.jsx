// components/Setting.jsx
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import SettingIcon from "../assets/setting.svg";

const COOKIE_KEY = "typingSettings";

const DEFAULT_SETTINGS = {
  timer: 60,
  textType: "simple",
  inputType: "over",
  fontSize: "text-2xl",
  theme: "dark",
  showKeyboard: true,
  mode: "test",
  keySound: false,
};

const options = {
  timer: [30, 45, 60, 90, 120],
  textType: ["simple", "medium", "hard"],
  inputType: ["over", "under"],
  mode: ["test", "practice"]
};

const fontSizeSteps = ["text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl", "text-9xl"];

const Setting = ({ onUpdateSettings }) => {
  const [pendingSettings, setPendingSettings] = useState(DEFAULT_SETTINGS);
  const [showSetting, setShowSetting] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const cookieSettings = Cookies.get(COOKIE_KEY);
    if (cookieSettings) {
      try {
        const parsed = JSON.parse(cookieSettings);
        setPendingSettings(parsed);
        onUpdateSettings(parsed);
      } catch (err) {
        console.warn("Invalid cookie data:", err);
      }
    } else {
      onUpdateSettings(DEFAULT_SETTINGS);
    }
  }, [onUpdateSettings]);

  const handleChange = (key, value) => {
    setPendingSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSettingClick = () => {
    setShowSetting((prev) => !prev);
  };

  const handleApply = () => {
    Cookies.set(COOKIE_KEY, JSON.stringify(pendingSettings), { expires: 365 });
    onUpdateSettings(pendingSettings);
    setShowSetting(false);
  };

  const handleCancel = () => {
    const cookieSettings = Cookies.get(COOKIE_KEY);
    if (cookieSettings) {
      try {
        const parsed = JSON.parse(cookieSettings);
        setPendingSettings(parsed);
      } catch (err) {
        setPendingSettings(DEFAULT_SETTINGS);
        
      }
    } else {
      setPendingSettings(DEFAULT_SETTINGS);
    }
    setShowSetting(false);
  };

  const handleClickOutside = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      setShowSetting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSetting(false);
    }
  };

  useEffect(() => {
    if (showSetting) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSetting]);

  const currentFontIndex = fontSizeSteps.indexOf(pendingSettings.fontSize);

  return (
    <>
      <button
        className="rounded-lg outline-none text-[var(--primary-color)] hover:rotate-18 transition-transform duration-300 cursor-pointer"
        onClick={handleSettingClick}
      >
        <img src={SettingIcon} alt="Settings" className="h-6" />
      </button>

      {showSetting && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={panelRef}
            className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold text-[var(--primary-color)] mb-6">Settings</h2>
            <div className="space-y-4">
              {/* Timer */}
              <SettingDropdown label="Timer (seconds)" value={pendingSettings.timer} options={options.timer} onChange={(val) => handleChange("timer", Number(val))} />

              {/* Difficulty */}
              <SettingDropdown label="Difficulty" value={pendingSettings.textType} options={options.textType} onChange={(val) => handleChange("textType", val)} />

              {/* Typing Mode */}
              <SettingDropdown label="Typing" value={pendingSettings.inputType} options={options.inputType} onChange={(val) => handleChange("inputType", val)} />

              {/* Mode */}
              <SettingDropdown label="Mode" value={pendingSettings.mode} options={options.mode} onChange={(val) => handleChange("mode", val)} />

              {/* Font Size Slider */}
              <div>
                <label className="block text-[var(--primary-color)] mb-1">Font Size:</label>
                <input
                  type="range"
                  min={0}
                  max={fontSizeSteps.length - 1}
                  value={currentFontIndex}
                  onChange={(e) => handleChange("fontSize", fontSizeSteps[Number(e.target.value)])}
                  className="w-full"
                />
                <p className="text-sm text-gray-300 mt-1">Current: <span className="font-bold">{(currentFontIndex**2)*2}</span></p>
              </div>

              {/* Show Keyboard Toggle */}
              <ToggleOption label="Show Virtual Keyboard" value={pendingSettings.showKeyboard} onChange={(val) => handleChange("showKeyboard", val)} />

              {/* Key Sound Toggle */}
              <ToggleOption label="Key Sound" value={pendingSettings.keySound} onChange={(val) => handleChange("keySound", val)} />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-1 border border-[var(--primary-color)] text-[var(--primary-color)] rounded transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-1 bg-[var(--primary-color)] text-white rounded hover:bg-opacity-90 transition cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SettingDropdown = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-[var(--primary-color)] mb-1">{label}:</label>
    <select
      className="w-full p-2 bg-gray-50 text-[var(--primary-color)] rounded border border-gray-600"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const ToggleOption = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-[var(--primary-color)]">{label}</span>
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[var(--primary-color)] transition"></div>
      <div className="w-4 h-4 bg-white rounded-full absolute transform peer-checked:translate-x-6 translate-x-1 transition"></div>
    </label>
  </div>
);

export default Setting;