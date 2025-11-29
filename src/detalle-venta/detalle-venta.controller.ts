import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import * as detalleVentaInterface from './interface/detalleVenta.interface';
import { PdfService } from './pdf.service';
import type { Response } from 'express';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService, 
    private readonly pdfService: PdfService) {}
  
  @Get()
  async mostrarDetalleVenta() {
    return await this.detalleVentaService.mostrarDetalleVenta();
  }

  @Post('export/pdf')
  async exportPDFFiltered(@Body() body: { data: any[] }, @Res() res: Response) {
    const data = body.data && body.data.length > 0 
      ? body.data 
      : await this.detalleVentaService.mostrarDetalleVenta();
    this.pdfService.generateDetalleVentaPDF(data, res);
  }

  @Get('export/pdf')
  async exportPDF(@Res() res: Response) {
    const data = await this.detalleVentaService.mostrarDetalleVenta();
    this.pdfService.generateDetalleVentaPDF(data, res);
  }

  @Get(':id')
  async mostrarDetalleVentaPorId(@Param('id') id: string) {
    return await this.detalleVentaService.mostrarDetalleVentaPorId(Number(id));
  }

  @Get('venta/:id')
  async mostrarDetalleVentaPorVentaId(@Param('id') id: string) {
    return await this.detalleVentaService.mostrarDetalleVentaPorVentaId(Number(id));
  }

  @Get('producto/:id')
  async mostrarDetalleVentaPorProductoId(@Param('id') id: string) {
    return await this.detalleVentaService.mostrarDetalleVentaPorProductoId(Number(id));
  }

  @Get('precio/:precio')
  async mostrarDetalleVentaPorPrecioUnitario(@Param('precio') precio: string) {
    return await this.detalleVentaService.mostrarDetalleVentaPorPrecioUnitario(Number(precio));
  }

  @Get('cliente/:ci')
  async mostrarDetalleVentaPorClienteId(@Param('ci') ci: string) {
    return await this.detalleVentaService.mostrarDetalleVentaPorClienteId(Number(ci));
  }

  @Get('cliente/:ci/completo')
  async mostrarDetalleVentaPorClienteIdCompleto(@Param('ci') ci: string) {
    return await this.detalleVentaService.mostrarDetalleVentaPorClienteIdCompleto(Number(ci));
  }

  @Get("fecha/:fechaInicio/:fechaFin")
  async mostrarDetalleVentaPorFecha(@Param('fechaInicio') fechaInicio: string, @Param('fechaFin') fechaFin: string) {
    return await this.detalleVentaService.mostrarDetalleVentaPorFecha(new Date(fechaInicio), new Date(fechaFin));
  }

  @Patch(':id')
  async actualizarDetalleVenta(@Param('id') id: string, @Body() detalleVenta: detalleVentaInterface.DetalleVentaI) {
    return await this.detalleVentaService.actualizarDetalleVenta(Number(id), detalleVenta);
  }

  @Delete(':id')
  async eliminarDetalleVenta(@Param('id') id: string) {
    return await this.detalleVentaService.eliminarDetalleVenta(Number(id));
  }
}
