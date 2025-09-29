import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ImmigrationIntegration {
  private readonly logger = new Logger(ImmigrationIntegration.name);

  async fetchTravelerStatus(documentNumber: string) {
    if (!process.env.IMMIGRATION_API_URL) {
      this.logger.warn(
        'IMMIGRATION_API_URL not configured, returning mock immigration status'
      );
      return {
        documentNumber,
        status: 'mock-cleared',
        lastEntry: null
      };
    }

    const response = await axios.get(
      `${process.env.IMMIGRATION_API_URL}/travelers/${documentNumber}`,
      {
        headers: {
          'X-API-KEY': process.env.IMMIGRATION_API_KEY ?? ''
        }
      }
    );

    return response.data;
  }
}
