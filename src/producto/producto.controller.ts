import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoI } from './interfaces/producto.interface';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // POST - Crear producto
  @Post()
  create(@Body() createProducto: Partial<ProductoI>) {
    return this.productoService.create(createProducto);
  }

  // GET - Obtener todos
  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  // POST - Buscar por nombre
  @Post('buscar')
  search(@Body('nombre') nombre: string) {
    return this.productoService.search(nombre);
  }

  // POST - Buscar por rango de precio
  @Post('precio')
  findByPrecio(@Body() body: { min?: number; max?: number }) {
    return this.productoService.findByPrecio(body.min, body.max);
  }

  // POST - Buscar por rango de fecha
  @Post('fecha')
  findByFecha(@Body() body: { inicio?: string; fin?: string }) {
    const fechaInicio = body.inicio ? new Date(body.inicio) : undefined;
    const fechaFin = body.fin ? new Date(body.fin) : undefined;
    return this.productoService.findByFecha(fechaInicio, fechaFin);
  }

  // GET Buscar por categoría
  @Get('categoria/:categoria')
  findByCategoria(@Param('categoria') categoria: string) {
    return this.productoService.findByCategoria(categoria);
  }

  // GET - Obtener uno por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  // PATCH - Actualizar
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProducto: Partial<ProductoI>) {
    return this.productoService.update(+id, updateProducto);
  }

  // DELETE - Eliminar
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
};