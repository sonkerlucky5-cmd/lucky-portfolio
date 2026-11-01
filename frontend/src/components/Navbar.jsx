import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

const Navbar = ({ navItems, theme, onToggleTheme }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.toLowerCase()))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="topbar">
      <a href="#home" className="brand" onClick={closeMenu}>
        <img
          src="/logo.png"
          alt="Portfolio"
          className="brand-logo"
          decoding="async"
          width="36"
          height="36"
        />
        <span className="brand-text">
          <strong>Portfolio</strong>
        </span>
      </a>

      <nav className="nav-links" aria-label="Sections">
        {navItems.map((item) => {
          const target = item.toLowerCase();
          return (
            <a
              key={item}
              href={`#${target}`}
              className={activeSection === target ? "active" : undefined}
              aria-current={activeSection === target ? "true" : undefined}
            >
              {item}
            </a>
          );
        })}
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <a href="#contact" className="btn btn-small">
          Let&apos;s talk
        </a>

        <button
          type="button"
          className="nav-menu-btn"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <div className={`nav-mobile ${isMenuOpen ? "open" : ""}`}>
        <nav className="nav-mobile-links" aria-label="Mobile sections">
          {navItems.map((item) => {
            const target = item.toLowerCase();
            return (
              <a
                key={item}
                href={`#${target}`}
                className={activeSection === target ? "active" : undefined}
                aria-current={activeSection === target ? "true" : undefined}
                onClick={closeMenu}
              >
                {item}
              </a>
            );
          })}
        </nav>
        <div className="nav-mobile-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => {
              onToggleTheme?.();
              closeMenu();
            }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === "dark" ? "Switch to Light" : "Switch to Dark"}</span>
          </button>
          <a href="#contact" className="btn btn-primary" onClick={closeMenu}>
            Let&apos;s talk
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
