import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaController } from './detalle-venta.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfService } from './pdf.service';

@Module({
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService,PdfService],
  imports: [PrismaModule],
  exports: [DetalleVentaService],
})
export class DetalleVentaModule {}
