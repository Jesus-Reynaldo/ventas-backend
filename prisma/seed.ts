import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  // Hashear la contraseña del admin
  const passwordHash = await bcrypt.hash('admin123', 10);

  // Crear usuario admin
  const admin = await prisma.usuarios.upsert({
    where: { nombre_usuario: 'admin' },
    update: {},
    create: {
      nombre_usuario: 'admin',
      password_hash: passwordHash,
      nombre_completo: 'Administrador Principal',
      email: 'admin@tienda.com',
      telefono: '555-0000',
      rol: 'admin',
      estado: 'activo',
    },
  });

  console.log('✅ Usuario admin creado:', {
    id: admin.id_usuario,
    usuario: admin.nombre_usuario,
    email: admin.email,
    rol: admin.rol,
  });

  console.log('\n📋 Credenciales de acceso:');
  console.log('   Usuario: admin');
  console.log('   Contraseña: admin123');
  console.log('\n⚠️  Recuerda cambiar esta contraseña en producción!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });