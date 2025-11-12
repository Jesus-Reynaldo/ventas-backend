import { Body, Controller, Get , Post } from '@nestjs/common';
import { ProductoService } from './producto.service';
import type { producto } from '@prisma/client';
import * as ProductoInterface from './interfaces/producto.interface';


@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}
  @Get()
  async mostarProductos() {
    return this.productoService.mostarProductos();
  }

  @Post()
  async crearProducto(@Body() nuevoProducto: ProductoInterface.ProductoI) {
    return this.productoService.crearProducto(nuevoProducto);
  }
}
