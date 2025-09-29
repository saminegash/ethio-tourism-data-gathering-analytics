import { SyncManagerClient } from '../offline/sync-manager';

export interface SyncState {
  status: 'idle' | 'syncing' | 'offline';
  lastSyncedAt?: string;
  pending: number;
}

export class SyncManager {
  private readonly syncClient = new SyncManagerClient();
  private readonly subscribers = new Set<(state: SyncState) => void>();
  private state: SyncState = { status: 'idle', pending: 0 };

  subscribe(callback: (state: SyncState) => void) {
    this.subscribers.add(callback);
    callback(this.state);
    return {
      unsubscribe: () => this.subscribers.delete(callback)
    };
  }

  bootstrap() {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => this.sync());
    if (navigator.onLine) {
      void this.sync();
    } else {
      this.setState({ status: 'offline' });
    }
  }

  async queue(record: Parameters<SyncManagerClient['queue']>[0]) {
    await this.syncClient.queue(record);
    this.setState({ pending: this.state.pending + 1 });
  }

  async sync() {
    this.setState({ status: 'syncing' });
    const result = await this.syncClient.sync();
    this.setState({
      status: navigator.onLine ? 'idle' : 'offline',
      lastSyncedAt: result.syncedAt ?? new Date().toISOString(),
      pending: 0
    });
  }

  private setState(partial: Partial<SyncState>) {
    this.state = { ...this.state, ...partial };
    this.subscribers.forEach((callback) => callback(this.state));
  }
}
