import { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Polyline, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 40.631,
  lng: -8.657
};

const RouteMap = ({ start, end, route, setRoute }) => {
  const mapRef = useRef(null);
  const [routePath, setRoutePath] = useState([]);

  const snapToRoads = async (path) => {
    const apiKey = "AIzaSyAQIhVhAaeTSYU3C294HRbbvPJT-9c_nIE";
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
      const response = await fetch(`http://localhost:8000/v1/route?start_lat=${start.latitude}&start_lon=${start.longitude}&goal_lat=${end.latitude}&goal_lon=${end.longitude}`);
      const data = await response.json();
      setRoute(data);

      const coordinates = data.route_path.map(coord => ({ lat: coord.latitude, lng: coord.longitude }));
      const snappedCoordinates = await snapToRoads(coordinates);
      setRoutePath(snappedCoordinates);
    };

    if (start && end) fetchRoute();
  }, [start, end, setRoute]);

  useEffect(() => {
    if (mapRef.current && routePath.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      routePath.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds);
    }
  }, [routePath]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAQIhVhAaeTSYU3C294HRbbvPJT-9c_nIE">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={(map) => (mapRef.current = map)}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker position={{ lat: start.latitude, lng: start.longitude }} />
        <Marker position={{ lat: end.latitude, lng: end.longitude }} />
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{ strokeColor: '#22c55e', strokeWeight: 4 }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
