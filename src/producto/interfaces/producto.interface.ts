import { Decimal } from "@prisma/client/runtime/library";

export interface ProductoI {
    item: number;
    nombre?: string;
    descripcion?: string;
    precio?: number | Decimal;
    categoria?: string;
    modelo?: string;
    fechaRegistro?: Date;
    imagen?: string;
    idUsuario?: number;
}

