import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { productos as Producto } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Crear producto
  async create(data: Prisma.productosCreateInput): Promise<Producto> {
    return this.prisma.productos.create({
      data,
    });
  }
  // READ ALL - Obtener todos los productos
  async findAll(): Promise<Producto[]> {
    return this.prisma.productos.findMany({
      orderBy: { id_producto: 'desc' },
    });
  }

  // READ ONE - Obtener un producto por ID
  async findOne(id_producto: number): Promise<Producto | null> {
    return this.prisma.productos.findUnique({
      where: { id_producto },
    });
  }

  
  // UPDATE - Actualizar producto
  async update(id_producto: number, data: Prisma.productosUpdateInput): Promise<Producto> {
    // evitar que se modifique la PK si viene en el payload
    const { id_producto: _omit, ...rest } = data as any;
    return this.prisma.productos.update({
      where: { id_producto },
      data: rest,
    });
  }
  // DELETE - Eliminar producto
  async remove(id_producto: number): Promise<Producto> {
    return this.prisma.productos.delete({
      where: { id_producto },
    });
  }

  // BUSCAR por marca
  async findByMarca(marca: string): Promise<Producto[]> {
    return this.prisma.productos.findMany({
      where: { marca },
    });
  }

  // BUSCAR por modelo (búsqueda parcial)
  async search(modelo: string): Promise<Producto[]> {
    return this.prisma.productos.findMany({
      where: {
        modelo: {
          contains: modelo,
        },
      },
    });
  }

  // BUSCAR por rango de precio
  async findByPrecio(precioMin?: number, precioMax?: number): Promise<Producto[]> {
    return this.prisma.productos.findMany({
      where: {
        precio_actual: {
          ...(precioMin !== undefined && { gte: precioMin }),
          ...(precioMax !== undefined && { lte: precioMax }),
        },
      },
      orderBy: { precio_actual: 'asc' },
    });
  }

  // BUSCAR por talla
  async findByTalla(talla: string): Promise<Producto[]> {
    return this.prisma.productos.findMany({
      where: { talla },
      orderBy: { id_producto: 'desc' },
    });
  }
}