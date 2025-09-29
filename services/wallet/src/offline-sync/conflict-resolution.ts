import { Injectable, Logger } from '@nestjs/common';

export interface OfflineTransaction {
  wristbandId: string;
  amount: number;
  merchantId?: string;
  occurredAt: string;
  signature?: string;
}

@Injectable()
export class ConflictResolutionService {
  private readonly logger = new Logger(ConflictResolutionService.name);

  resolve(conflicts: OfflineTransaction[]) {
    this.logger.debug(`Resolving ${conflicts.length} conflicts`);
    return conflicts.map((conflict) => ({
      ...conflict,
      resolution: 'accepted'
    }));
  }
}
