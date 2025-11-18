// usuario.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpException,
  HttpStatus 
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // POST /usuario - Registrar usuario
  @Post()
  async create(@Body() createUsuario: any) {
    try {
      return await this.usuarioService.create(createUsuario);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // POST /usuario/login - Iniciar sesión con email o nombre
  @Post('login')
  async login(@Body() credentials: { identificador: string; password: string }) {
    try {
      return await this.usuarioService.login(
        credentials.identificador, 
        credentials.password
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al iniciar sesión',
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  // GET /usuario - Obtener todos
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  // GET /usuario/role/:role - Buscar por rol
  @Get('role/:role')
  findByRole(@Param('role') role: string) {
    return this.usuarioService.findByRole(role);
  }

  // GET /usuario/:id - Obtener uno
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuarioService.findOne(+id);
    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return usuario;
  }

  // PATCH /usuario/:id/cambiar-password - Cambiar contraseña
  @Patch(':id/cambiar-password')
  async updatePassword(
    @Param('id') id: string,
    @Body() passwords: { passwordActual: string; passwordNueva: string }
  ) {
    try {
      return await this.usuarioService.updatePassword(
        +id,
        passwords.passwordActual,
        passwords.passwordNueva
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al cambiar contraseña',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // PATCH /usuario/:id - Actualizar
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUsuario: any) {
    try {
      return await this.usuarioService.update(+id, updateUsuario);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al actualizar usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // DELETE /usuario/:id - Eliminar
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.usuarioService.remove(+id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al eliminar usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }
}