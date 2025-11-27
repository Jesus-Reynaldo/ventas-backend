export interface ProductosI {
  id_producto: number;
  codigo_sku?: string | null;
  marca: string;
  modelo: string;
  categoria?: string | null;
  color?: string | null;
  medida: string; 
  precio_actual: number;
  descripcion?: string | null;
  imagen?: string | null; 
}


export interface InventarioI {
	id_inventario?: number;
	id_producto: number;
	stock_actual?: number | null;
	stock_minimo?: number | null;
	ultima_actualizacion: Date | string | null;
	productos?: ProductosI | null;
}

export interface CreateInventarioI {
	id_producto: number;
	stock_actual?: number;
	stock_minimo?: number;
}

export interface UpdateInventarioI {
	stock_actual?: number;
	stock_minimo?: number;
}