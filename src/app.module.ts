import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';



@Module({
  imports: [PrismaModule, DetalleVentaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
