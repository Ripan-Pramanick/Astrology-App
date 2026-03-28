export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#ff9933] text-white px-4 py-2 rounded"
    >
      {children}
    </button>
  );
}