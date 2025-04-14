import React, { useState, useEffect, useRef, useMemo } from "react";
import VirtualKeyboard from "./VirtualKeyboard";
import { data, keyMappings } from "./data";

const GameArea = ({ settings, onFinish }) => {
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(settings.timer);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [attempts, setAttempts] = useState({ total: 0, correct: 0 });
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [wpmData, setWpmData] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const typedTextRef = useRef(null);
  const timerRef = useRef(null);

  const reverseKeyMapping = useMemo(() => {
    const mapping = {};
    Object.entries(keyMappings).forEach(([sindhiChar, engKey]) => {
      mapping[engKey.toLowerCase()] = sindhiChar;
    });
    return mapping;
  }, []);

  // Initialize game state
  useEffect(() => {
    const sentences = data.sentences[settings.textType];
    setText(sentences[Math.floor(Math.random() * sentences.length)]);
    setTyped("");
    setTimeLeft(settings.timer);
    setStarted(false);
    setFinished(false);
    setOverlayVisible(true);
    setAttempts({ total: 0, correct: 0 });
    setWpmData([]);
    setElapsedTime(0);
  }, [settings]);

  // Game logic (timer, WPM, finish)
  useEffect(() => {
    if (!started || finished) return;

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      if (settings.mode !== "practice") {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }

      // Update WPM
      const wpm = computeWPM();
      setWpmData((prev) => [
        ...prev,
        {
          time:
            settings.mode === "practice"
              ? elapsedTime + 1
              : settings.timer - timeLeft,
          wpm,
        },
      ]);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started, finished, settings.mode, settings.timer, timeLeft, elapsedTime]);

  // Auto-scroll to keep typed text visible
  useEffect(() => {
    if (textContainerRef.current && typedTextRef.current) {
      const typedRects = typedTextRef.current.getClientRects();
      const lineCount = typedRects.length;
      if (lineCount > 1) {
        const lineHeight =
          typedTextRef.current.querySelector("span")?.offsetHeight || 0;
        textContainerRef.current.scrollTop = (lineCount - 1) * lineHeight;
      }
    }
  }, [typed, text]);

  const computeCorrectChars = () => {
    return typed
      .split("")
      .reduce((count, char, i) => count + (char === text[i] ? 1 : 0), 0);
  };

  const computeAccuracy = () => {
    return attempts.total > 0
      ? ((attempts.correct / attempts.total) * 100).toFixed(2)
      : "0";
  };

  const computeWPM = () => {
    const words = computeCorrectChars() / 5;
    const minutes =
      settings.mode === "practice"
        ? elapsedTime / 60
        : (settings.timer - timeLeft) / 60;
    return minutes > 0 ? Math.round(words / minutes) : 0;
  };

  const finishGame = () => {
    clearInterval(timerRef.current);
    setFinished(true);
    const finalWPM = computeWPM();
    onFinish({
      wpm: finalWPM,
      accuracy: computeAccuracy(),
      wpmData: [
        ...wpmData,
        {
          time:
            settings.mode === "practice"
              ? elapsedTime
              : settings.timer - timeLeft,
          wpm: finalWPM,
        },
      ],
    });
  };

  const handleStartTyping = () => {
    setOverlayVisible(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (event) => {
    if (overlayVisible || finished) return;
    if (!started) setStarted(true);

    const { key, shiftKey, altKey, repeat } = event;
    let keyInput = key.toLowerCase();
    if (shiftKey && altKey) {
      keyInput = `shift + alt + ${keyInput}`;
    } else if (shiftKey) {
      keyInput = `shift + ${keyInput}`;
    } else if (altKey) {
      keyInput = `alt + ${keyInput}`;
    }

    const mappedChar =
      reverseKeyMapping[keyInput] ||
      reverseKeyMapping[key.toLowerCase()] ||
      key;

    if (key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1));
    } else if ((key.length === 1 || key === " ") && !repeat) {
      const index = typed.length;
      const isCorrect = mappedChar === text[index];
      setAttempts((prev) => ({
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      }));
      setTyped((prev) => prev + mappedChar);

      if (typed.length + 1 === text.length) {
        finishGame();
      }
    }
  };

  // Dynamic cursor color based on input correctness
  const isCorrect =
    typed.length === 0 || typed[typed.length - 1] === text[typed.length - 1];
  const cursorColor = isCorrect ? "var(--text-primary-color)" : "#ef4444"; // Green or red

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="focus:outline-none text-right overflow-hidden px-4 sm:px-6 md:px-8 pt-0"
    >
      {/* Stats Section */}
      <div className="flex sm:flex-row justify-between items-center mb-8 border px-4 py-3 rounded shadow-sm border-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">
        <p className="text-[var(--text-color)]">
        بچيل وقت : {settings.mode === "practice" ? "∞" : `${timeLeft}s`}
        </p>
        <p className="text-[var(--text-color)]">
          WPM:{" "}
          <span className="text-[var(--text-primary-color)]">
            {computeWPM()}
          </span>
        </p>
        <p className="text-[var(--text-color)]">
          درستگي:{" "}
          <span className="text-[var(--text-primary-color)]">
            {computeAccuracy()}%
          </span>
        </p>
      </div>

      {/* Typing Area */}
      <div
        ref={textContainerRef}
        className={`relative overflow-x-hidden ${
          overlayVisible ? "overflow-y-hidden" : "overflow-y-auto"
        } max-h-48 pr-1 flex ${settings.fontSize}`}
        onClick={handleStartTyping}
      >
        <span className="p-1 whitespace-pre-wrap">
          <span ref={typedTextRef}>
            {text
              .slice(0, typed.length)
              .split("")
              .map((char, index) => (
                <span
                  key={index}
                  className={
                    typed[index] === char
                      ? "text-[var(--text-primary-color)]"
                      : "text-red-500"
                  }
                >
                  {char}
                </span>
              ))}
          </span>
          <span>
            {text
              .slice(typed.length)
              .split("")
              .map((char, index) => (
                <span key={index} className="text-gray-400">
                  {char}
                </span>
              ))}
          </span>
        </span>
        {!finished && (
          <textarea
            ref={inputRef}
            value={typed}
            onKeyDown={(e) =>
              handleKeyPress({
                key: e.key,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                repeat: e.repeat,
                preventDefault: e.preventDefault,
              })
            }
            className="absolute inset-0 h-full w-full bg-transparent border-none outline-none text-transparent resize-none pr-2 font-[inherit]"
            style={{
              caretColor: cursorColor,
              caretWidth: "8px",
              fontSize: "inherit",
            }}
            dir="rtl"
            // disabled={overlayVisible}
            inputMode="none"
          />
        )}
        {/* {overlayVisible && (
          <div className="absolute inset-0 rounded-lg flex justify-center items-center backdrop-blur-sm bg-white/10 shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer h-full w-full">
            <h1 className="text-[var(--text-primary-color)] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              Click here to start
            </h1>
          </div>
        )} */}
      </div>

      {/* Hint Section */}
      {settings.hint && !finished && keyMappings[text[typed.length]] && (
        <div className="text-[var(--text-color)] flex flex-col sm:flex-row items-center border-t border-gray-200 pt-4 mt-2 text-xs sm:text-sm md:text-base lg:text-lg">
          <p>
            اشارو: (
            <span className="font-medium">
              {keyMappings[text[typed.length]]}
            </span>
            )
          </p>
        </div>
      )}

      {settings.inputType === "under" && (
        <textarea
          ref={inputRef}
          value={typed}
          onKeyDown={(e) =>
            handleKeyPress({
              key: e.key,
              shiftKey: e.shiftKey,
              altKey: e.altKey,
              repeat: e.repeat,
              preventDefault: e.preventDefault,
            })
          }
          placeholder="هتي ٽائپ ڪريو..."
          dir="rtl"
          disabled={overlayVisible}
          inputMode="none"
          className="mt-2 w-full px-4 py-2 bg-white border border-gray-400 rounded text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 focus:outline-none resize-none max-h-[2.5em] overflow-y-hidden"
        />
      )}

      {settings.showKeyboard && (
        <VirtualKeyboard onKeyPress={handleKeyPress} settings={settings} />
      )}
    </div>
  );
};

export default GameArea;
