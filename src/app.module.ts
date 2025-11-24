import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientesModule } from './clientes/clientes.module';

@Module({
  imports: [PrismaModule, ClientesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
