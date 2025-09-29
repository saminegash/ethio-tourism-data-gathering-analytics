import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './health/health.controller';
import { WalletController } from './wallet/wallet.controller';
import { WalletService } from './wallet/wallet.service';
import { TelebirrProvider } from './wallet/providers/telebirr.provider';
import { CoopayProvider } from './wallet/providers/coopay.provider';
import { CbeBirrProvider } from './wallet/providers/cbe-birr.provider';
import { VisaMastercardProvider } from './wallet/providers/visa-mastercard.provider';
import { MockPspProvider } from './wallet/providers/mock-psp.provider';
import { PaymentProviderRegistry } from './wallet/providers/payment-provider.registry';
import { ConflictResolutionService } from './offline-sync/conflict-resolution';
import { OfflineBatchProcessor } from './offline-sync/batch-processor';
import { ReconciliationService } from './offline-sync/reconciliation';
import { TransactionSigningService } from './security/transaction-signing';
import { FraudDetectionService } from './security/fraud-detection';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    })
  ],
  controllers: [HealthController, WalletController],
  providers: [
    WalletService,
    TelebirrProvider,
    CoopayProvider,
    CbeBirrProvider,
    VisaMastercardProvider,
    MockPspProvider,
    PaymentProviderRegistry,
    ConflictResolutionService,
    OfflineBatchProcessor,
    ReconciliationService,
    TransactionSigningService,
    FraudDetectionService
  ]
})
export class AppModule {}
