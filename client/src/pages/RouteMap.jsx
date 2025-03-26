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
    const apiKey = "AIzaSyAQIhVhAaeTSYU3C294HRbbvPJT-9c_nIE"; // Substitua pela sua chave
    const pathString = path.map(coord => `${coord.lat},${coord.lng}`).join('|');
    
    try {
      const response = await fetch(
        `https://roads.googleapis.com/v1/snapToRoads?path=${pathString}&interpolate=true&key=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.snappedPoints) {
        throw new Error("Dados inesperados: 'snappedPoints' não encontrado.");
      }
      
      return data.snappedPoints.map(point => ({
        lat: point.location.latitude,
        lng: point.location.longitude,
      }));
    } catch (error) {
      console.error("Erro ao fazer snap to roads:", error);
      throw error;
    }
  };


  useEffect(() => {
    const fetchRoute = async () => {
      const response = await fetch(`http://localhost:8000/v1/route?start_lat=${start.latitude}&start_lon=${start.longitude}&goal_lat=${end.latitude}&goal_lon=${end.longitude}`);
      const data = await response.json();
      setRoute(data); // Salva a rota completa no estado

      const coordinates = data.route_path.map(coord => ({ lat: coord.latitude, lng: coord.longitude }));

      // Ajustar os pontos com Snap to Roads
      const snappedCoordinates = await snapToRoads(coordinates);
      setRoutePath(snappedCoordinates);
    };

    if (start && end) {
      fetchRoute();
    }
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
        zoom={10}
        onLoad={map => (mapRef.current = map)}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <Marker
          position={{ lat: start.latitude, lng: start.longitude }}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png', // Ícone padrão
          }}
        />
        <Marker
          position={{ lat: end.latitude, lng: end.longitude }}
          icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Ícone padrão
          }}
        />
        {routePath.length > 0 && (
          <Polyline
            path={routePath}
            options={{ strokeColor: '#000000', strokeWeight: 4 }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default RouteMap;
