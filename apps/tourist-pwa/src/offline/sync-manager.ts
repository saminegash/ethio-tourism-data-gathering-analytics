import { IndexedDbStore } from '../storage/indexed-db';
import { ConflictResolver } from './conflict-resolver';
import { CacheStrategy } from './cache-strategy';

export interface OfflineRecord {
  id: string;
  type: string;
  payload: unknown;
  createdAt: string;
}

export class SyncManagerClient {
  private readonly store = new IndexedDbStore('tourism-offline', 1);
  private readonly conflictResolver = new ConflictResolver();
  private readonly cacheStrategy = new CacheStrategy();

  async queue(record: OfflineRecord) {
    await this.store.set({
      id: record.id,
      data: record,
      timestamp: Date.now(),
      synced: false
    });
  }

  async sync() {
    const unsyncedItems = await this.store.getUnsyncedItems();
    const outbox = unsyncedItems.map(item => item.data as OfflineRecord);
    const conflicts = await this.conflictResolver.detectConflicts(outbox);

    if (conflicts.length > 0) {
      await this.conflictResolver.resolve(conflicts);
    }

    await this.cacheStrategy.refresh();
    
    // Mark items as synced instead of clearing
    for (const item of unsyncedItems) {
      await this.store.set({
        ...item,
        synced: true
      });
    }

    return {
      processed: outbox.length,
      syncedAt: new Date().toISOString()
    };
  }
}
