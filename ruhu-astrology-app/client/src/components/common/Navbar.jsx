import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-serif text-xl">ASTRO-VEDIC</h1>

      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/kundli">Kundli</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}