// components/Setting.jsx
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import SettingIcon from "../assets/setting.svg";

// Cookie Key
const COOKIE_KEY = "typingSettings";

// Default Settings
const DEFAULT_SETTINGS = {
  timer: 60,
  textType: "simple",
  hint: true,
  inputType: "over",
  fontSize: "text-2xl",
  theme: "dark",
  showKeyboard: true,
  mode: "test",
  keySound: false,
};

// Options for dropdowns
const options = {
  timer: [
    { label: "30 سيڪنڊ", value: 30 },
    { label: "45 سيڪنڊ", value: 45 },
    { label: "60 سيڪنڊ", value: 60 },
    { label: "90 سيڪنڊ", value: 90 },
    { label: "120 سيڪنڊ", value: 120 },
  ],
  textType: [
    { label: "سادي مشق", value: "simple" },
    { label: "وچولي مشق", value: "medium" },
    { label: "مشڪل مشق", value: "hard" },
  ],
  inputType: [
    { label: "مٿان لکو", value: "over" },
    { label: "الڳ جاءِ تي لکو", value: "under" },
  ],
  mode: [
    { label: "ٽيسٽ", value: "test" },
    { label: "مشڪ", value: "practice" },
  ],
};

const fontSizeSteps = [
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
  "text-7xl",
  "text-8xl",
  "text-9xl",
];

// Utility to detect mobile
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const Setting = ({ onUpdateSettings }) => {
  const [pendingSettings, setPendingSettings] = useState(DEFAULT_SETTINGS);
  const [showSetting, setShowSetting] = useState(false);
  const panelRef = useRef(null);

  // Load settings (and adjust for mobile)
  useEffect(() => {
    const cookieSettings = Cookies.get(COOKIE_KEY);
    let settings = DEFAULT_SETTINGS;

    if (cookieSettings) {
      try {
        settings = JSON.parse(cookieSettings);
      } catch (err) {
        console.warn("Invalid cookie data:", err);
      }
    }

    if (isMobile()) {
      settings.showKeyboard = true;
      settings.inputType = "under"; // Disable typing on mobile
    }

    setPendingSettings(settings);
    onUpdateSettings(settings);
  }, [onUpdateSettings]);

  // Change setting in state
  const handleChange = (key, value) => {
    setPendingSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSettingClick = () => {
    setShowSetting((prev) => !prev);
  };

  const handleApply = () => {
    const settingsToSave = { ...pendingSettings };

    // Force mobile overrides before saving
    if (isMobile()) {
      settingsToSave.showKeyboard = true;
      settingsToSave.inputType = "under";
    }

    Cookies.set(COOKIE_KEY, JSON.stringify(settingsToSave), { expires: 365 });
    onUpdateSettings(settingsToSave);
    setShowSetting(false);
  };

  const handleCancel = () => {
    const cookieSettings = Cookies.get(COOKIE_KEY);
    let settings = DEFAULT_SETTINGS;

    if (cookieSettings) {
      try {
        settings = JSON.parse(cookieSettings);
      } catch (err) {
        // fallback
      }
    }

    if (isMobile()) {
      settings.showKeyboard = true;
      settings.inputType = "under";
    }

    setPendingSettings(settings);
    setShowSetting(false);
  };

  // Close on outside click / ESC key
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
            <h2 className="text-xl font-bold text-[var(--primary-color)] mb-6">
              Settings
            </h2>
            <div className="space-y-4">
              {/* Mode */}
              <SettingDropdown
                label="انداز مٽايو"
                value={pendingSettings.mode}
                options={options.mode}
                onChange={(val) => handleChange("mode", val)}
              />

              {/* Timer - Only show in test mode */}
              {pendingSettings.mode === "test" && (
                <SettingDropdown
                  label="وقت مقرر ڪريو"
                  value={pendingSettings.timer}
                  options={options.timer}
                  onChange={(val) => handleChange("timer", Number(val))}
                />
              )}

              {/* Difficulty */}
              <SettingDropdown
                label="مشڪلات مقرر ڪريو"
                value={pendingSettings.textType}
                options={options.textType}
                onChange={(val) => handleChange("textType", val)}
              />

              {/* Typing Mode */}
              <SettingDropdown
                label="لکڻ جو انداز مقرر ڪريو"
                value={pendingSettings.inputType}
                options={options.inputType}
                onChange={(val) => handleChange("inputType", val)}
                disabled={isMobile()}
              />

              {/* Font Size Slider */}
              <div>
                <label className="block text-[var(--primary-color)] mb-1 text-right">
                فونٽ سائيز:
                </label>
                <input
                  type="range"
                  min={0}
                  max={fontSizeSteps.length - 1}
                  value={currentFontIndex}
                  onChange={(e) =>
                    handleChange(
                      "fontSize",
                      fontSizeSteps[Number(e.target.value)]
                    )
                  }
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1 text-right">
                  لفظن جو هاڻوڪو قد:{" "}
                  <span className="font-bold">{currentFontIndex ** 2 * 2}</span>
                </p>
              </div>

              {/* Show Virtual Keyboard Toggle */}
              <ToggleOption
                label="ورچوئل ڪيبورڊ"
                value={pendingSettings.showKeyboard}
                onChange={(val) => handleChange("showKeyboard", val)}
              />
              {/* Show Hint Toggle */}
              <ToggleOption
                label="ڪيبورڊ جا اشارا"
                value={pendingSettings.hint}
                onChange={(val) => handleChange("hint", val)}
              />

              {/* Key Sound (optional) */}
              {/* <ToggleOption label="Key Sound" value={pendingSettings.keySound} onChange={(val) => handleChange("keySound", val)} /> */}
            </div>

            <div className="flex gap-3 mt-6">
            <button
                onClick={handleApply}
                className="px-4 py-1 bg-[var(--primary-color)] text-white rounded hover:bg-opacity-90 transition cursor-pointer"
              >
                تبديلون لاڳو ڪريو
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-1 border border-[var(--primary-color)] text-[var(--primary-color)] rounded transition cursor-pointer"
              >
                رد ڪريو
              </button>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Generic Dropdown
const SettingDropdown = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
}) => (
  <div>
    <label className="block text-[var(--primary-color)] mb-1 text-right">
      {label}:
    </label>
    <select
      className="w-full text-right p-2 bg-gray-50 text-[var(--primary-color)] rounded border border-gray-600 disabled:opacity-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Toggle
const ToggleOption = ({ label, value, onChange }) => (
  <div className="flex items-center flex-row-reverse justify-between">
    <span className="text-[var(--primary-color)]">{label}</span>
    <label className="inline-flex items-center cursor-pointer relative">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="w-11 h-6 bg-gray-400 rounded-full peer peer-checked:bg-[var(--primary-color)] transition" />
      <div className="w-4 h-4 bg-white rounded-full absolute transform peer-checked:translate-x-6 translate-x-1 transition" />
    </label>
  </div>
);

export default Setting;
