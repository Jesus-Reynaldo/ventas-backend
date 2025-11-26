import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaController } from './detalle-venta.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService],
  imports: [PrismaModule],
  exports: [DetalleVentaService],
})
export class DetalleVentaModule {}
