import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':ci')
  findOne(@Param('ci') ci: string) {
    return this.clientesService.findOne(Number(ci));
  }

  @Patch(':ci')
  update(@Param('ci') ci: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(Number(ci), updateClienteDto);
  }

  @Delete(':ci')
  remove(@Param('ci') ci: string) {
    return this.clientesService.remove(Number(ci));
  }
}
