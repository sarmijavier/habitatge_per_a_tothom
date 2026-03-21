import { Controller, Get, Logger, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  private readonly logger = new Logger(GeoController.name);

  constructor(private readonly geoService: GeoService) {}

  @Get(':country')
  async getGeo(
    @Param('country') country: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { geo } = await this.geoService.getEntry(country.toLowerCase());
      res.json(geo);
    } catch (err) {
      this.logger.error(`Failed to serve GeoJSON for "${country}": ${(err as Error).message}`);
      res.status(502).json({ error: `Could not load GeoJSON for "${country}"` });
    }
  }
}
