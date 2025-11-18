import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductoI } from './interfaces/producto.interface';
import { producto as Producto } from '@prisma/client';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Crear producto
  async create(data: Partial<ProductoI>): Promise<Producto> {
    return this.prisma.producto.create({
      data,
    });
  }

  // READ ALL - Obtener todos los productos
  async findAll(): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      orderBy: { fechaRegistro: 'desc' },
    });
  }

  // READ ONE - Obtener un producto por ID
  async findOne(item: number): Promise<Producto | null> {
    return this.prisma.producto.findUnique({
      where: { item },
    });
  }

  // UPDATE - Actualizar producto
  async update(item: number, data: Partial<ProductoI>): Promise<Producto> {
    return this.prisma.producto.update({
      where: { item },
      data,
    });
  }

  // DELETE - Eliminar producto
  async remove(item: number): Promise<Producto> {
    return this.prisma.producto.delete({
      where: { item },
    });
  }

  // BUSCAR por categoría
  async findByCategoria(categoria: string): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: { categoria },
    });
  }

  // BUSCAR por nombre (búsqueda parcial)
  async search(nombre: string): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: {
        nombre: {
          contains: nombre,
        },
      },
    });
  }

  // BUSCAR por rango de precio
  async findByPrecio(precioMin?: number, precioMax?: number): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: {
        precio: {
          ...(precioMin !== undefined && { gte: precioMin }),
          ...(precioMax !== undefined && { lte: precioMax }),
        },
      },
      orderBy: { precio: 'asc' },
    });
  }

  // BUSCAR por rango de fecha
  async findByFecha(fechaInicio?: Date, fechaFin?: Date): Promise<Producto[]> {
    return this.prisma.producto.findMany({
      where: {
        fechaRegistro: {
          ...(fechaInicio && { gte: fechaInicio }),
          ...(fechaFin && { lte: fechaFin }),
        },
      },
      orderBy: { fechaRegistro: 'desc' },
    });
  }
}