import { db } from "../firebase/firebase"
import { collection, query, where, getDocs } from "firebase/firestore"
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "../firebase/auth";
import { plus } from "../assets"

import Box from '../components/Box';
import Modal from '../components/Modal';
import { history } from '../assets'

const Timelines = () => {
  const [IsOpen, setIsOpen] = useState(false);
  const [timelines, setTimelines] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch(err) {
      console.error("Error logging out: " + err);
    }
  };

  useEffect(() => {
    if(!currentUser) {
      return;
    }

    const getUserTimelines = async () => {
      if(!currentUser) {
        return;
      }
      const q = query(collection(db, "timelines"), where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      const timelines = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTimelines(timelines);
    };

    getUserTimelines();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 px-8 py-6 flex justify-between items-center">
        <p className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent text-xl font-bold">
          Chrono
        </p>
        <button
          onClick={logout}
          disabled={IsOpen}
          className="text-slate-400 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-10">
            Your <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">Timelines</span>
          </h1>

          <button
            disabled={IsOpen}
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 backdrop-blur-xl bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] mb-10"
          >
            <span className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-xs font-bold transition-transform duration-300 group-hover:rotate-90">+</span>
            New Timeline
          </button>

          <div className="flex flex-wrap gap-6">
            {timelines.map((timeline) => (
              <Box 
                key={timeline.id} 
                coverImage={timeline.coverImage || history} 
                timelineName={timeline.name}
                lastEdited={timeline.createdAt?.toDate().toDateString()} 
                onClick={() => navigate(`/timeline/${timeline.id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {currentUser && (<Modal userID={currentUser.uid} open={IsOpen} onClose={() => setIsOpen(false)} />)}
    </div>
  )
}

export default Timelines