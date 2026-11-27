import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { SHARED_CONTENT } from "../data/site.js";

// shell: nav + page + footer
export default function Layout() {
  const { pathname } = useLocation();
  // scroll to top on route chg
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">{SHARED_CONTENT.navigation.skipLink}</a>
      <Navbar />
      <main id="main">
        {/* page renders here */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
