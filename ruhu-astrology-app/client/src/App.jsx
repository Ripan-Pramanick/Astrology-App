import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import KundliForm from "./pages/KundliForm";
import KundliResult from "./pages/KundliResult";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kundli" element={<KundliForm />} />
        <Route path="/kundli-result" element={<KundliResult />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}