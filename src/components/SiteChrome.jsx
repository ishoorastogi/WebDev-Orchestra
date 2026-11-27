"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function SiteChrome({ children, nav, school, footer }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  return <>
    {!isAdmin && <><a className="skip-link" href="#main">Skip to content</a><Navbar items={nav} school={school} /></>}
    <main id="main">{children}</main>
    {!isAdmin && <Footer content={footer} />}
  </>;
}
