import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DocumentScannerIntegration {
  private readonly logger = new Logger(DocumentScannerIntegration.name);

  async scanDocument(documentNumber: string) {
    this.logger.debug(`Scanning document ${documentNumber}`);

    return {
      documentNumber,
      authenticity: 'pending',
      mrzExtracted: true,
      scannedAt: new Date().toISOString()
    };
  }
}
