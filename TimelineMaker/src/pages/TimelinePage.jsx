import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'
import { signOut } from "../firebase/auth";
import { useAuth } from "../contexts/AuthContext";
import EventModal from "../components/EventModal"
import EventDetailPopup from "../components/EventDetailPopup"

const TimelinePage = () => {
  const navigate = useNavigate();
  const { timelineId } = useParams();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [droppedItems, setDroppedItems] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [connections, setConnections] = useState([]);
  const [draggingFrom, setDraggingFrom] = useState(null);
  const [draggingBoxId, setDraggingBoxId] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isViewOnly, setIsViewOnly] = useState(true);
  const [timelineShareString, setTimelineShareString] = useState('');
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [draggedCardIndex, setDraggedCardIndex] = useState(null);
  const eventTypes = [
    { name: "Event", color: "rgb(59, 130, 246)", bgClass: "bg-blue-500" },
    { name: "War", color: "rgb(168, 85, 247)", bgClass: "bg-purple-500" },
    { name: "Election", color: "rgb(244, 63, 94)", bgClass: "bg-rose-500" },
    { name: "Movement", color: "rgb(234, 179, 8)", bgClass: "bg-yellow-500" },
    { name: "Discovery", color: "rgb(20, 184, 166)", bgClass: "bg-teal-500" },
    { name: "Assassination", color: "rgb(239, 68, 68)", bgClass: "bg-red-500" },
  ];

  const createDragImage = (eventType) => (e) => {
    e.dataTransfer.setData("text/plain", eventType.name);
    
    const dragImage = document.createElement('div');
    dragImage.style.width = '25px';
    dragImage.style.height = '25px';
    dragImage.style.backgroundColor = eventType.color;
    dragImage.style.borderRadius = '50%';
    dragImage.style.opacity = '1';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 8, 8);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  useEffect(() => {
    const loadTimeline = async () => {
      const timelineDoc = await getDoc(doc(db, "timelines", timelineId));
      if (timelineDoc.exists()) {
        const data = timelineDoc.data();
        setTimelineShareString(data.shareString || '');
        setIsViewOnly(!currentUser || currentUser.uid !== data.userId);
      }
      setLoadingAccess(false);

      const q = await getDocs(collection(db, "timelines", timelineId, "events"));
      const items = q.docs.map(d => ({ ...d.data(), id: d.id }));
      items.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return new Date(a.date) - new Date(b.date);
      });
      setDroppedItems(items);
    };
    loadTimeline();
  }, [timelineId, currentUser]);

  const logout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch(err) {
      console.error("Error logging out: " + err);
    }
  };

  const handleDrop = (e) => {
    if(isViewOnly) {
      return;
    }
    e.preventDefault();
    const eventType = e.dataTransfer.getData("text/plain");
    setSelectedType(eventType);
    setIsOpen(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addEvent = async (data) => {
    const eventData = {
      ...data,
      type: selectedType,
      order: droppedItems.length, // Put at the end
    };

    if (eventData.x === undefined) delete eventData.x;
    if (eventData.y === undefined) delete eventData.y;

    const docRef = collection(db, "timelines", timelineId, "events");
    const docSnap = await addDoc(docRef, eventData);

    const newItem = { ...eventData, id: docSnap.id };

    const sortedItems = [...droppedItems, newItem].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(a.date) - new Date(b.date);
    });

    setDroppedItems(sortedItems);
    setIsOpen(false);
  };

  const shareTimeline = async () => {
    const viewOnlyUrl = `${window.location.origin}/share/${timelineShareString}`;
    await navigator.clipboard.writeText(viewOnlyUrl);
    alert("View-only link copied to clipboard!");
  }

  const handleBoxMouseDown = (index) => {
    setDraggingBoxId(index);
  }

  const handleBoxMouseMove = (e) => {
    if (draggingBoxId === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const updatedItems = [...droppedItems];
    updatedItems[draggingBoxId] = { ...updatedItems[draggingBoxId], x, y };
    setDroppedItems(updatedItems);
  }

  const handleBoxMouseUp = () => {
    setDraggingBoxId(null);
  }

  const handleCardDragStart = (e, index) => {
    if (isViewOnly) return;
    setDraggedCardIndex(index);
    // Needed for Firefox
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCardDragOver = (e, index) => {
    if (isViewOnly) return;
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCardDrop = async (e, targetIndex) => {
    if (isViewOnly || draggedCardIndex === null || draggedCardIndex === targetIndex) return;
    e.preventDefault();
    e.stopPropagation(); // Stop the container drop handler from firing

    const newItems = [...droppedItems];
    const itemToMove = newItems.splice(draggedCardIndex, 1)[0];
    newItems.splice(targetIndex, 0, itemToMove);

    // Reassign order sequential to match array index
    const updatedItems = newItems.map((item, idx) => ({ ...item, order: idx }));
    setDroppedItems(updatedItems);
    setDraggedCardIndex(null);

    // Save ALL new orders to firestore
    try {
      const promises = updatedItems.map(item => {
        const itemRef = doc(db, "timelines", timelineId, "events", item.id);
        return updateDoc(itemRef, { order: item.order });
      });
      await Promise.all(promises);
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const isEndpointConnected = (eventId, side) => {
    return connections.some(conn => 
      (conn.from.eventId === eventId && conn.from.side === side) || 
      (conn.to.eventId === eventId && conn.to.side === side)
    );
  }

  const removeEndpointConnection = (eventId, side) => {
    setConnections(connections.filter(conn => 
      !((conn.from.eventId === eventId && conn.from.side === side) || 
      (conn.to.eventId === eventId && conn.to.side === side))
    ));
  }

  const handleConnectionStart = (eventId, side) => {
    if(isEndpointConnected(eventId, side)) {
      removeEndpointConnection(eventId, side);
    }
    setDraggingFrom({ eventId, side });
  };

  const handleConnectionEnd = (eventId, side) => {
    if (!isEndpointConnected(eventId, side) && draggingFrom && draggingFrom.eventId !== eventId) {
      const newConnection = {
        from: draggingFrom,
        to: { eventId, side }
      };
      setConnections([...connections, newConnection]);
    }
    setDraggingFrom(null);
  };

  const handleMouseMove = (e) => {
    if (draggingFrom) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
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

  const getEventColor = (typeName) => {
    const found = eventTypes.find(t => t.name === typeName);
    return found ? found.color : "rgb(100,116,139)";
  };

  if (loadingAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0f1e]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">Loading timeline...</p>
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
        {!isViewOnly && (
          <div className="flex gap-3">
            <button
              onClick={shareTimeline}
              className="backdrop-blur-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/10"
            >
              Share
            </button>
            <button
              onClick={logout}
              className="text-slate-400 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isViewOnly && (
          <div className="w-[240px] border-r border-white/10 p-5 flex-shrink-0">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-5">Event Types</p>
            <div className="space-y-2">
              {eventTypes.map((eventType) => (
                <div
                  key={eventType.name}
                  draggable
                  onDragStart={createDragImage(eventType)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-grab transition-all duration-300 hover:bg-white/5 active:cursor-grabbing"
                >
                  <div className={`w-3 h-3 ${eventType.bgClass} rounded-full shadow-lg`} style={{ boxShadow: `0 0 8px ${eventType.color}40` }} />
                  <span className="text-slate-300 text-sm font-medium">{eventType.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Canvas */}
        <div 
          id="timeline-container"
          onDrop={handleDrop}
          onDragOver={handleDragOver} 
          onMouseMove={handleMouseMove}
          onMouseUp={() => setDraggingFrom(null)}
          className="flex-1 p-8 relative overflow-auto"
        >
          {!isViewOnly && droppedItems.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-600 text-lg">Drag event types from the sidebar to get started</p>
            </div>
          )}
          
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
            
            {draggingFrom && (
              <path
                d={`M ${getConnectionPoint(draggingFrom.eventId, draggingFrom.side).x} ${getConnectionPoint(draggingFrom.eventId, draggingFrom.side).y} Q ${(getConnectionPoint(draggingFrom.eventId, draggingFrom.side).x + mousePos.x) / 2} ${getConnectionPoint(draggingFrom.eventId, draggingFrom.side).y}, ${(getConnectionPoint(draggingFrom.eventId, draggingFrom.side).x + mousePos.x) / 2} ${(getConnectionPoint(draggingFrom.eventId, draggingFrom.side).y + mousePos.y) / 2} T ${mousePos.x} ${mousePos.y}`}
                stroke="#475569"
                strokeWidth="2"
                fill="none"
              />
            )}
          </svg>
          
          <div className="mt-4 relative" style={{ zIndex: 2 }}>
            <div className="flex space-x-5 pb-4" style={{ minWidth: 'max-content' }}>
              {droppedItems.map((item, i) => (
                <div 
                  key={item.id || i}
                  draggable={!isViewOnly}
                  onDragStart={(e) => handleCardDragStart(e, i)}
                  onDragOver={(e) => handleCardDragOver(e, i)}
                  onDrop={(e) => handleCardDrop(e, i)}
                  className="w-52 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 flex-shrink-0 relative select-none transition-all duration-300 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                  onClick={() => setSelectedEvent(item)}
                  onMouseDown={(e) => handleBoxMouseDown(i)}
                  onMouseMove={handleBoxMouseMove}
                  onMouseUp={handleBoxMouseUp}
                >
                  {/* Left connection point */}
                  <div
                    id={`event-${i}-left`}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-slate-500 rounded-full cursor-pointer hover:scale-150 hover:bg-cyan-400 transition-all duration-200 z-10"
                    onMouseDown={() => handleConnectionStart(i, 'left')}
                    onMouseUp={() => handleConnectionEnd(i, 'left')}
                  />
                  
                  {/* Right connection point */}
                  <div
                    id={`event-${i}-right`}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-slate-500 rounded-full cursor-pointer hover:scale-150 hover:bg-cyan-400 transition-all duration-200 z-10"
                    onMouseDown={() => handleConnectionStart(i, 'right')}
                    onMouseUp={() => handleConnectionEnd(i, 'right')}
                  />

                  {/* Color indicator */}
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
      </div>
      {isOpen && !isViewOnly && <EventModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSave={addEvent} eventType={selectedType} />} 
      <EventDetailPopup event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}

export default TimelinePage