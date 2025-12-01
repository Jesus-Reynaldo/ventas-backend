export interface UsuarioI {
    id_usuario: number;
    nombre_usuario: string;
    password_hash: string;
    nombre_completo: string;
    email: string;
    telefono?: string;
    rol: 'admin' | 'vendedor';
    estado: 'activo' | 'inactivo' | 'suspendido';
    fecha_creacion?: Date;
    ultima_conexion?: Date;
}

export interface CreateUsuarioDto {
    nombre_usuario: string;
    password: string; // Sin hashear
    nombre_completo: string;
    email: string;
    telefono?: string;
    rol?: 'admin' | 'vendedor';
    estado?: 'activo' | 'inactivo' | 'suspendido';
}

export interface UpdateUsuarioDto {
    nombre_usuario?: string;
    password?: string; // Sin hashear
    nombre_completo?: string;
    email?: string;
    telefono?: string;
    rol?: 'admin' | 'vendedor';
    estado?: 'activo' | 'inactivo' | 'suspendido';
}