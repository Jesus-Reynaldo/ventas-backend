import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { VentasModule } from './ventas/ventas.module';
import { ProductoModule } from './productos/productos.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';

@Module({
  imports: [PrismaModule, DetalleVentaModule, ProductoModule, VentasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
