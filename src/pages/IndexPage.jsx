// IndexPage.jsx
import { useState } from "react";
import Header from "../components/Header";
import Result from "../components/Result";
import { ThemeProvider } from "../components/ThemeProvider";
import GameArea from "../components/GameArea2";
import Footer from "../components/Footer";

const DEFAULT_SETTINGS = {
  timer: 60,
  textType: "simple",
  inputType: "over",
  fontSize: "text-2xl",
  theme: "dark",
  showKeyboard: true,
  hint: false,
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
      <div className="max-w-6xl w-full mx-auto p-4 my-4">
        <h1 className="flex items-center text-3xl justify-end text-right w-full sm:text-4xl md:text-5xl font-bold text-[var(--text-primary-color)]">
          سنڌي ٽائپنگ{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4.616 18q-.691 0-1.153-.462T3 16.384V7.616q0-.691.463-1.153T4.615 6h14.77q.69 0 1.152.463T21 7.616v8.769q0 .69-.463 1.153T19.385 18zm0-1h14.769q.23 0 .423-.192t.192-.424V7.616q0-.231-.192-.424T19.385 7H4.615q-.23 0-.423.192T4 7.616v8.769q0 .23.192.423t.423.192M9 15.77h6q.31 0 .54-.221q.23-.22.23-.549q0-.31-.23-.54t-.54-.23H9q-.31 0-.54.221q-.23.22-.23.549q0 .31.23.54t.54.23M4 17V7zm2-7.23q.31 0 .54-.23T6.77 9t-.23-.54T6 8.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23T9.77 9t-.23-.54T9 8.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m-12 3q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23m3 0q.31 0 .54-.23t.23-.54t-.23-.54t-.54-.23t-.54.23t-.23.54t.23.54t.54.23"
            />
          </svg>{" "}
        </h1>
      </div>

      {/* Game Area & Results */}
      <div className="max-w-6xl flex flex-col mx-auto text-white px-4">
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

      <Footer />
    </ThemeProvider>
  );
};

export default IndexPage;
