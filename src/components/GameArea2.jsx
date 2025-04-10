import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { data, keyMappings } from "./data";

const GameArea = ({ settings, onFinish }) => {
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(settings.timer);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState({ total: 0, correct: 0 });
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [prevLineCount, setPrevLineCount] = useState(0);
  const [wpmData, setWpmData] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time for practice mode

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const textContainerRef = useRef(null);
  const typedTextRef = useRef(null);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);

  const reverseKeyMapping = useMemo(() => {
    const mapping = {};
    Object.entries(keyMappings).forEach(([sindhiChar, engKey]) => {
      const keyLower = engKey.toLowerCase();
      mapping[keyLower === "space" ? " " : keyLower] = sindhiChar;
    });
    return mapping;
  }, []);

  // Initialize game state
  useEffect(() => {
    const sentences = data.sentences[settings.textType];
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setText(randomSentence);
    setTyped("");
    setTimeLeft(settings.timer);
    setStarted(false);
    setFinished(false);
    setOverlayVisible(true);
    setAttempts({ total: 0, correct: 0 });
    setWpmData([]);
    setElapsedTime(0);
  }, [settings]);

  // Compute correct characters
  const computeCorrectChars = useCallback(() => {
    let count = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) count++;
    }
    return count;
  }, [typed, text]);

  // Compute accuracy
  const computeAccuracy = useCallback(() => {
    return attempts.total > 0 ? ((attempts.correct / attempts.total) * 100).toFixed(2) : "0";
  }, [attempts]);

  // Compute WPM: (Correct Characters / 5) / Minutes Elapsed
  const computeWPM = useCallback(() => {
    const correctChars = computeCorrectChars();
    const words = correctChars / 5;
    const elapsedMinutes = settings.mode === "practice" ? elapsedTime / 60 : (settings.timer - timeLeft) / 60;
    return elapsedMinutes > 0 ? Math.round(words / elapsedMinutes) : 0;
  }, [computeCorrectChars, settings.mode, settings.timer, timeLeft, elapsedTime]);

  // Timer for timed mode and elapsed time tracking
  useEffect(() => {
    if (!started || finished) return;

    timerRef.current = setInterval(() => {
      if (settings.mode !== "practice") {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }
      setElapsedTime((prev) => prev + 1); // Increment elapsed time for both modes
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [started, finished, settings.mode]);

  // WPM tracking for graph
  useEffect(() => {
    if (started && !finished) {
      const elapsedSeconds = settings.mode === "practice" ? elapsedTime : (settings.timer - timeLeft);
      const wpm = computeWPM();
      setWpmData((prev) => [...prev, { time: elapsedSeconds, wpm }]);
    }
  }, [elapsedTime, timeLeft, started, finished, settings.mode, computeWPM]);

  // Auto-scrolling
  useEffect(() => {
    if (scrollRef.current && prevLineCount > 1) {
      const lineHeight = scrollRef.current.querySelector("span").offsetHeight;
      scrollRef.current.scrollTop = (prevLineCount - 1) * lineHeight;
    }
  }, [prevLineCount]);

  // Finish game when time runs out in timed mode
  useEffect(() => {
    if (settings.mode !== "practice" && timeLeft === 0 && !finished) {
      finishGame();
    }
  }, [timeLeft, finished, settings.mode]);

  // Caret positioning
  useEffect(() => {
    requestAnimationFrame(() => {
      if (typedTextRef.current && textContainerRef.current) {
        const container = textContainerRef.current;
        const typedRects = typedTextRef.current.getClientRects();
        const lines = Array.from(typedRects);
        const lineCount = lines.length;

        let caretX, caretY;
        if (lines.length > 0) {
          const lastLine = lines[lines.length - 1];
          caretX = lastLine.right - container.getBoundingClientRect().left;
          caretY = lastLine.top - container.getBoundingClientRect().top;
        } else {
          caretX = 0;
          caretY = 0;
        }
        setCaretPosition({ x: caretX, y: caretY });
        setPrevLineCount(lineCount);
      }
    });
  }, [typed, text]);

  const handleStartTyping = () => {
    setOverlayVisible(false);
    containerRef.current?.focus();
    if (settings.inputType === "under") inputRef.current?.focus();
  };

  const finishGame = useCallback(() => {
    clearInterval(timerRef.current);
    setFinished(true);
    const finalWPM = computeWPM();
    const finalWpmData = [...wpmData, { time: settings.mode === "practice" ? elapsedTime : (settings.timer - timeLeft), wpm: finalWPM }];
    onFinish({
      wpm: finalWPM,
      accuracy: computeAccuracy(),
      wpmData: finalWpmData,
    });
  }, [computeWPM, computeAccuracy, wpmData, settings.mode, settings.timer, timeLeft, elapsedTime, onFinish]);

  const handleKeyDown = (e) => {
    if (overlayVisible || finished) return;
    if (!started) setStarted(true);
    e.preventDefault();

    let keyInput = e.shiftKey ? `shift + ${e.key.toLowerCase()}` : e.key.toLowerCase();
    const mappedChar = reverseKeyMapping[keyInput] || reverseKeyMapping[e.key.toLowerCase()] || e.key;

    if (e.key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1));
    } else if ((e.key.length === 1 || e.key === " ") && !e.repeat) {
      const index = typed.length;
      const isCorrect = mappedChar === text[index];
      setAttempts((prev) => ({
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      }));
      const newTyped = typed + mappedChar;
      setTyped(newTyped);

      if (newTyped.length === text.length) {
        finishGame();
      }
    }
  };

  const renderInputField = () => {
    if (settings.inputType === "under") {
      return (
        <textarea
          ref={inputRef}
          value={typed}
          onKeyDown={handleKeyDown}
          placeholder="هتي ٽائپ ڪريو..."
          dir="rtl"
          disabled={overlayVisible}
          inputMode="none"
          className="mt-2 w-full px-4 py-2 bg-white border border-gray-400 rounded text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 focus:outline-none resize-none max-h-[2.5em] overflow-y-hidden"
        />
      );
    }
    return null;
  };

  const renderText = () => (
    <span className="p-1 whitespace-pre-wrap" ref={textContainerRef}>
      <span ref={typedTextRef}>
        {text.slice(0, typed.length).split("").map((char, index) => (
          <span
            key={index}
            className={typed[index] === char ? "text-[var(--text-primary-color)]" : "text-red-500"}
          >
            {char}
          </span>
        ))}
      </span>
      <span>
        {text.slice(typed.length).split("").map((char, index) => (
          <span key={index} className="text-gray-400">{char}</span>
        ))}
      </span>
    </span>
  );

  return (
    <div
      ref={containerRef}
      tabIndex={settings.inputType === "over" ? 0 : -1}
      onKeyDown={settings.inputType === "over" ? handleKeyDown : undefined}
      dir="rtl"
      className="focus:outline-none text-right overflow-hidden px-4 sm:px-6 md:px-8 pt-0"
    >
      {/* Stats Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 border px-4 py-3 rounded shadow-sm mb-8 border-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">
        <p className="text-[var(--text-color)]">
          وقت بچيل: <span>{settings.mode === "practice" ? "∞" : `${timeLeft}s`}</span>
        </p>
        <p className="text-[var(--text-color)]">
          WPM: <span className="text-[var(--text-primary-color)]">{computeWPM()}</span>
        </p>
        <p className="text-[var(--text-color)]">
          درستگي: <span className="text-[var(--text-primary-color)]">{computeAccuracy()}%</span>
        </p>
      </div>

      {/* Typing Area */}
      <div
        ref={scrollRef}
        className={`relative overflow-x-hidden ${
          overlayVisible ? "overflow-y-hidden" : "overflow-y-auto"
        } h-48 pr-1 flex ${settings.fontSize}`}
        onClick={handleStartTyping}
      >
        {renderText()}
        {!finished && (
          <span
            className={`text-[var(--text-primary-color)] absolute ${
              typed.length ? "p-1 blinking-caret" : ""
            }`}
            style={{ left: caretPosition.x, top: caretPosition.y }}
          >
            |
          </span>
        )}
        {overlayVisible && (
          <div className="absolute inset-0 rounded-lg flex justify-center items-center backdrop-blur-sm bg-white/10 shadow-[0_0_50px_rgba(255,255,255,0.2)] transition-all duration-300 cursor-pointer h-full w-full">
            <h1 className="text-[var(--text-primary-color)] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              Click here to start
            </h1>
          </div>
        )}
      </div>

      {/* Hint Section */}
      {!finished && !overlayVisible && keyMappings[text[typed.length] || ""] && (
        <div className="text-[var(--text-color)] flex flex-col sm:flex-row items-center border-t border-gray-200 pt-4 mt-2 text-xs sm:text-sm md:text-base lg:text-lg">
          <p>
            اشارو: (<span className="font-medium">{keyMappings[text[typed.length]]}</span>)
          </p>
        </div>
      )}

      {renderInputField()}
    </div>
  );
};

export default GameArea;