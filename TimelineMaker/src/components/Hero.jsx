import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center text-center px-6">
      {/* Background gradient orbs */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[0px] right-[10%] w-[300px] h-[300px] bg-gradient-to-br from-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-6xl md:text-8xl font-extrabold leading-tight tracking-tight">
          <span className="text-white">An easy </span>
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">
            Timeline
          </span>
          <span className="text-white"> Maker.</span>
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-slate-400 font-light">
          History, visualized.
        </p>
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-8 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="backdrop-blur-xl bg-white/5 border border-white/10 text-slate-200 hover:text-white px-8 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/10 hover:scale-105"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;