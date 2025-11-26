import { Module } from '@nestjs/common';
import { ProductoService } from './productos.service';
import { ProductoController } from './productos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], 
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService], 
})
export class ProductoModule {};