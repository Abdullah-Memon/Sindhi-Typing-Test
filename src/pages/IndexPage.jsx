// IndexPage.jsx
import { useState } from "react";
import Header from "../components/Header";
// import GameArea from "../components/GameArea";
import Result from "../components/Result";
import { ThemeProvider } from "../components/ThemeProvider";
import GameArea from "../components/GameArea2";
import VirtualKeyboard from "../components/VirtualKeyboard";
import Prerequisite from "../components/Prerequisite";
import Footer from "../components/Footer";

const DEFAULT_SETTINGS = {
  timer: 60,
  textType: "simple",
  inputType: "over",
  fontSize: "text-2xl",
  theme: "dark",
};

const IndexPage = () => {
  const [result, setResult] = useState(null);
  // Lift settings state to this parent component
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const handleFinish = ({ accuracy = 0, wpm = 0, wpmData }) => {
    setResult({ accuracy, wpm, wpmData });
    console.log("Game finished:", { accuracy, wpm, wpmData });
  };

  const handleRestart = () => {
    setResult(null);
  };

  return (
    <ThemeProvider>
      {/* Pass settings state and its setter to Header */}
      <Header settings={settings} onUpdateSettings={setSettings} />

      {/* Logo & Title Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full mx-auto p-6 my-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary-color)]">
            سنڌي ٽائپنگ ٽيسٽ
          </h1>
        </div>
      </div>

      {/* Game Area & Results */}
      <div className="max-w-7xl flex flex-col mx-auto text-white px-4">
        {result === null ? (
          <>
            {/* <GameArea settings={settings} onFinish={handleFinish} /> */}
            {/* <Prerequisite> */}
              <GameArea settings={settings} onFinish={handleFinish} />
            {/* </Prerequisite> */}
          </>
        ) : (
          <Result
            accuracy={result.accuracy}
            wpm={result.wpm}
            wpmData={result.wpmData}
            onRestart={handleRestart}
          />
        )}
      </div>

      <Footer/>
    </ThemeProvider>
  );
};

export default IndexPage;
