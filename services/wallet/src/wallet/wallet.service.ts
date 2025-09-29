import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConflictResolutionService } from '../offline-sync/conflict-resolution'
import { OfflineBatchProcessor } from '../offline-sync/batch-processor'
import { ReconciliationService } from '../offline-sync/reconciliation'
import { TransactionSigningService } from '../security/transaction-signing'
import { FraudDetectionService } from '../security/fraud-detection'
import { PaymentProviderRegistry } from './providers/payment-provider.registry'
import { TopUpDto } from './dto/top-up.dto'
import { SpendDto } from './dto/spend.dto'

interface WalletBalance {
  wristbandId: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentProviderRegistry: PaymentProviderRegistry,
    private readonly conflictResolver: ConflictResolutionService,
    private readonly batchProcessor: OfflineBatchProcessor,
    private readonly reconciliationService: ReconciliationService,
    private readonly signingService: TransactionSigningService,
    private readonly fraudDetectionService: FraudDetectionService
  ) {}

  async getBalance(wristbandId: string): Promise<WalletBalance> {
    this.logger.debug(`Fetching balance for ${wristbandId}`);
    return {
      wristbandId,
      balance: 0,
      currency: 'ETB',
      updatedAt: new Date().toISOString()
    };
  }

  async topUp(wristbandId: string, payload: TopUpDto) {
    const provider = this.paymentProviderRegistry.getProvider(payload.provider);
    const signedRequest = this.signingService.signTopUpRequest({
      wristbandId,
      amount: payload.amount,
      provider: payload.provider,
      reference: payload.reference
    });

    await provider.initiateTopUp(signedRequest);

    return {
      wristbandId,
      newBalance: payload.amount,
      provider: payload.provider,
      processedAt: new Date().toISOString()
    };
  }

  async spend(wristbandId: string, payload: SpendDto) {
    this.fraudDetectionService.evaluateTransaction({
      wristbandId,
      amount: payload.amount,
      merchantId: payload.merchantId
    });

    this.batchProcessor.queueOfflineDebit({ wristbandId, ...payload });
    const reconciled = await this.reconciliationService.prepareRealtimeSettlement({
      wristbandId,
      amount: payload.amount
    });

    return {
      wristbandId,
      authorized: true,
      reconciled,
      processedAt: new Date().toISOString()
    };
  }
}
