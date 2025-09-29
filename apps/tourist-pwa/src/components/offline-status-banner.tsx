'use client';

import { useState, useEffect } from 'react';

export function OfflineStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Set initial status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isOnline) {
    return null; // Don't show banner when online
  }

  return (
    <div className="mb-4 rounded-lg bg-yellow-50 border border-yellow-200 p-3">
      <div className="flex items-center gap-2">
        <span className="text-yellow-600">📡</span>
        <div>
          <p className="text-sm font-medium text-yellow-800">
            You're currently offline
          </p>
          <p className="text-xs text-yellow-600">
            Your data will sync when connection is restored
          </p>
        </div>
      </div>
    </div>
  );
}