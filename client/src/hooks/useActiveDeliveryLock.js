// src/hooks/useActiveDeliveryLock.js
import { useEffect, useState } from 'react';

const useActiveDeliveryLock = () => {
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const checkActiveDelivery = async () => {
      if (!username) {
        setLocked(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5007/v1/user/active/${username}`);
        if (res.status === 200) {
          setLocked(true); // Has active in_transit order
        } else {
          setLocked(false);
        }
      } catch (error) {
        console.error('Failed to check active delivery', error);
        setLocked(false);
      } finally {
        setLoading(false);
      }
    };

    checkActiveDelivery();
  }, [username]);

  return { locked, loading };
};

export default useActiveDeliveryLock;
