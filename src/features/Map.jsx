import { useEffect, useState } from "react";

export default function Map() {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Dynamically load Google Maps API
  useEffect(() => {
    if (window.google && window.google.maps) {
      setApiLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => setApiLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

  // Get user location
  useEffect(() => {
    if (apiLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, [apiLoaded]);

  // Initialize Google Map
  useEffect(() => {
    if (apiLoaded && location) {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 15,
      });
      setMap(mapInstance);

      new window.google.maps.Marker({
        position: location,
        map: mapInstance,
      });
    }
  }, [apiLoaded, location]);

  return (
    <div className="w-screen h-screen">
      <div id="map" className="w-full h-full" />
    </div>
  );
}
