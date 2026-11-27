import { useLanguage } from "../i18n/LanguageProvider.jsx";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

// shell: nav + page + footer
export default function Layout() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  // scroll to top on route chg
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">{t("Skip to content")}</a>
      <Navbar />
      <main id="main">
        {/* page renders here */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
