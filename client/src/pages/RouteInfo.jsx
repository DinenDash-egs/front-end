import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RouteMap from './RouteMap';

const RouteInfo = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
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

  useEffect(() => {
    let intervalId;

    const getCoordinatesFromAddress = async (address) => {
      const apiKey = "AIzaSyAQIhVhAaeTSYU3C294HRbbvPJT-9c_nIE";
      let formattedAddress;

      if (typeof address === "string") {
        formattedAddress = address;
      } else if (address && typeof address === "object") {
        const { street, city, country } = address;
        formattedAddress = `${street || ''}, ${city || ''}, ${country || ''}`;
      } else {
        throw new Error("Invalid address format");
      }

      const encodedAddress = encodeURIComponent(formattedAddress.trim());

      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`);
      const data = await res.json();

      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return { latitude: location.lat, longitude: location.lng };
      } else {
        console.error("Geocoding API response:", data);
        throw new Error("Failed to geocode address");
      }
    };

    const fetchLocations = async () => {
      try {
        const username = localStorage.getItem("username");

        const [deliveryRes, locationRes] = await Promise.all([
          fetch(`http://localhost:5007/v1/user/active/${username}`),
          fetch(`http://localhost:5007/v1/location`)
        ]);

        if (!deliveryRes.ok || !locationRes.ok) throw new Error("API call failed");

        const delivery = await deliveryRes.json();
        const location = await locationRes.json();

        console.log("Active Delivery:", delivery);
        console.log("Courier Location:", location);

        const destination = await getCoordinatesFromAddress(delivery.address);
        setStart(location);
        setEnd(destination);
      } catch (error) {
        console.error("Error fetching start/end locations: ", error);
      }
    };

    fetchLocations();
    intervalId = setInterval(fetchLocations, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {start && end && (
        <RouteMap start={start} end={end} route={route} setRoute={setRoute} />
      )}

      <div className="absolute top-4 left-4 z-10 bg-base-100 text-base-content shadow-md px-4 py-2 rounded-full text-sm font-medium">
        Hello, {username}
      </div>

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
