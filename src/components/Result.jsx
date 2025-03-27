import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Result = ({ accuracy, wpm, wpmData, onRestart }) => {
  const [prevWpmData, setPrevWpmData] = useState([]);

  // Load previous data only once on mount
  useEffect(() => {
    const storedData = localStorage.getItem("prevWpmData");
    if (storedData) {
      setPrevWpmData(JSON.parse(storedData));
    }
  }, []);

  // Update localStorage with current data for next session.
  useEffect(() => {
    localStorage.setItem("prevWpmData", JSON.stringify(wpmData));
  }, [wpmData]);

  // Prepare combined data so that each object has time, current wpm, and previous wpm
  const chartData = wpmData.map((d, i) => ({
    time: d.time, // X-axis: time in seconds
    wpm: d.wpm,   // current result
    prevWpm: prevWpmData && prevWpmData[i] ? prevWpmData[i].wpm : null,
  }));

  // Calculate max and min WPM across both data sets for Y-axis domain
  const allWpmValues = chartData.flatMap(d => [d.wpm, d.prevWpm].filter(val => val !== null));
  const maxWpm = Math.max(...allWpmValues, wpm) + 3;
  const minWpm = Math.min(...allWpmValues, wpm);

  // Generate X-axis ticks at 5-second intervals
  const maxTime = chartData.length > 0 ? Math.max(...chartData.map((d) => d.time)) : 0;
  const ticks = [];
  for (let t = 0; t <= maxTime; t += 5) {
    ticks.push(t);
  }

  return (
    <div className="mt-8 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto text-center flex flex-col items-center h-full px-4">
      <h2 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary-color)] mb-4">Result</h2>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 w-full justify-center mb-4">
        <p className="text-xl sm:text-2xl text-[var(--text-color)]">
          Accuracy: <span className="text-[var(--text-primary-color)]">{accuracy}%</span>
        </p>
        <p className="text-xl sm:text-2xl text-[var(--text-color)]">
          WPM: <span className="text-[var(--text-primary-color)]">{wpm}</span>
        </p>
      </div>

      {/* Responsive Chart Container */}
      <div className="w-full" style={{ height: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <XAxis dataKey="time" tick={{ fill: "#666" }} ticks={ticks} />
            <YAxis domain={[minWpm, maxWpm]} tick={{ fill: "#666" }} />
            <Tooltip contentStyle={{ backgroundColor: "#f6f6f6", borderRadius: 4 }} />

            {/* Previous result line (gray) in the back */}
            <Area
              type="monotone"
              dataKey="prevWpm"
              stroke="gray"
              strokeWidth={3}
              fill="rgba(255,255,255,0)"
              animationDuration={1500}
              dot={false}
            />

            {/* New result line */}
            <Area
              type="monotone"
              dataKey="wpm"
              stroke="#132a68"
              strokeWidth={3}
              fill="rgba(255,255,255,0)"
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 px-6 py-3 bg-[var(--primary-color)] hover:bg-blue-700 text-white rounded-full transition cursor-pointer text-base sm:text-lg"
      >
        Try Again
      </button>
    </div>
  );
};

export default Result;
