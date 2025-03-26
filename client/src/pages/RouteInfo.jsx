import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteMap from './RouteMap';

const RouteInfo = () => {
  const [start, setStart] = useState({ latitude: 40.633106, longitude: -8.658746 });
  const [end, setEnd] = useState({ latitude: 40.627, longitude: -8.645 });
  const [route, setRoute] = useState(null);
  const [dragPosition, setDragPosition] = useState(120);
  const dragRef = useRef(null);

  const username = localStorage.getItem('username') || 'User';
  const maxDrag = window.innerHeight * 0.55;

  const handleDragStart = (e) => {
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = y;
  };

  const handleDragMove = (e) => {
    if (dragRef.current !== null) {
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      const delta = y - dragRef.current;
      setDragPosition(prev => Math.max(100, Math.min(maxDrag, prev - delta)));
      dragRef.current = y;
    }
  };

  const handleDragEnd = () => {
    dragRef.current = null;
    setDragPosition((prev) => (prev > maxDrag / 2 ? maxDrag : 120));
  };

  return (
    <div className="relative h-screen w-screen">
      <RouteMap start={start} end={end} route={route} setRoute={setRoute} />

      {/* Hello Username */}
      <div className="absolute top-4 left-4 z-10 bg-base-100 text-base-content shadow-md px-4 py-2 rounded-full text-sm font-medium">
        Hello, {username}
      </div>

      {/* Expandable Drawer */}
      <div
        className="absolute left-0 w-full bg-base-100 text-base-content rounded-t-2xl shadow-lg z-10"
        style={{
          bottom: 0,
          height: `${dragPosition}px`,
          transition: dragRef.current ? 'none' : 'height 0.3s ease-in-out',
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div className="w-12 h-1.5 bg-gray-400 rounded-full mx-auto mt-2 mb-3"></div>

        <div className="overflow-y-auto h-full px-4 pb-4">
          {route ? (
            <div className="space-y-3">
              <div className="text-sm">
                <p><strong>Distance:</strong> {route.total_distance_km.toFixed(2)} km</p>
                <p><strong>Estimated Time:</strong> {route.estimated_time_min.toFixed(1)} min</p>
              </div>
              <hr className="border-gray-300" />
              <div>
                <strong>Instructions:</strong>
                <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
                  {route.route_path.map((step, index) => (
                    <li key={index}>{step.instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500 pt-4">Loading route...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;
