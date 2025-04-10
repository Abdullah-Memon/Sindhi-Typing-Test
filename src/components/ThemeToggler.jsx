import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

const ThemeToggler = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    // <div className="p-4 bg-[var(--background-color)] text-[var(--text-color)] transition-all duration-300">

    //   <button
    //     onClick={toggleTheme}
    //     className="p-2 border rounded-lg bg-[var(--primary-color)] text-white hover:scale-105 transition-transform">
    //     {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    //   </button>
    // </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input className="sr-only peer" type="checkbox" onClick={toggleTheme} title={theme} />
        <div className="w-14 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 peer-checked:from-yellow-300  peer-checked:to-orange-400  transition-all duration-500 after:content-['🌙'] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:flex after:items-center after:justify-center after:transition-all after:duration-500 peer-checked:after:translate-x-6 peer-checked:after:content-['☀️'] after:shadow-md after:text-md"></div>
        {/* <span class="ml-3 text-sm font-medium text-gray-900">
          {theme === "light" ? "Night" : "Light"}
        </span> */}
      </label>
  );
};

export default ThemeToggler;
