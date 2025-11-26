import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DetalleVentaI } from './interface/detalleVenta.interface';

@Injectable()
export class DetalleVentaService {
    constructor(private prisma: PrismaService) {}
    async crearDetalleVenta(detalleVenta: DetalleVentaI) {
        const nuevoDetalleVenta = await this.prisma.detalle_venta.create({data: detalleVenta});
        return nuevoDetalleVenta
    }
    

    async mostrarDetalleVenta() {
        const detalleVenta = await this.prisma.detalle_venta.findMany();
        return detalleVenta 
    }

    async mostrarDetalleVentaPorId(id: number) {
        const detalleVenta = await this.prisma.detalle_venta.findUnique({where: {id_detalle: id}});
        return detalleVenta
    }

    async mostrarDetalleVentaPorVentaId(id: number) {
        const detalleVenta = await this.prisma.detalle_venta.findMany({where: {id_venta: id}});
        return detalleVenta
    }

    async mostrarDetalleVentaPorProductoId(id: number) {
        const detalleVenta = await this.prisma.detalle_venta.findMany({where: {id_producto: id}});
        return detalleVenta
    }

    async mostrarDetalleVentaPorClienteIdCompleto(ci: number) {
        return await this.prisma.detalle_venta.findMany({
            where: {
                ventas: {
                    ci: ci
                }
            },
            include: {
                productos: true,
                ventas: {
                    include: {
                        clientes: true
                    }
                }
            }
        });
    }

    async mostrarDetalleVentaPorClienteId(ci: number) {
        const detalleVenta = await this.prisma.detalle_venta.findMany({
            where: {
                ventas: {
                    ci: ci
                }
            },
            include: {
                productos: true,
                ventas: {
                    include: {
                        clientes: true
                    }
                }
            }
        });

        return detalleVenta.map(detalle => ({
            cliente: detalle.ventas.clientes?.nombre,
            producto: detalle.productos.modelo,
            cantidad: detalle.cantidad,
            subtotal: detalle.subtotal
        }));
    }

    async mostrarDetalleVentaPorPrecioUnitario(precioUnitario: number) {
        const detalleVenta = await this.prisma.detalle_venta.findMany({where: {precio_unitario: precioUnitario}});
        return detalleVenta
    }
    

    async actualizarDetalleVenta(id: number, detalleVenta: DetalleVentaI) {
        const detalleVentaActualizado = await this.prisma.detalle_venta.update({where: {id_detalle: id}, data: detalleVenta});
        return detalleVentaActualizado
    }

    async eliminarDetalleVenta(id: number) {
        const detalleVentaEliminado = await this.prisma.detalle_venta.delete({where: {id_detalle: id}});
        return detalleVentaEliminado
    }
}

