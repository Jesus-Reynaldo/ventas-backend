import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductoI } from './interfaces/producto.interface';

@Injectable()
export class ProductoService {
    constructor(private readonly prisma: PrismaService) {}
    async mostarProductos() {
        const productos = await this.prisma.producto.findMany();
        return productos;
    }

    async crearProducto(nuevoProducto: ProductoI) {
        const item = await this.prisma.producto.count() + 1;
        nuevoProducto.item = item;
        const productoCreado = await this.prisma.producto.create({
            data: { ...nuevoProducto },
        });
        return productoCreado;
    }
}


