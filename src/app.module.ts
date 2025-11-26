import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductoModule } from './productos/productos.module';


@Module({
  imports: [PrismaModule, ProductoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
