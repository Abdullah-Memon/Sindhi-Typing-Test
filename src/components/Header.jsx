// Header.jsx
import ThemeToggler from "./ThemeToggler";
import Logo from "../assets/ambile-logo.png";
import Setting from "./Setting";

const Header = ({ onUpdateSettings }) => {
  return (
    <header className="w-full flex justify-between gap-4 items-center px-4 py-2 shadow-sm">
      <div className="max-w-6xl flex items-center justify-between w-full mx-auto">
      <div className="flex gap-4 items-center">
        <img src={Logo} alt="Typing Test" className="h-10" />
        <h1 className="text-2xl font-semibold text-[var(--text-primary-color)]">
          AMBILE
        </h1>
      </div>
      <div className="flex gap-4 items-center">
        <ThemeToggler />
        <Setting onUpdateSettings={onUpdateSettings} />
      </div>
      </div>
    </header>
  );
};

export default Header;
