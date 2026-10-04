import { Moon, Sparkles, Sun } from "lucide-react";

const Navbar = ({ navItems, theme, onToggleTheme }) => {
  return (
    <header className="topbar">
      <a href="#home" className="brand">
        <Sparkles size={18} />
        <span>PORTFOLIO</span>
      </a>

      <nav className="nav-links">
        {navItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </nav>

      <div className="nav-actions">
        <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle Theme">
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <a href="#contact" className="btn btn-small">
          Hire Me
        </a>
      </div>
    </header>
  );
};

export default Navbar;
