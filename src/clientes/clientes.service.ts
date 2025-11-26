import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return this.prisma.clientes.create({ data });
  }

  async findAll() {
    return this.prisma.clientes.findMany();
  }

  async findOne(ci: number) {
    const cliente = await this.prisma.clientes.findUnique({ where: { ci } });
    if (!cliente) throw new NotFoundException(`Cliente con CI ${ci} no encontrado`);
    return cliente;
  }

  async update(ci: number, data: UpdateClienteDto) {
    await this.findOne(ci); // will throw if not exists
    return this.prisma.clientes.update({ where: { ci }, data });
  }

  async remove(ci: number) {
    await this.findOne(ci); // ensure exists
    return this.prisma.clientes.delete({ where: { ci } });
  }
}
