import React from 'react';

const EventDetailPopup = ({ event, onClose }) => {
    if (!event) return null;

    const eventTypes = [
        { name: "Event", color: "rgb(59, 130, 246)" },
        { name: "War", color: "rgb(168, 85, 247)" },
        { name: "Election", color: "rgb(244, 63, 94)" },
        { name: "Movement", color: "rgb(234, 179, 8)" },
        { name: "Discovery", color: "rgb(20, 184, 166)" },
        { name: "Assassination", color: "rgb(239, 68, 68)" },
    ];

    const getEventColor = (typeName) => {
        const found = eventTypes.find(t => t.name === typeName);
        return found ? found.color : "rgb(100,116,139)";
    };

    const color = getEventColor(event.type);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="backdrop-blur-xl bg-[#111827]/90 border border-white/10 rounded-2xl p-8 w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header elements: type, indicator dot, and date */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}80` }} 
                        />
                        <h2 className="text-white font-bold text-2xl tracking-wide">{event.type}</h2>
                    </div>
                    <div className="text-cyan-400 font-medium text-lg tracking-wider">
                        {event.date}
                    </div>
                </div>

                <div className="overflow-y-auto pr-2 custom-scrollbar">
                    {/* Short text */}
                    <p className="text-white text-xl font-medium leading-relaxed mb-6">
                        {event.text}
                    </p>

                    {/* Long Description (if it exists) */}
                    {event.description && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-2">
                            <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-3">Event Details</h3>
                            <p className="text-slate-300 text-base leading-loose whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer button */}
                <div className="mt-8 pt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 backdrop-blur-xl bg-white/5 border border-white/10 text-slate-300 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 hover:text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPopup;
