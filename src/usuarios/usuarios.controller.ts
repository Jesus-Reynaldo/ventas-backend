import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuarioService } from './usuarios.service';
import type { CreateUsuarioDto, UpdateUsuarioDto } from './interfaces/usuarios.interface';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // POST - Crear usuario
  @Post()
  create(@Body() createUsuario: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuario);
  }

  // GET - Obtener todos
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  // GET - Buscar por rol
  @Get('rol/:rol')
  findByRol(@Param('rol') rol: 'admin' | 'vendedor') {
    return this.usuarioService.findByRol(rol);
  }

  // GET - Buscar por estado
  @Get('estado/:estado')
  findByEstado(@Param('estado') estado: 'activo' | 'inactivo' | 'suspendido') {
    return this.usuarioService.findByEstado(estado);
  }

  // GET - Buscar por email
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usuarioService.findByEmail(email);
  }

  // GET - Buscar por nombre de usuario
  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    const usuario = await this.usuarioService.findByUsername(username);
    if (!usuario) {
      return null;
    }
    // No retornar el password_hash
    const { password_hash, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // GET - Obtener uno por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  // PATCH - Actualizar
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuario: UpdateUsuarioDto) {
    return this.usuarioService.update(+id, updateUsuario);
  }

  // DELETE - Soft delete (cambiar estado a inactivo)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

  // DELETE - Hard delete (eliminar físicamente)
  @Delete(':id/hard')
  removeHard(@Param('id') id: string) {
    return this.usuarioService.removeHard(+id);
  }

  // PATCH - Actualizar última conexión
  @Patch(':id/ultima-conexion')
  updateUltimaConexion(@Param('id') id: string) {
    return this.usuarioService.updateUltimaConexion(+id);
  }
}