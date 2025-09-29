import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CatalogService } from '../services/catalog.service';
import { CreatePoiDto } from '../dto/create-poi.dto';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('destinations')
  listDestinations(@Query('region') region?: string) {
    return this.catalogService.listDestinations({ region });
  }

  @Get('pois/:id')
  getPoi(@Param('id') id: string) {
    return this.catalogService.getPoi(id);
  }

  @Post('pois')
  createPoi(@Body() payload: CreatePoiDto) {
    return this.catalogService.createPoi(payload);
  }
}
