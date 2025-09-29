import { Injectable } from '@nestjs/common';
import { CreatePoiDto } from '../dto/create-poi.dto';

@Injectable()
export class CatalogRepository {
  private readonly pois = new Map<string, any>();

  listDestinations(filters: { region?: string }) {
    return [
      {
        id: 'entoto-park',
        name: 'Entoto Park',
        region: 'Addis Ababa',
        filters
      }
    ];
  }

  getPoi(id: string) {
    return this.pois.get(id) ?? null;
  }

  async createPoi(payload: CreatePoiDto) {
    const id = `poi_${Date.now()}`;
    const record = {
      id,
      ...payload,
      createdAt: new Date().toISOString()
    };
    this.pois.set(id, record);
    return record;
  }
}
