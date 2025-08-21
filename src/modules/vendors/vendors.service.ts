import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from './vendor.entity';
import { CreateVendorDto } from './dto';

@Injectable()
export class VendorsService {
  constructor(@InjectRepository(Vendor) private vendors: Repository<Vendor>) {}

  create(dto: CreateVendorDto) {
    const v = this.vendors.create({
      name: dto.name,
      countries_supported: dto.countries_supported,
      services_offered: dto.services_offered,
      rating: dto.rating ?? 4.0,
      response_sla_hours: dto.response_sla_hours ?? 72,
      sla_expires_at: new Date(Date.now() + 1000 * 60 * 60 * (dto.response_sla_hours ?? 72)),
      sla_expired: false,
    });
    return this.vendors.save(v);
  }

  list() { return this.vendors.find(); }

  async flagExpired() {
    const now = new Date();
    const list = await this.vendors.find();
    for (const v of list) {
      if (v.sla_expires_at && v.sla_expires_at < now && !v.sla_expired) {
        v.sla_expired = true
        await this.vendors.save(v);
      }
    }
  }
}
