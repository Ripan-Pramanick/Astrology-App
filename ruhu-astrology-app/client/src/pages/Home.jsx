import Navbar from "../components/common/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="text-center p-10">
        <h1 className="text-4xl font-serif">
          Astrology Powered by AI
        </h1>
      </div>
    </div>
  );
}