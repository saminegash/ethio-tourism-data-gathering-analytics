import { Module } from '@nestjs/common';
import { CatalogController } from './controllers/catalog.controller'
import { CatalogService } from './services/catalog.service'
import { CatalogSearchService } from './services/catalog-search.service'
import { CatalogRepository } from './repositories/catalog.repository'

@Module({
  controllers: [CatalogController],
  providers: [CatalogService, CatalogSearchService, CatalogRepository],
  exports: [CatalogService]
})
export class CatalogModule {}
