// components/Setting.jsx
import { useState, useEffect } from "react";

const Setting = ({ onUpdateSettings }) => {
  const [settings, setSettings] = useState({
    timer: 60,
    textType: "simple",
    inputType: "over",
    fontSize: "text-2xl",
    theme: 'dark',
  });

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem("typingSettings"));
    if (savedSettings) setSettings(savedSettings);
  }, []);

  useEffect(() => {
    localStorage.setItem("typingSettings", JSON.stringify(settings));
    onUpdateSettings(settings);
  }, [settings, onUpdateSettings]);

  return (
    <div className="p-4 w-full ">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Timer Setting */}
        <div className="w-full">
          <label className="block text-gray-400 mb-1">Timer (seconds):</label>
          <select
            className="w-full p-2 border border-gray-600 rounded text-gray-400"
            value={settings.timer}
            onChange={(e) =>
              setSettings({ ...settings, timer: Number(e.target.value) })
            }
          >
            {[30, 45, 60, 90, 120].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
  
        {/* Difficulty Setting */}
        <div className="w-full">
          <label className="block text-gray-400 mb-1">Difficulty:</label>
          <select
            className="w-full p-2 border border-gray-600 rounded text-gray-400"
            value={settings.textType}
            onChange={(e) =>
              setSettings({ ...settings, textType: e.target.value })
            }
          >
            <option value="simple">Simple</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
  
        {/* Typing Mode Setting */}
        <div className="w-full">
          <label className="block text-gray-400 mb-1">Typing:</label>
          <select
            className="w-full p-2 border border-gray-600 rounded text-gray-400"
            value={settings.inputType}
            onChange={(e) =>
              setSettings({ ...settings, inputType: e.target.value })
            }
          >
            <option value="over">Over Text</option>
            <option value="under">Under Text</option>
          </select>
        </div>
  
        {/* Font Size Setting */}
        <div className="w-full">
          <label className="block text-gray-400 mb-1">Font size:</label>
          <select
            className="w-full p-2 border border-gray-600 rounded text-gray-400"
            value={settings.fontSize}
            onChange={(e) =>
              setSettings({ ...settings, fontSize: e.target.value })
            }
          >
            <option value="text-xl">Small</option>
            <option value="text-2xl">Medium</option>
            <option value="text-4xl">Large</option>
            <option value="text-6xl">Extra Large</option>
          </select>
        </div>
      </div>
    </div>
  );
  
};

export default Setting;
