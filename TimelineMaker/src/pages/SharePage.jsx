import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore'
import EventDetailPopup from '../components/EventDetailPopup';

const SharePage = () => {
  const { shareString } = useParams();
  const [droppedItems, setDroppedItems] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [timelineName, setTimelineName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [connections] = useState([]);

  const eventTypes = [
    { name: "Event", color: "rgb(59, 130, 246)" },
    { name: "War", color: "rgb(168, 85, 247)" },
    { name: "Election", color: "rgb(244, 63, 94)" },
    { name: "Movement", color: "rgb(234, 179, 8)" },
    { name: "Discovery", color: "rgb(20, 184, 166)" },
    { name: "Assassination", color: "rgb(239, 68, 68)" },
  ];

  useEffect(() => {
    const loadSharedTimeline = async () => {
      const q = query(collection(db, "timelines"), where("shareString", "==", shareString));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const timelineDoc = snapshot.docs[0];
      const data = timelineDoc.data();
      setTimelineName(data.name || 'Untitled Timeline');

      const eventsSnapshot = await getDocs(collection(db, "timelines", timelineDoc.id, "events"));
      const items = eventsSnapshot.docs.map(d => ({ ...d.data(), id: d.id }));
      items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(a.date) - new Date(b.date);
      });
      setDroppedItems(items);
      setLoading(false);
    };

    loadSharedTimeline();
  }, [shareString]);

  const getEventColor = (typeName) => {
    const found = eventTypes.find(t => t.name === typeName);
    return found ? found.color : "rgb(100,116,139)";
  };

  const getConnectionPoint = (eventId, side) => {
    const element = document.getElementById(`event-${eventId}-${side}`);
    if (!element) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    const container = document.getElementById('timeline-container').getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2 - container.left,
      y: rect.top + rect.height / 2 - container.top
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0f1e]">
        <div className="text-center">
          <p className="text-slate-400 text-lg">Timeline not found</p>
          <p className="text-slate-600 text-sm mt-2">This link may be invalid or expired</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1e]">
      {/* Top bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <p className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent text-xl font-bold">
          Chrono
        </p>
        <span className="text-slate-600 text-xs font-medium uppercase tracking-wider">View Only</span>
      </div>

      {/* Canvas */}
      <div 
        id="timeline-container"
        className="flex-1 p-8 relative overflow-auto"
      >
        <h2 className="text-white text-2xl font-bold mb-6">{timelineName}</h2>
        
        {/* SVG for connection lines */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections.map((conn, idx) => {
            const from = getConnectionPoint(conn.from.eventId, conn.from.side);
            const to = getConnectionPoint(conn.to.eventId, conn.to.side);
            const midX = (from.x + to.x) / 2;
            
            return (
              <path
                key={idx}
                d={`M ${from.x} ${from.y} Q ${midX} ${from.y}, ${midX} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`}
                stroke="#334155"
                strokeWidth="2"
                fill="none"
              />
            );
          })}
        </svg>
        
        <div className="mt-4 relative" style={{ zIndex: 2 }}>
          <div className="flex space-x-5 pb-4" style={{ minWidth: 'max-content' }}>
            {droppedItems.map((item, i) => (
              <div 
                key={i} 
                className="w-52 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 flex-shrink-0 relative select-none cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setSelectedEvent(item)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getEventColor(item.type), boxShadow: `0 0 8px ${getEventColor(item.type)}40` }} />
                  <p className="text-white font-semibold text-sm">{item.type}</p>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                <p className="text-slate-500 text-xs mt-3 font-medium">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <EventDetailPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}

export default SharePage
