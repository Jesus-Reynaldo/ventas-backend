// src/inventario/inventario.module.ts
import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [InventarioController],
  providers: [InventarioService, PrismaService],
})
export class InventarioModule {}