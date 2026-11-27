import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV, SCHOOL, SHARED_CONTENT } from "../data/site.js";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Navbar() {
  const { logo, mainLabel, menuLabel } = SHARED_CONTENT.navigation;
  // mobile menu open?
  const [open, setOpen] = useState(false);
  // which dropdown is open
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    // click outside closes menu
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setMenu(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setMenu(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="navbar" ref={ref}>
      <div className="nav-top">
        {/* logo + name */}
        <Link to="/" className="brand">
          <span className="brand-logo" aria-hidden={logo.src && logo.alt ? undefined : true}>
            {logo.src ? <img src={logo.src} alt={logo.alt} /> : logo.label}
          </span>
          <span className="brand-name">{SCHOOL}</span>
        </Link>
        {/* lang + menu btn */}
        <div className="nav-actions">
          <LanguageToggle />
          <button className="nav-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
            {menuLabel}
          </button>
        </div>
      </div>
      <nav aria-label={mainLabel}>
        {/* main links */}
        <ul id="site-nav" className={`nav-links${open ? " open" : ""}`}>
          {NAV.map((item) =>
            item.children ? (
              <li key={item.id}>
                <button
                  className={item.children.some((c) => c.to === pathname) ? "active" : ""}
                  aria-haspopup="true"
                  aria-expanded={menu === item.id}
                  onClick={() => setMenu(menu === item.id ? null : item.id)}
                >
                  {item.label} &#9662;
                </button>
                {menu === item.id && (
                  <ul className="dropdown">
                    {item.children.map((c) => (
                      <li key={c.id}>
                        <NavLink to={c.to}>{c.label}</NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.id}>
                <NavLink to={item.to} end={item.to === "/"}>{item.label}</NavLink>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}
