import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloudIcon from '@mui/icons-material/Cloud';
import RouteIcon from '@mui/icons-material/Route';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StatusChecker = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(null);
  const [routeStatus, setRouteStatus] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = async () => {
    setIsRefreshing(true);
    
    try {
      const authRes = await fetch('http://127.0.0.1:8001/v1/auth/ping');
      setAuthStatus(authRes.ok);
    } catch {
      setAuthStatus(false);
    }

    try {
      const routeRes = await fetch('http://127.0.0.1:8000/v1/ping');
      setRouteStatus(routeRes.ok);
    } catch {
      setRouteStatus(false);
    }

    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusIcon = (status) => {
    if (status === null) return null;
    return status ? (
      <CheckCircleIcon className="w-8 h-8 text-green-500" />
    ) : (
      <ErrorIcon className="w-8 h-8 text-red-500" />
    );
  };

  const getStatusText = (status) => {
    if (status === null) return 'Checking...';
    return status ? 'Online' : 'Offline';
  };

  const getStatusColor = (status) => {
    if (status === null) return 'bg-gray-100 text-gray-600';
    return status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full shadow-lg mb-4">
            <CloudIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">System Status</h1>
          <p className="text-gray-600 mt-2">Check the status of our services</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Authentication Service */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <CloudIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Authentication Service</h3>
                    <p className="text-sm text-gray-500">User login and registration</p>
                  </div>
                </div>
                {authStatus === null ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                ) : (
                  getStatusIcon(authStatus)
                )}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(authStatus)}`}>
                <span>{getStatusText(authStatus)}</span>
              </div>
            </div>

            {/* Route Service */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <RouteIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Route Service</h3>
                    <p className="text-sm text-gray-500">Delivery route optimization</p>
                  </div>
                </div>
                {routeStatus === null ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-orange-500 border-t-transparent"></div>
                ) : (
                  getStatusIcon(routeStatus)
                )}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(routeStatus)}`}>
                <span>{getStatusText(routeStatus)}</span>
              </div>
            </div>

            {/* Overall Status */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600 mb-4">
                {authStatus && routeStatus ? (
                  <span className="text-green-600 font-medium">All systems operational</span>
                ) : authStatus === null || routeStatus === null ? (
                  <span className="text-gray-600">Checking system status...</span>
                ) : (
                  <span className="text-red-600 font-medium">Some services are experiencing issues</span>
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={checkStatus}
                disabled={isRefreshing}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RefreshIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ArrowBackIcon className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChecker;