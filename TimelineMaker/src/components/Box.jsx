import React from 'react'

const Box = ({ coverImage, timelineName, lastEdited, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 w-[280px] rounded-2xl overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden h-[180px]">
        <img
          src={coverImage}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-transparent to-transparent" />
      </div>
      <div className="p-4">
        <p className="text-white font-semibold text-lg truncate">{timelineName}</p>
        <p className="text-slate-500 text-sm mt-1">{lastEdited}</p>
      </div>
    </div>
  )
}

export default Box