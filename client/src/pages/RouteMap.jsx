import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScriptNext, Polyline, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const RouteMap = ({ start, end, route, setRoute, setStart }) => {
  const mapRef = useRef(null);
  const [routePath, setRoutePath] = useState([]);
  const [courierPos, setCourierPos] = useState(start);
  const [icon, setIcon] = useState(null);
  const hasZoomed = useRef(false);

  const apiKey = "AIzaSyAQIhVhAaeTSYU3C294HRbbvPJT-9c_nIE";

  const snapToRoads = async (path) => {
    const pathString = path.map(coord => `${coord.lat},${coord.lng}`).join('|');
    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${pathString}&interpolate=true&key=${apiKey}`
      );
      const data = await response.json();
      return data.snappedPoints?.map(point => ({
        lat: point.location.latitude,
        lng: point.location.longitude,
      })) || [];
    } catch (error) {
      console.error("Snap to roads error:", error);
      return path;
    }
  };

  useEffect(() => {
    const fetchRoute = async () => {
      const response = await fetch(
        `http://localhost:8000/v1/route?start_lat=${start.latitude}&start_lon=${start.longitude}&goal_lat=${end.latitude}&goal_lon=${end.longitude}`
      );
      const data = await response.json();
      setRoute(data);
      const coordinates = data.route_path.map(coord => ({
        lat: coord.latitude,
        lng: coord.longitude,
      }));
      const snappedCoordinates = await snapToRoads(coordinates);
      setRoutePath(snappedCoordinates);
    };

    if (start && end) fetchRoute();
  }, [start, end, setRoute]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:8000/v1/location');
        const data = await res.json();
        const newPos = { latitude: data.latitude, longitude: data.longitude };
        setCourierPos(newPos);
        setStart(newPos);
        console.log("📍 Courier location:", newPos);
        console.log("📦 Order destination:", end);
      } catch (err) {
        console.error("Failed to update courier location:", err);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [end, setStart]);

  useEffect(() => {
    if (mapRef.current && courierPos) {
      const google = window.google;
      const latLng = new google.maps.LatLng(courierPos.latitude, courierPos.longitude);
      mapRef.current.panTo(latLng);
      if (!hasZoomed.current) {
        mapRef.current.setZoom(16);
        hasZoomed.current = true;
      }
    }
  }, [courierPos]);

  const handleMapLoad = (map) => {
    mapRef.current = map;
    const google = window.google;
    if (google) {
      setIcon({
        url: "/courier-icon.png",
        scaledSize: new google.maps.Size(40, 40),
      });
    }
  };

  return (
    <LoadScriptNext googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: courierPos.latitude, lng: courierPos.longitude }}
        zoom={16}
        onLoad={handleMapLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker
          position={{ lat: courierPos.latitude, lng: courierPos.longitude }}
          icon={icon || undefined}
        />
        <Marker position={{ lat: end.latitude, lng: end.longitude }} />
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{ strokeColor: '#22c55e', strokeWeight: 6 }}
          />
        )}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default RouteMap;
