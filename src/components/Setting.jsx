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
        className="rounded-lg outline-none text-[var(--text-primary-color)] hover:rotate-18 transition-transform duration-300 cursor-pointer"
        onClick={handleSettingClick}
        title={'settings'}
      >
        {/* <img src={SettingIcon} alt="Settings" className="h-6 text-red-400" /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke='currentcolor'
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path d="m20.35 8.923l-.366-.204l-.113-.064a2 2 0 0 1-.67-.66c-.018-.027-.034-.056-.066-.112a2 2 0 0 1-.3-1.157l.006-.425c.012-.68.018-1.022-.078-1.328a2 2 0 0 0-.417-.736c-.214-.24-.511-.412-1.106-.754l-.494-.285c-.592-.341-.889-.512-1.204-.577a2 2 0 0 0-.843.007c-.313.07-.606.246-1.191.596l-.003.002l-.354.211c-.056.034-.085.05-.113.066c-.278.155-.588.24-.907.25c-.032.002-.065.002-.13.002l-.13-.001a2 2 0 0 1-.91-.252c-.028-.015-.055-.032-.111-.066l-.357-.214c-.589-.354-.884-.53-1.199-.601a2 2 0 0 0-.846-.006c-.316.066-.612.238-1.205.582l-.003.001l-.488.283l-.005.004c-.588.34-.883.512-1.095.751a2 2 0 0 0-.415.734c-.095.307-.09.649-.078 1.333l.007.424c0 .065.003.097.002.128a2 2 0 0 1-.301 1.027c-.033.056-.048.084-.065.11a2 2 0 0 1-.675.664l-.112.063l-.361.2c-.602.333-.903.5-1.121.738a2 2 0 0 0-.43.73c-.1.307-.1.65-.099 1.338l.002.563c.001.683.003 1.024.104 1.329a2 2 0 0 0 .427.726c.218.236.516.402 1.113.734l.358.199c.061.034.092.05.121.068a2 2 0 0 1 .74.781l.067.12a2 2 0 0 1 .23 1.038l-.007.407c-.012.686-.017 1.03.079 1.337c.085.272.227.523.417.736c.214.24.512.411 1.106.754l.494.285c.593.341.889.512 1.204.577a2 2 0 0 0 .843-.007c.314-.07.607-.246 1.194-.598l.354-.212l.113-.066c.278-.154.588-.24.907-.25l.13-.001h.13c.318.01.63.097.91.252l.092.055l.376.226c.59.354.884.53 1.199.6a2 2 0 0 0 .846.008c.315-.066.613-.239 1.206-.583l.495-.287c.588-.342.883-.513 1.095-.752c.19-.213.33-.463.415-.734c.095-.305.09-.644.078-1.318l-.008-.44v-.127a2 2 0 0 1 .3-1.028l.065-.11a2 2 0 0 1 .675-.664l.11-.061l.002-.001l.361-.2c.602-.334.903-.5 1.122-.738c.194-.21.34-.46.429-.73c.1-.305.1-.647.098-1.327l-.002-.574c-.001-.683-.002-1.025-.103-1.33a2 2 0 0 0-.428-.725c-.217-.236-.515-.402-1.111-.733z" />
            <path d="M8 12a4 4 0 1 0 8 0a4 4 0 0 0-8 0" />
          </g>
        </svg>
      </button>

      {showSetting && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={panelRef}
            className="bg-[var(--keyboard-key)] border border-[var(--text-color)] p-6 rounded-xl shadow-2xl max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold text-[var(--text-primary-color)] mb-4 text-right border-b-1 border-b-gray-300">
              سيٽنگ
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
                <label className="block text-[var(--text-primary-color)] mb-1 text-right">
                  : فونٽ سائيز
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
                <p className="text-sm text-gray-500 -mt-2 text-right">
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
                className="px-4 py-1 border border-[var(--text-primary-color)] text-[var(--text-primary-color)] rounded transition cursor-pointer"
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
    <label className="block text-[var(--text-primary-color)] mb-1 text-right">
      :{label}
    </label>
    <select
      className="w-full text-right p-2 bg-gray-50 text-[var(--text-color)] rounded border border-gray-600 disabled:opacity-50 cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="cursor-pointer">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Toggle
const ToggleOption = ({ label, value, onChange }) => (
  <div className="flex items-center flex-row-reverse justify-between">
    <span className="text-[var(--text-primary-color)]">{label}</span>
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
