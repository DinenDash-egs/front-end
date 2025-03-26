import { useEffect, useState } from 'react';

const StatusChecker = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [routeStatus, setRouteStatus] = useState(null);

  useEffect(() => {
    const checkStatus = async () => {
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
    };

    checkStatus();
  }, []);

  return (
    <div
      data-theme="forest"
      className="flex items-center justify-center min-h-screen w-screen bg-base-200 p-4"
    >
      <div className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl px-6 py-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">API Status</h1>

        <div className="space-y-4 text-center">
          <div className="flex flex-col items-center">
            <span className="font-semibold">Authentication Service:</span>
            {authStatus === null ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : authStatus ? (
              <div className="badge badge-success badge-lg">Online</div>
            ) : (
              <div className="badge badge-error badge-lg">Offline</div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <span className="font-semibold">Route Service:</span>
            {routeStatus === null ? (
              <span className="loading loading-spinner text-primary"></span>
            ) : routeStatus ? (
              <div className="badge badge-success badge-lg">Online</div>
            ) : (
              <div className="badge badge-error badge-lg">Offline</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChecker;
