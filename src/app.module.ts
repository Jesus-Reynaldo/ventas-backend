import { Module } from '@nestjs/common';
import { ProductoModule } from './producto/producto.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsuarioModule } from './usuario/usuario.module';


@Module({
  imports: [ProductoModule, PrismaModule, UsuarioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
