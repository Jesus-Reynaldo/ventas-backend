import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Endpoint para iniciar sesión
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * GET /auth/verify
   * Verifica si el token es válido
   */
  @Get('verify')
  async verify(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    // Extraer el token del header "Bearer TOKEN"
    const token = authorization.replace('Bearer ', '');
    
    return this.authService.validateToken(token);
  }

  /**
   * GET /auth/profile
   * Obtiene el perfil del usuario autenticado
   */
  @Get('profile')
  async getProfile(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    const token = authorization.replace('Bearer ', '');
    return this.authService.validateToken(token);
  }
}