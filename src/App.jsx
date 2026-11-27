import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Directors from "./pages/Directors.jsx";
import NewToOrchestra from "./pages/NewToOrchestra.jsx";
import GettingInstrument from "./pages/GettingInstrument.jsx";
import ReturningMembers from "./pages/ReturningMembers.jsx";
import Uil from "./pages/Uil.jsx";
import Handbook from "./pages/Handbook.jsx";

// all routes live here
export default function App() {
  // pages sit inside the layout
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="directors" element={<Directors />} />
        <Route path="new-to-orchestra" element={<NewToOrchestra />} />
        <Route path="getting-an-instrument" element={<GettingInstrument />} />
        <Route path="returning-members" element={<ReturningMembers />} />
        <Route path="uil" element={<Uil />} />
        <Route path="handbook" element={<Handbook />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
