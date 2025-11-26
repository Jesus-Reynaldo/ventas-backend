// src/inventario/inventario.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateInventarioI, UpdateInventarioI } from './interfaces/inventario.interface';

@Injectable()
export class InventarioService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateInventarioI) {
    return this.prisma.inventario.create({ data });
  }

  findAll() {
    return this.prisma.inventario.findMany({ include: { productos: true } });
  }

  findOne(id: number) {
    return this.prisma.inventario.findUnique({
      where: { id_inventario: id },
      include: { productos: true },
    });
  }

  update(id: number, data: UpdateInventarioI) {
    return this.prisma.inventario.update({
      where: { id_inventario: id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.inventario.delete({ where: { id_inventario: id } });
  }
}