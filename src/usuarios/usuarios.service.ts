import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { usuarios as Usuario } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { CreateUsuarioDto, UpdateUsuarioDto } from './interfaces/usuarios.interface';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Crear usuario
  async create(data: CreateUsuarioDto): Promise<Omit<Usuario, 'password_hash'>> {
    // Verificar si el usuario ya existe
    const existeUsuario = await this.prisma.usuarios.findUnique({
      where: { nombre_usuario: data.nombre_usuario },
    });

    if (existeUsuario) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Verificar si el email ya existe
    const existeEmail = await this.prisma.usuarios.findUnique({
      where: { email: data.email },
    });

    if (existeEmail) {
      throw new ConflictException('El email ya está en uso');
    }

    // Hashear la contraseña
    const password_hash = await bcrypt.hash(data.password, 10);

    // Crear el usuario
    const usuario = await this.prisma.usuarios.create({
      data: {
        nombre_usuario: data.nombre_usuario,
        password_hash,
        nombre_completo: data.nombre_completo,
        email: data.email,
        telefono: data.telefono,
        rol: data.rol || 'vendedor',
        estado: data.estado || 'activo',
      },
    });

    // Retornar sin el password_hash
    const { password_hash: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // READ ALL - Obtener todos los usuarios
  async findAll(): Promise<Omit<Usuario, 'password_hash'>[]> {
    const usuarios = await this.prisma.usuarios.findMany({
      orderBy: { id_usuario: 'desc' },
    });

    // Remover password_hash de todos los usuarios
    return usuarios.map(({ password_hash, ...usuario }) => usuario);
  }

  // READ ONE - Obtener un usuario por ID
  async findOne(id_usuario: number): Promise<Omit<Usuario, 'password_hash'> | null> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id_usuario} no encontrado`);
    }

    const { password_hash, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // READ BY USERNAME - Obtener usuario por nombre de usuario
  async findByUsername(nombre_usuario: string): Promise<Usuario | null> {
    return this.prisma.usuarios.findUnique({
      where: { nombre_usuario },
    });
  }

  // READ BY EMAIL - Obtener usuario por email
  async findByEmail(email: string): Promise<Omit<Usuario, 'password_hash'> | null> {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { email },
    });

    if (!usuario) return null;

    const { password_hash, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // UPDATE - Actualizar usuario
  async update(id_usuario: number, data: UpdateUsuarioDto): Promise<Omit<Usuario, 'password_hash'>> {
    // Verificar que el usuario existe
    await this.findOne(id_usuario);

    // Si viene nueva contraseña, hashearla
    let password_hash: string | undefined;
    if (data.password) {
      password_hash = await bcrypt.hash(data.password, 10);
    }

    // Evitar que se modifique la PK
    const { password, ...rest } = data;

    const usuario = await this.prisma.usuarios.update({
      where: { id_usuario },
      data: {
        ...rest,
        ...(password_hash && { password_hash }),
      },
    });

    const { password_hash: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // DELETE - Eliminar usuario (soft delete: cambiar estado)
  async remove(id_usuario: number): Promise<Omit<Usuario, 'password_hash'>> {
    await this.findOne(id_usuario);

    const usuario = await this.prisma.usuarios.update({
      where: { id_usuario },
      data: { estado: 'inactivo' },
    });

    const { password_hash, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // DELETE HARD - Eliminar usuario físicamente
  async removeHard(id_usuario: number): Promise<Omit<Usuario, 'password_hash'>> {
    await this.findOne(id_usuario);

    const usuario = await this.prisma.usuarios.delete({
      where: { id_usuario },
    });

    const { password_hash, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // BUSCAR por rol
  async findByRol(rol: 'admin' | 'vendedor'): Promise<Omit<Usuario, 'password_hash'>[]> {
    const usuarios = await this.prisma.usuarios.findMany({
      where: { rol },
    });

    return usuarios.map(({ password_hash, ...usuario }) => usuario);
  }

  // BUSCAR por estado
  async findByEstado(estado: 'activo' | 'inactivo' | 'suspendido'): Promise<Omit<Usuario, 'password_hash'>[]> {
    const usuarios = await this.prisma.usuarios.findMany({
      where: { estado },
    });

    return usuarios.map(({ password_hash, ...usuario }) => usuario);
  }

  // ACTUALIZAR última conexión
  async updateUltimaConexion(id_usuario: number): Promise<void> {
    await this.prisma.usuarios.update({
      where: { id_usuario },
      data: { ultima_conexion: new Date() },
    });
  }

  // VERIFICAR contraseña
  async verificarPassword(password: string, password_hash: string): Promise<boolean> {
    return bcrypt.compare(password, password_hash);
  }
}