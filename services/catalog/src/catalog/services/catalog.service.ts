import { Injectable } from '@nestjs/common';
import { CatalogRepository } from '../repositories/catalog.repository';
import { CatalogSearchService } from './catalog-search.service';
import { CreatePoiDto } from '../dto/create-poi.dto';

@Injectable()
export class CatalogService {
  constructor(
    private readonly repository: CatalogRepository,
    private readonly search: CatalogSearchService
  ) {}

  listDestinations(filters: { region?: string }) {
    return this.repository.listDestinations(filters);
  }

  getPoi(id: string) {
    return this.repository.getPoi(id);
  }

  async createPoi(payload: CreatePoiDto) {
    const poi = await this.repository.createPoi(payload);
    await this.search.indexPoi(poi);
    return poi;
  }
}
