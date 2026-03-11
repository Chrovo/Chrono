import React from "react"

const Card = React.forwardRef(({ text, bullet1, bullet2, bullet3, color }, ref) => {
  const bullets = [bullet1, bullet2, bullet3];

  return (
    <div
      ref={ref}
      className="group backdrop-blur-xl bg-white/5 border border-white/10 w-[320px] rounded-2xl p-8 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
    >
      <p className={`${color} text-3xl font-bold mb-8`}>{text}</p>
      <div className="space-y-5">
        {bullets.map((bullet, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M3 6.5L5.5 9L9 3" stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-slate-300 text-base leading-relaxed">{bullet}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default Card;