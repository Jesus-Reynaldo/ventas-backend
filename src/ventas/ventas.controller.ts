import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { VentasService } from './ventas.service';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  // CREATE
  @Post()
  async create(@Body() data: any) {
    return this.ventasService.create(data);
  }

  // READ ALL
  @Get()
  async findAll() {
    return this.ventasService.findAll();
  }

  // READ ONE
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ventasService.findOne(Number(id));
  }

  // UPDATE
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.ventasService.update(Number(id), data);
  }

  // DELETE
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.ventasService.delete(Number(id));
  }
}
