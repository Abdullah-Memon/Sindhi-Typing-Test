import ThemeToggler from "./ThemeToggler";
import Logo from "../assets/ambile-logo.png"

// components/Header.jsx
const Header = () => {
    return (
      <header className="w-full flex justify-between gap-4 items-center px-4 py-2 shadow-sm">
        <div className="flex gap-4 items-center">
          <img src={Logo} alt="Typing Test" className="h-8" />
          <h1 className="text-xl font-semibold text-[var(--text-primary-color)]">AMBILE</h1>
        </div>
        <ThemeToggler />
      </header>
    );
  };
  
  
  export default Header;
  