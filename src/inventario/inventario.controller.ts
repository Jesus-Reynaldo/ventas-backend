// src/inventario/inventario.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { InventarioService } from './inventario.service';
import { PdfService } from './pdf.service';
import type { CreateInventarioI, UpdateInventarioI } from './interfaces/inventario.interface';

@Controller('inventario')
export class InventarioController {
  constructor(
    private readonly inventarioService: InventarioService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  create(@Body() dto: CreateInventarioI) {
    return this.inventarioService.create(dto);
  }

  @Get()
  findAll() {
    return this.inventarioService.findAll();
  }

  @Post('export/pdf')
  async exportPDFFiltered(@Body() body: { data: any[] }, @Res() res: Response) {
    const data = body.data && body.data.length > 0 
      ? body.data 
      : await this.inventarioService.findAll();
    this.pdfService.generateInventoryPDF(data, res);
  }

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const data = await this.inventarioService.findAll();
    this.pdfService.generateInventoryPDF(data, res);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInventarioI) {
    return this.inventarioService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(Number(id));
  }
}