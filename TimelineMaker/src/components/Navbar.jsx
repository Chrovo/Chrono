import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
        <p className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent text-xl font-bold tracking-tight">
          Chrono
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-slate-300 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;