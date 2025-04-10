// // gameArea.jsx
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { data, keyMappings } from "./data";
// import Setting from "../components/Setting";

// const GameArea = ({settings, onFinish }) => {
//   const [text, setText] = useState("");
//   const [typed, setTyped] = useState("");
//   const [timeLeft, setTimeLeft] = useState(settings.timer);
//   const [started, setStarted] = useState(false);
//   const [finished, setFinished] = useState(false);
//   const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
//   const [attempts, setAttempts] = useState({ total: 0, correct: 0 });
//   const [overlayVisible, setOverlayVisible] = useState(true);
//   const [prevLineCount, setPrevLineCount] = useState(0);
//   const [wpmData, setWpmData] = useState([]);

//   const containerRef = useRef(null);
//   const inputRef = useRef(null);
//   const textContainerRef = useRef(null);
//   const typedTextRef = useRef(null);
//   const timerRef = useRef(null);
//   const scrollRef = useRef(null);

//   // Initialize game state whenever settings change
//   useEffect(() => {
//     const sentences = data.sentences[settings.textType];
//     const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
//     setText(randomSentence);
//     setTyped("");
//     setTimeLeft(settings.timer);
//     setStarted(false);
//     setFinished(false);
//     setOverlayVisible(true);
//     setAttempts({ total: 0, correct: 0 });
//     setWpmData([]);
//   }, [settings]);

//   // Compute correctly typed characters
//   const computeCorrectChars = useCallback(() => {
//     let count = 0;
//     for (let i = 0; i < typed.length; i++) {
//       if (typed[i] === text[i]) count++;
//     }
//     return count;
//   }, [typed, text]);

//   // Timer management: decrease timeLeft every second when game is started
//   useEffect(() => {
//     if (started && timeLeft > 0 && !finished) {
//       timerRef.current = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(timerRef.current);
//   }, [started, finished, timeLeft, settings.timer]);

//   // WPM tracking: update on every timer tick
//   useEffect(() => {
//     if (started && !finished && timeLeft < settings.timer) {
//       const elapsedSeconds = settings.timer - timeLeft;
//       const elapsedTime = elapsedSeconds / 60;
//       const wpm = elapsedTime > 0 ? Math.round(computeCorrectChars() / 5 / elapsedTime) || 0 : 0;
//       setWpmData((prevData) => [...prevData, { time: elapsedSeconds, wpm }]);
//     }
//   }, [timeLeft, started, finished, settings.timer, computeCorrectChars]);

//   // End game condition when timer runs out
//   useEffect(() => {
//     if (timeLeft === 0 && !finished) {
//       finishGame();
//     }
//   }, [timeLeft, finished]);

//   // Calculate caret position for the typed text
//   useEffect(() => {
//     requestAnimationFrame(() => {
//       if (typedTextRef.current && textContainerRef.current) {
//         const container = textContainerRef.current;
//         const containerWidth = container.offsetWidth;
//         const typedRect = typedTextRef.current.getClientRects();
//         const lines = Array.from(typedRect);
//         const lineCount = lines.length;
//         let caretX, caretY;
//         if (lines.length > 0) {
//           const lastLine = lines[lines.length - 1];
//           caretX = lineCount > prevLineCount
//             ? containerWidth
//             : containerWidth - lastLine.width - lastLine.width / (typed.length || 1) - 2;
//           caretY = lastLine.top - lines[0].top;
//         } else {
//           caretX = containerWidth;
//           caretY = 0;
//         }
//         setCaretPosition({ x: caretX, y: caretY });
//         setPrevLineCount(lineCount);
//       }
//     });
//   }, [typed, text, prevLineCount]);

//   const computeAccuracy = useCallback(() => {
//     return attempts.total > 0 ? ((attempts.correct / attempts.total) * 100).toFixed(2) : "0";
//   }, [attempts]);

//   const computeWPM = useCallback(() => {
//     const elapsedMinutes = (settings.timer - timeLeft) / 60;
//     return elapsedMinutes > 0 ? Math.round(attempts.correct / 5 / elapsedMinutes) : 0;
//   }, [attempts, settings.timer, timeLeft]);

//   // Start typing event (clears overlay and focuses container)
//   const handleStartTyping = () => {
//     setOverlayVisible(false);
//     containerRef.current?.focus();
//   };

//   // End game and trigger onFinish callback with final metrics
//   const finishGame = () => {
//     clearInterval(timerRef.current);
//     setFinished(true);
//     onFinish({
//       wpm: computeWPM(),
//       accuracy: computeAccuracy(),
//       wpmData: wpmData,
//     });
//   };

//   // Handle key presses for "over" typing mode
//   const handleKeyDown = (e) => {
//     if (overlayVisible || finished) return;
//     if (!started) setStarted(true);
//     e.preventDefault();
//     if (e.key === "Backspace") {
//       setTyped((prev) => prev.slice(0, -1));
//     } else if (e.key.length === 1 || e.key === " ") {
//       if (e.repeat) return;
//       const index = typed.length;
//       const isCorrect = e.key === text[index];
//       setAttempts((prev) => ({
//         total: prev.total + 1,
//         correct: prev.correct + (isCorrect ? 1 : 0),
//       }));
//       const newTyped = typed + e.key;
//       setTyped(newTyped);
//       if (newTyped === text) finishGame();
//     }
//   };

