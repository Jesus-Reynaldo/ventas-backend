import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Asegúrate de tener tu PrismaService configurado

@Injectable()
export class VentasService {
  constructor(private prisma: PrismaService) {}

  // Obtener todas las ventas con cliente y detalle
  async getAllVentas() {
    return this.prisma.ventas.findMany({
      include: {
        clientes: true,
        detalle_venta: {
          include: {
            productos: true,
          },
        },
      },
    });
  }

  // Obtener una venta específica
  async getVentaById(id_venta: number) {
    return this.prisma.ventas.findUnique({
      where: { id_venta },
      include: {
        clientes: true,
        detalle_venta: {
          include: {
            productos: true,
          },
        },
      },
    });
  }

  // Crear una nueva venta con detalles
  async createVenta(data: any) {
    const { ci, metodo_pago, detalle } = data;

    const detalleArray = Array.isArray(detalle) ? detalle : undefined;

    if (!detalleArray || detalleArray.length === 0) {
      throw new BadRequestException('El campo "detalle" es obligatorio y debe ser un arreglo no vacío.');
    }

    // Calcular total
    const total = detalleArray.reduce(
      (acc, item) => acc + Number(item.cantidad) * Number(item.precio_unitario),
      0,
    );
    // Validar existencia de cliente si se proporcionó CI
    if (ci !== undefined && ci !== null) {
      const cliente = await this.prisma.clientes.findUnique({ where: { ci: Number(ci) } });
      if (!cliente) {
        throw new BadRequestException(`No existe un cliente con CI=${ci}`);
      }
    }

    // Validar existencia de cada producto referenciado
    for (const item of detalleArray) {
      const prodId = Number(item.id_producto);
      const producto = await this.prisma.productos.findUnique({ where: { id_producto: prodId } });
      if (!producto) {
        throw new BadRequestException(`No existe el producto con id_producto=${prodId}`);
      }
    }

    // Crear venta y detalles dentro de una transacción
    const created = await this.prisma.$transaction(async (prisma) => {
      const venta = await prisma.ventas.create({
        data: {
          ci: ci !== undefined && ci !== null ? Number(ci) : undefined,
          metodo_pago,
          total,
        },
      });

      const detalles = detalleArray.map((item) => ({
        id_venta: venta.id_venta,
        id_producto: Number(item.id_producto),
        cantidad: Number(item.cantidad),
        precio_unitario: Number(item.precio_unitario),
        subtotal: Number(item.cantidad) * Number(item.precio_unitario),
      }));

      await prisma.detalle_venta.createMany({ data: detalles });

      return prisma.ventas.findUnique({
        where: { id_venta: venta.id_venta },
        include: { detalle_venta: true },
      });
    });

    return created;
  }

  // Adapter methods expected by controller
  async create(data: any) {
    return this.createVenta(data);
  }

  async findAll() {
    return this.getAllVentas();
  }

  async findOne(id: number) {
    return this.getVentaById(id);
  }

  async update(id: number, data: any) {
    // allow updating basic venta fields only (no detalle management here)
    const updateData: any = {};
    if (data.ci !== undefined) updateData.ci = Number(data.ci);
    if (data.metodo_pago !== undefined) updateData.metodo_pago = data.metodo_pago;
    if (data.total !== undefined) updateData.total = Number(data.total);

    return this.prisma.ventas.update({
      where: { id_venta: Number(id) },
      data: updateData,
      include: { detalle_venta: true },
    });
  }

  async delete(id: number) {
    // First delete detalles to avoid FK constraints, then venta
    await this.prisma.detalle_venta.deleteMany({ where: { id_venta: Number(id) } });
    return this.prisma.ventas.delete({ where: { id_venta: Number(id) } });
  }
}
