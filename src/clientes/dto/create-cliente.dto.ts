export class CreateClienteDto {
  ci: number;
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}
