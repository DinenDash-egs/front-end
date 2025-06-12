import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const GOOGLE_MAPS_API_KEY = "AIzaSyDDsjx2dcP0Tol0IHli51DTeq36CnFQupc";

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

const DeliveryMap = ({ onSelectLocation }) => {
  const navigate = useNavigate();
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState({ lat: 40.6405, lng: -8.6538 }); // Aveiro coordinates
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(newCenter);
        setIsGettingLocation(false);
      },
      (err) => {
        console.warn("Geolocation not allowed or failed:", err.message);
        setIsGettingLocation(false);
      }
    );
  };

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

  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <LocationOnIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Failed to load Google Maps</p>
          <p className="text-gray-500 text-sm mt-2">Please check your internet connection</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <LocationOnIcon className="w-16 h-16 text-orange-500 mx-auto" />
          </div>
          <p className="text-gray-600 font-semibold">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={handleMapClick}
        options={{ 
          disableDefaultUI: true, 
          zoomControl: true,
          styles: mapStyles,
          gestureHandling: 'greedy'
        }}
      >
        {marker && (
          <Marker 
            position={marker}
            icon={{
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#FB923C" stroke="#EA580C" stroke-width="3"/>
                  <circle cx="20" cy="20" r="8" fill="#EA580C"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 20),
            }}
          />
        )}
      </GoogleMap>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowBackIcon className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Select Delivery Location</h1>
            <button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
            >
              <MyLocationIcon className={`w-5 h-5 text-orange-600 ${isGettingLocation ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-gray-600 text-center">Tap on the map to select your delivery address</p>
        </div>
      </div>

      {/* Address Selection Card */}
      {marker && (
        <div className="absolute bottom-6 left-4 right-4 animate-slideUp">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-amber-400 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <LocationOnIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Delivery Address</p>
                  <p className="font-semibold">Selected Location</p>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <p className="text-gray-900 font-medium leading-relaxed">{address || 'Loading address...'}</p>
              </div>
              
              <button
                onClick={() => onSelectLocation(marker, address || 'Selected Location')}
                disabled={!marker}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>Continue to Checkout</span>
                <ArrowForwardIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions Card - shown when no marker */}
      {!marker && (
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white rounded-2xl shadow-lg p-4 text-center">
            <LocationOnIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-gray-700 font-medium">Where should we deliver?</p>
            <p className="text-sm text-gray-500 mt-1">Tap anywhere on the map to set your location</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryMap;