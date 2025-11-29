// src/inventario/inventario.module.ts
import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { PdfService } from './pdf.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [InventarioController],
  providers: [InventarioService, PdfService, PrismaService],
})
export class InventarioModule {}