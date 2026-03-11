import React from 'react'
import { useState } from "react"

const EventModal = ({ isOpen, onClose, onSave, eventType, x, y, defaultValues }) => {
    const [text, setText] = useState(defaultValues?.text || "");
    const [date, setDate] = useState(defaultValues?.date || "");

    const handleSubmit = () => {
        onSave({ type: eventType, text, date, x, y});
        onClose();
    }

    if(!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="backdrop-blur-xl bg-[#111827]/90 border border-white/10 rounded-2xl p-8 w-[420px] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-white font-bold text-2xl mb-6">{eventType}</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-slate-400 text-sm font-medium mb-2 block">Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300 [color-scheme:dark]"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm font-medium mb-2 block">Description</label>
                        <textarea 
                            placeholder="Describe this event..." 
                            value={text} 
                            onChange={(e) => setText(e.target.value)} 
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300 resize-none overflow-hidden"
                            rows="3"
                            style={{
                                minHeight: '80px',
                                maxHeight: '200px'
                            }}
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]"
                    >
                        Save
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/10"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EventModal