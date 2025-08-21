import { Injectable } from '@nestjs/common';
import { MatchesService } from '../matches/matches.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private matches: MatchesService,
    private docs: DocumentsService,
  ) {}

  async topVendorsWithDocCounts() {
    const topMap = await this.matches.topVendorsAvgScoreLast30Days();
    const result: Record<string, any> = {};
    for (const country of Object.keys(topMap)) {
      const docCount = await this.docs.countDocsByCountry(country);
      result[country] = {
        topVendors: topMap[country],
        researchDocuments: docCount,
      };
    }
    return result;
  }
}
