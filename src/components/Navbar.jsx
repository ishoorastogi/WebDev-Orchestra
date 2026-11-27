"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SCHOOL } from "../data/site.js";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Navbar({ items = NAV, school = SCHOOL }) {
  // mobile menu open?
  const [open, setOpen] = useState(false);
  // which dropdown is open
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const pathname = usePathname();

  const closeNav = () => { setOpen(false); setMenu(null); };

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
        <Link href="/" className="brand" onClick={closeNav}>
          <span className="brand-logo" aria-hidden="true">LOGO</span>
          <span className="brand-name">{school}</span>
        </Link>
        {/* lang + menu btn */}
        <div className="nav-actions">
          <LanguageToggle />
          <button className="nav-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
            Menu
          </button>
        </div>
      </div>
      <nav aria-label="Main">
        {/* main links */}
        <ul id="site-nav" className={`nav-links${open ? " open" : ""}`}>
          {items.map((item) =>
            item.children ? (
              <li key={item.label}>
                <button
                  className={item.children.some((c) => c.to === pathname) ? "active" : ""}
                  aria-haspopup="true"
                  aria-expanded={menu === item.label}
                  onClick={() => setMenu(menu === item.label ? null : item.label)}
                >
                  {item.label} &#9662;
                </button>
                {menu === item.label && (
                  <ul className="dropdown">
                    {item.children.map((c) => (
                      <li key={c.to}>
                      <Link className={pathname === c.to ? "active" : ""} href={c.to} onClick={closeNav}>{c.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={item.to}>
              <Link className={pathname === item.to ? "active" : ""} href={item.to} onClick={closeNav}>{item.label}</Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
}
