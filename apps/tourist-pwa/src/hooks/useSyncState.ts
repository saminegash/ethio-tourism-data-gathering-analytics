'use client';

import { useState, useEffect } from 'react';

interface SyncState {
  status: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: string | null;
  pendingItems: number;
}

export function useSyncState(): SyncState {
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'synced',
    lastSyncedAt: null,
    pendingItems: 0
  });

  useEffect(() => {
    // Simulate sync status based on online/offline state
    const updateSyncStatus = () => {
      if (navigator.onLine) {
        setSyncState(prev => ({
          ...prev,
          status: 'synced',
          lastSyncedAt: new Date().toLocaleTimeString(),
          pendingItems: 0
        }));
      } else {
        setSyncState(prev => ({
          ...prev,
          status: 'offline',
          pendingItems: Math.floor(Math.random() * 5) + 1
        }));
      }
    };

    // Initial status
    updateSyncStatus();

    // Listen for connectivity changes
    window.addEventListener('online', updateSyncStatus);
    window.addEventListener('offline', updateSyncStatus);

    // Simulate periodic sync checks
    const interval = setInterval(() => {
      if (navigator.onLine) {
        setSyncState(prev => ({
          ...prev,
          lastSyncedAt: new Date().toLocaleTimeString()
        }));
      }
    }, 30000); // Update every 30 seconds

    return () => {
      window.removeEventListener('online', updateSyncStatus);
      window.removeEventListener('offline', updateSyncStatus);
      clearInterval(interval);
    };
  }, []);

  return syncState;
}