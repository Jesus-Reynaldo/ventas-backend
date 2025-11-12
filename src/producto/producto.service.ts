import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductoService {
    constructor(private readonly prisma: PrismaService) {}
    async mostarProductos() {
        const productos = await this.prisma.producto.findMany();
        return productos;
    }
}
