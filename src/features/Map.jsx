import { useEffect, useState } from "react";

export default function Map() {
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // ✅ Ensure Google Maps API is loaded only once
    if (!window.google || !window.google.maps) {
      const scriptExists = document.querySelector("script[src*='maps.googleapis.com']");
      if (!scriptExists) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log("✅ Google Maps API loaded");
          setApiLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        scriptExists.addEventListener("load", () => {
          console.log("✅ Google Maps API already loaded");
          setApiLoaded(true);
        });
      }
    } else {
      setApiLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (apiLoaded && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("📍 User location:", userLocation);
          setLocation(userLocation);
        },
        (error) => console.error("❌ Error getting location", error)
      );
    }
  }, [apiLoaded]);

  useEffect(() => {
    if (apiLoaded && location && window.google && window.google.maps) {
      console.log("🗺️ Initializing Google Map with location:", location);
      
      const mapElement = document.getElementById("map");
      if (!mapElement) {
        console.error("❌ Map element not found!");
        return;
      }

      const mapInstance = new window.google.maps.Map(mapElement, {
        center: location,
        zoom: 15,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP, // ✅ Ensure a valid map type
      });

      setMap(mapInstance);

      // ✅ Use AdvancedMarkerElement if available, fallback to Marker
      if (window.google.maps.marker?.AdvancedMarkerElement) {
        new window.google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: mapInstance,
        });
      } else {
        new window.google.maps.Marker({
          position: location,
          map: mapInstance,
        });
      }
    }
  }, [apiLoaded, location]);

  return (
    <div className="w-screen h-screen">
      <div id="map" className="w-full h-full" />
    </div>
  );
}
