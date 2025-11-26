import { Decimal } from "@prisma/client/runtime/library";

export interface ProductoI {
    id_producto: number;
    codigo_sku?: string;
    marca: string;
    modelo: string;
    color?: string;
    talla: string;
    precio_actual: Decimal;
    descripcion?: string;
}
