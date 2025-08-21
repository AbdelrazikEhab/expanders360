import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';

@Controller('vendors')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class VendorsController {
  constructor(private svc: VendorsService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateVendorDto) {
    return this.svc.create(dto);
  }

  @Get()
  @Roles('admin')
  list() { return this.svc.list(); }
}
