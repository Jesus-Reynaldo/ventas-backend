import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usuarioService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_cambiala_en_produccion',
    });
  }

  /**
   * Valida el payload del JWT y retorna el usuario
   * Este método se ejecuta automáticamente cuando se usa @UseGuards(AuthGuard('jwt'))
   */
  async validate(payload: any) {
    const usuario = await this.usuarioService.findOne(payload.sub);

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (usuario.estado !== 'activo') {
      throw new UnauthorizedException('Usuario inactivo');
    }

    // Esto se agregará a req.user en los controllers protegidos
    return {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      rol: usuario.rol,
      email: usuario.email,
    };
  }
}