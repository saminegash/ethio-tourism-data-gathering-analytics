import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FraudDetectionService {
  private readonly logger = new Logger(FraudDetectionService.name);

  evaluateTransaction(event: {
    wristbandId: string;
    amount: number;
    merchantId?: string;
  }) {
    if (event.amount > 1000) {
      this.logger.warn(`High value transaction flagged for ${event.wristbandId}`);
    }
  }
}