//   // Handle input changes for "under" typing mode
//   const handleInputChange = (e) => {
//     if (overlayVisible) return;
//     if (!started) setStarted(true);
//     const newValue = e.target.value;
//     setTyped(newValue);
//     if (newValue === text) finishGame();
//   };

//   // Render text with correctly typed characters highlighted
//   const renderText = () => (
//     <span className="p-1" ref={textContainerRef}>
//       <span ref={typedTextRef}>
//         {text.slice(0, typed.length).split("").map((char, index) => (
//           <span
//             key={index}
//             className={
//               typed[index] === char
//                 ? "text-[var(--text-primary-color)]"
//                 : "text-red-500"
//             }
//           >
//             {char}
//           </span>
//         ))}
//       </span>
//       <span>
//         {text.slice(typed.length).split("").map((char, index) => (
//           <span key={index} className="text-gray-400">
//             {char}
//           </span>
//         ))}
//       </span>
//     </span>
//   );

//   return (
//     <>
//       <div
//         ref={containerRef}
//         tabIndex={settings.inputType === "over" ? 0 : -1}
//         onKeyDown={settings.inputType === "over" ? handleKeyDown : undefined}
//         dir="rtl"
//         className="focus:outline-none text-right overflow-hidden px-4 sm:px-6 md:px-8 pt-0"
//       >
//         {/* Stats Section */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 border px-4 py-3 rounded shadow-sm border-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">
//           <p className="text-[var(--text-color)]">
//           بچيل وقت :{" "}
//             <span className="text-[var(--text-primary-color)]">{timeLeft}s</span>
//           </p>
//           <p className="text-[var(--text-color)]">
//             WPM:{" "}
//             <span className="text-[var(--text-primary-color)]">
//               {timeLeft === settings.timer
//                 ? 0
//                 : Math.round(
//                     computeCorrectChars() /
//                       5 /
//                       ((settings.timer - timeLeft) / 60)
//                   ) || 0}
//             </span>
//           </p>
//           <p className="text-[var(--text-color)]">
//             درستگي:{" "}
//             <span className="text-[var(--text-primary-color)]">
//               %{computeAccuracy()}
//             </span>
//           </p>
//         </div>

//         {/* Typing Area */}
//         <div
//           ref={scrollRef}
//           className={`relative overflow-x-hidden ${
//             overlayVisible ? "overflow-y-hidden" : "overflow-y-auto"
//           } h-48 pr-1 flex ${settings.fontSize}`}
//         >
//           {renderText()}
//           {/* Caret */}
//           {!finished && (
//             <span
//               className={`text-[var(--text-primary-color)] absolute ${
//                 typed.length ? "p-1 blinking-caret" : ""
//               }`}
//               style={{ left: caretPosition.x, top: caretPosition.y }}
//             >
//               |
//             </span>
//           )}
//           {/* Overlay: Click to start */}
//           {overlayVisible && (
//             <div
//               className="absolute inset-0 rounded-lg flex justify-center items-center backdrop-blur-sm bg-white/10 shadow-[0_0_50px_rgba(255,255,255,0.2)] before:absolute before:inset-0 before:rounded-lg before:bg-white/20 before:blur-xl before:opacity-30 transition-all duration-300 hover:before:opacity-40 cursor-pointer h-full w-full"
//               onClick={handleStartTyping}
//             >
//               <h1 className="text-[var(--text-primary-color)] font-semibold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
//                 Click here to start
//               </h1>
//             </div>
//           )}
//         </div>

//         {/* Hint Section */}
//         {!finished && !overlayVisible && keyMappings[text[typed.length] || ""] && (
//           <div className="text-[var(--text-color)] flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 pt-4 px-4 text-sm sm:text-lg md:text-xl">
//             <p className="text-left">
//               <span>اشارو:</span> ( {keyMappings[text[typed.length] || ""]} )
//             </p>
//             {settings.inputType === "over" && (
//               <p className="text-left">متن تي سڌو ٽائپ ڪريو</p>
//             )}
//           </div>
//         )}

//         {/* Input Field for "under" typing mode */}
//         {settings.inputType === "under" && (
//           <textarea
//             ref={inputRef}
//             value={typed}
//             onChange={handleInputChange}
//             placeholder="هتي ٽائپ ڪريو..."
//             dir="rtl"
//             disabled={overlayVisible}
//             className="mt-2 w-full px-4 py-2 bg-white border border-gray-400 rounded text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 focus:outline-none resize-none max-h-[2.5em] overflow-y-hidden"
//           />
//         )}
//       </div>
//       {/* <div className="mt-8">
//         <Setting onUpdateSettings={setSettings} />
//       </div> */}
//     </>
//   );
// };

// export default GameArea;
