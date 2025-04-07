import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = "AIzaSyAQIhVhAaeTSYU3C294HRbbvPJT-9c_nIE";

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const DeliveryMap = ({ onSelectLocation }) => {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState({ lat: 38.7169, lng: -9.1399 });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn("Geolocation not allowed or failed:", err.message);
      }
    );
  }, []);

  const handleMapClick = async (e) => {
    const latLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        setMarker(latLng);
        setAddress(results[0].formatted_address);
      } else {
        console.warn("Geocoding failed:", status);
        setMarker(latLng);
        setAddress("Unknown location");
      }
    });
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div className="relative">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onClick={handleMapClick}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {marker && <Marker position={marker} />}
        </GoogleMap>

        {/* Display selected address & next step */}
        {marker && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-xl w-[90%] max-w-md text-center space-y-2">
            <div className="text-sm text-gray-600">
              Selected Address:
              <div className="font-medium">{address}</div>
            </div>
            <button
              onClick={() => onSelectLocation(marker, address)}
              className="btn btn-primary btn-sm rounded-full w-full"
              disabled={address === ''}
            >
              Next Step
            </button>
          </div>
        )}
      </div>
    </LoadScript>
  );
};

export default DeliveryMap;
