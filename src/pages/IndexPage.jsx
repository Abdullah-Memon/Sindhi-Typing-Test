import { useState } from "react";
import Header from "../components/Header";
import GameArea from "../components/GameArea";
import Result from "../components/Result";
import { ThemeProvider } from "../components/ThemeProvider";
import Logo from "../assets/ambile-logo.png";

const IndexPage = () => {
  

  const [result, setResult] = useState(null);

  const handleFinish = ({ accuracy = 0, wpm = 0, wpmData }) => {
    setResult({ accuracy, wpm, wpmData });
    console.log("Game finished:", { accuracy, wpm, wpmData });
  };

  const handleRestart = () => {
    setResult(null);
  };

  return (
    <ThemeProvider>
      <Header />

      {/* Logo & Title Section */}
      <div className="flex flex-col md:flex-row items-center justify-center w-full mx-auto p-6">
        {/* <img
          src={Logo}
          className="h-18 md:h-24 lg:h-32 p-2 object-contain"
          alt="Logo"
        /> */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-primary-color)]">
            سنڌي ٽائپنگ ٽيسٽ
          </h1>
          {/* <p className="text-sm sm:text-md md:text-lg">AMBILE پاران طاقتور</p> */}
        </div>
      </div>

      {/* Game Area & Settings */}
      <div className="max-w-5xl flex flex-col mx-auto text-white px-4">
        {result === null ? (
          <>
            <GameArea onFinish={handleFinish} />
            {/* <Result
            accuracy={100.00}
            wpm={ 200.00}
            
            onRestart={handleRestart}
          /> */}
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
        <div className="max-w-5xl mx-auto">
        </div>
    </ThemeProvider>
  );
};

export default IndexPage;
