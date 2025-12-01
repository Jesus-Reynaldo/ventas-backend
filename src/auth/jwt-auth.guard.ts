import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para proteger rutas con JWT
 * Uso: @UseGuards(JwtAuthGuard) en el controller
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}