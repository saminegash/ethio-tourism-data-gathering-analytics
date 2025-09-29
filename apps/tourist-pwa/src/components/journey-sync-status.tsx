'use client';

import { useSyncState } from '../hooks/useSyncState';

export function JourneySyncStatus() {
  const { status, lastSyncedAt, pendingItems } = useSyncState();

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Status</span>
        <span className="text-sm font-semibold text-primary-600">{status}</span>
      </div>
      <div className="mt-2 text-sm text-slate-500">
        Last synced: {lastSyncedAt ?? 'Never'}
      </div>
      <div className="mt-1 text-sm text-slate-500">
        Pending updates: {pendingItems}
      </div>
    </div>
  );
}
