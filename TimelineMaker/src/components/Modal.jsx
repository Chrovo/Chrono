import { useState } from "react";
import { createTimeline } from "../utils/firestore";

const Modal = ({ userID, open, onClose }) => {
    const [name, setName] = useState("");
    const [coverImage, setCoverImage] = useState("");

    if(!open) {
        return null;
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTimeline(userID, name, coverImage);
            onClose();
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div
                className="backdrop-blur-xl bg-[#111827]/90 border border-white/10 rounded-2xl p-8 w-[420px] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-white font-bold text-2xl mb-6">New Timeline</h2>

                <form className="space-y-5" onSubmit={onSubmit}>
                    <div>
                        <label className="text-slate-400 text-sm font-medium mb-2 block">Timeline Name</label>
                        <input
                            type="text"
                            placeholder="Enter a name..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm font-medium mb-2 block">Cover Image</label>
                        <input
                            type="text"
                            placeholder="Image URL..."
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300"
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02]"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 backdrop-blur-xl bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/10"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal