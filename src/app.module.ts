import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductoModule } from './productos/productos.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';

@Module({
  imports: [PrismaModule, ClientesModule, DetalleVentaModule, ProductoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
