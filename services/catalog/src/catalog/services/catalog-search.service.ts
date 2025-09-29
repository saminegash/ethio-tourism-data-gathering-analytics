import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CatalogSearchService {
  private readonly logger = new Logger(CatalogSearchService.name);

  async indexPoi(poi: Record<string, unknown>) {
    this.logger.debug(`Indexing POI ${poi['id'] ?? 'unknown'}`);
  }

  async search(keyword: string) {
    this.logger.debug(`Searching catalog using keyword: ${keyword}`);
    return [];
  }
}
