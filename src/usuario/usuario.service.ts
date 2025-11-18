// usuario.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { usuario } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  // CREATE - Registrar usuario
  async create(data: any): Promise<any> {
    // Verificar si el email ya existe
    const existeEmail = await this.prisma.usuario.findFirst({
      where: { email: data.email },
    });

    if (existeEmail) {
      throw new HttpException('El email ya está registrado', HttpStatus.BAD_REQUEST);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const usuario = await this.prisma.usuario.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // No devolver la contraseña
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // READ ALL - Obtener todos (sin mostrar password)
  async findAll(): Promise<any[]> {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios.map(({ password, ...usuario }) => usuario);
  }

  // READ ONE - Obtener uno por ID (sin password)
  async findOne(id: number): Promise<any> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });
    
    if (!usuario) return null;
    
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // READ BY EMAIL - Para login
  async findByEmail(email: string): Promise<usuario | null> {
    return this.prisma.usuario.findFirst({
      where: { email },
    });
  }

  // READ BY ROLE - Buscar por rol
  async findByRole(role: string): Promise<any[]> {
    const usuarios = await this.prisma.usuario.findMany({
      where: { role },
    });
    
    return usuarios.map(({ password, ...usuario }) => usuario);
  }

  // LOGIN - Validar credenciales con email O nombre
  async login(identificador: string, password: string): Promise<any> {
    // Buscar por email O nombre
    const usuario = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { email: identificador },
          { nombre: identificador }
        ]
      }
    });
    
    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!usuario.password) {
      throw new HttpException('Error de autenticación', HttpStatus.UNAUTHORIZED);
    }
    
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED);
    }
    
    // No devolver la contraseña
    const { password: _, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // UPDATE - Actualizar usuario
  async update(id: number, data: any): Promise<any> {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data,
    });
    
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  // UPDATE PASSWORD - Cambiar contraseña
  async updatePassword(id: number, passwordActual: string, passwordNueva: string): Promise<any> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });
    
    if (!usuario) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!usuario.password) {
      throw new HttpException('Error de autenticación', HttpStatus.UNAUTHORIZED);
    }
    
    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(passwordActual, usuario.password);
    
    if (!passwordValida) {
      throw new HttpException('Contraseña actual incorrecta', HttpStatus.UNAUTHORIZED);
    }
    
    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(passwordNueva, 10);
    
    await this.prisma.usuario.update({
      where: { id },
      data: { password: hashedPassword },
    });
    
    return { mensaje: 'Contraseña actualizada correctamente' };
  }

  // DELETE - Eliminar usuario
  async remove(id: number): Promise<any> {
    const usuario = await this.prisma.usuario.delete({
      where: { id },
    });
    
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }
}