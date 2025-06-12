import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteMap from './RouteMap';
import NavigationIcon from '@mui/icons-material/Navigation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonPinIcon from '@mui/icons-material/PersonPin';

const RouteInfo = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState(null);
  const [dragPosition, setDragPosition] = useState(120);
  const dragRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    const apiKey = "AIzaSyDDsjx2dcP0Tol0IHli51DTeq36CnFQupc";
    const username = localStorage.getItem("username");

    const getCoordinatesFromAddress = async (address) => {
      const encoded = encodeURIComponent(address);
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${apiKey}`);
      const data = await res.json();
      if (data.status === "OK") {
        return {
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng
        };
      }
      throw new Error("Geocoding failed");
    };

    const fetchData = async () => {
      try {
        const deliveryRes = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/user/active/${username}`);
        if (deliveryRes.status === 204) {
          navigate('/order-delivered');
          return;
        }

        const delivery = await deliveryRes.json();
        if (delivery.status === 'delivered') {
          navigate('/order-delivered');
          return;
        }

        const locationRes = await fetch(`${import.meta.env.VITE_TRACKING_API}/v1/location`);
        if (!locationRes.ok) throw new Error("Location fetch failed");
        const location = await locationRes.json();

        const destination = await getCoordinatesFromAddress(delivery.address);
        setStart(location);
        setEnd(destination);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="relative h-screen w-screen">
      {start && end && (
        <RouteMap start={start} end={end} route={route} setRoute={setRoute} setStart={setStart} />
      )}
      
      {/* User Badge */}
      <div className="absolute top-4 left-4 z-10 bg-white shadow-lg px-4 py-2.5 rounded-2xl flex items-center gap-2">
        <PersonPinIcon className="w-5 h-5 text-orange-500" />
        <span className="text-sm font-medium text-gray-700">Hello, {username}</span>
      </div>

      {/* Draggable Route Info Panel */}
      <div
        className="absolute left-0 w-full bg-white rounded-t-3xl shadow-2xl z-10"
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
        {/* Drag Handle */}
        <div className="w-16 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-4 cursor-grab active:cursor-grabbing"></div>
        
        {/* Content */}
        <div className="overflow-y-auto h-full px-6 pb-6">
          {route ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-xl">
                  <LocalShippingIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Delivery Route</h3>
                  <p className="text-sm text-gray-500">Your order is on the way</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-orange-600 mb-1">
                    <NavigationIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Distance</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{route.total_distance_km.toFixed(2)} km</p>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <AccessTimeIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">ETA</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">{route.estimated_time_min.toFixed(0)} min</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <DirectionsIcon className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Route Instructions</h4>
                </div>
                <ol className="space-y-3">
                  {route.route_path.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 pt-1">{step.instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full pb-20">
              <div className="animate-pulse mb-4">
                <LocalShippingIcon className="w-16 h-16 text-orange-300" />
              </div>
              <p className="text-gray-500 font-medium">Loading route information...</p>
              <p className="text-sm text-gray-400 mt-1">Please wait while we track your delivery</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteInfo;