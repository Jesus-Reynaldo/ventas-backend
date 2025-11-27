import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductoService } from './productos.service';
import { ProductoI } from './interfaces/productos.interface';
import { Prisma } from '@prisma/client';

@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  // POST - Crear producto
  @Post()
  create(@Body() createProducto: Partial<ProductoI>) {
    return this.productoService.create(createProducto as Prisma.productosCreateInput);
  }

  // GET - Obtener todos
  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  // POST - Buscar por modelo
  @Post('buscar')
  search(@Body('modelo') modelo: string) {
    return this.productoService.search(modelo);
  }

  // POST - Buscar por rango de precio
  @Post('precio')
  findByPrecio(@Body() body: { min?: number; max?: number }) {
    return this.productoService.findByPrecio(body.min, body.max);
  }

  // GET Buscar por marca
  @Get('marca/:marca')
  findByMarca(@Param('marca') marca: string) {
    return this.productoService.findByMarca(marca);
  }

  // GET - Buscar por medida
  @Get('medida/:medida')
  findByMedida(@Param('medida') medida: string) {
    return this.productoService.findByMedida(medida);
  }

  // GET - Buscar por categoría
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
}