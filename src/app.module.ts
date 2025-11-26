import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductoModule } from './productos/productos.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';

@Module({
  imports: [PrismaModule, DetalleVentaModule, ProductoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
