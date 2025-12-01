import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { VentasModule } from './ventas/ventas.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProductoModule } from './productos/productos.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { InventarioModule } from './inventario/inventario.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module'; 

@Module({
  imports: [
    PrismaModule, 
    ClientesModule, 
    DetalleVentaModule, 
    ProductoModule, 
    VentasModule, 
    InventarioModule, 
    UsuariosModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}