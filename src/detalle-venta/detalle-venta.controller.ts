import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import * as detalleVentaInterface from './interface/detalleVenta.interface';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly detalleVentaService: DetalleVentaService) {}
  @Post()
  crearDetalleVenta(@Body() nuevoDetalleVenta: detalleVentaInterface.DetalleVentaI) {
    return this.detalleVentaService.crearDetalleVenta(nuevoDetalleVenta);
  }
 
  @Get()
  async mostrarDetalleVenta() {
    return await this.detalleVentaService.mostrarDetalleVenta();
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

  
  @Patch(':id')
  async actualizarDetalleVenta(@Param('id') id: string, @Body() detalleVenta: detalleVentaInterface.DetalleVentaI) {
    return await this.detalleVentaService.actualizarDetalleVenta(Number(id), detalleVenta);
  }

  @Delete(':id')
  async eliminarDetalleVenta(@Param('id') id: string) {
    return await this.detalleVentaService.eliminarDetalleVenta(Number(id));
  }
}
