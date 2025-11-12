import { Controller } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Get } from '@nestjs/common';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  @Get()
  async mostarUsuarios() {
    return this.usuarioService.mostarUsuarios();
  }
}
