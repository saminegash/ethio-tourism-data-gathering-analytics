import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class FaydaIntegration {
  private readonly logger = new Logger(FaydaIntegration.name);

  async lookupCitizen(documentNumber: string) {
    if (!process.env.FAYDA_API_URL) {
      this.logger.warn(
        'FAYDA_API_URL not configured, returning mock Fayda record'
      );
      return {
        documentNumber,
        status: 'mock-found',
        identityScore: 0.92
      };
    }

    const response = await axios.get(
      `${process.env.FAYDA_API_URL}/citizens/${documentNumber}`,
      {
        headers: {
          'X-API-KEY': process.env.FAYDA_API_KEY ?? ''
        }
      }
    );

    return response.data;
  }
}
