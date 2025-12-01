import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuarios/usuarios.service';

export interface LoginDto {
  nombre_usuario: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: {
    id_usuario: number;
    nombre_usuario: string;
    nombre_completo: string;
    email: string;
    rol: string;
    estado: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales del usuario y retorna un JWT
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { nombre_usuario, password } = loginDto;

    // 1. Buscar usuario por nombre de usuario
    const usuario = await this.usuarioService.findByUsername(nombre_usuario);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Verificar si el usuario está activo
    if (usuario.estado !== 'activo') {
      throw new UnauthorizedException('Usuario inactivo o suspendido');
    }

    // 3. Verificar la contraseña
    const passwordValida = await this.usuarioService.verificarPassword(
      password,
      usuario.password_hash,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 4. Actualizar última conexión
    await this.usuarioService.updateUltimaConexion(usuario.id_usuario);

    // 5. Generar JWT
    const payload = {
      sub: usuario.id_usuario,
      username: usuario.nombre_usuario,
      rol: usuario.rol,
    };

    const access_token = this.jwtService.sign(payload);

    // 6. Retornar token y datos del usuario (sin password)
    const { password_hash, ...usuarioSinPassword } = usuario;

    return {
      access_token,
      usuario: usuarioSinPassword,
    };
  }

  /**
   * Valida el token JWT y retorna los datos del usuario
   */
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const usuario = await this.usuarioService.findOne(payload.sub);
      
      if (!usuario || usuario.estado !== 'activo') {
        throw new UnauthorizedException('Token inválido o usuario inactivo');
      }

      return usuario;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}