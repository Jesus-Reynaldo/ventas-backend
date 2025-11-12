import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuarioService {
    constructor(private readonly prisma: PrismaService) {}
    async mostarUsuarios() {
        const usuarios = await this.prisma.usuario.findMany();
        return usuarios;
    }
}
