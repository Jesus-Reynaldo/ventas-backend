 # Productos API
 
 API de productos construida con NestJS y Prisma sobre MySQL.
 
 ## Stack
 - **Runtime**: Node.js
 - **Framework**: NestJS 11
 - **ORM**: Prisma 6
 - **Base de datos**: MySQL
 - **Testing**: Jest
 - **Lint/Format**: ESLint + Prettier
 
 ## Requisitos
 - Node.js 18+
 - MySQL 8+ accesible vía `DATABASE_URL`
 - npm o pnpm
 
 ## Configuración de entorno
 Crea un archivo `.env` en la raíz con las variables necesarias:
 
 ```env
 # Puerto del servidor
 PORT=3000
 
 # Conexión a MySQL (formato ejemplo)
 DATABASE_URL="mysql://usuario:password@localhost:3306/nombre_bd"
 ```
 
 El datasource está definido en `prisma/schema.prisma` con `provider = "mysql"`.
 
 ## Instalación
 
 ```bash
 npm install
 ```
 
 Genera el cliente de Prisma y aplica migraciones (si existen):
 
 ```bash
 npx prisma generate
 # Si tienes migraciones:
 npx prisma migrate deploy
 # Para desarrollo (crea una nueva migración si hay cambios en el schema):
 # npx prisma migrate dev --name init
 ```
 
 ## Scripts disponibles
 - `npm run start`: inicia la app
 - `npm run start:dev`: inicia en modo watch
 - `npm run start:prod`: ejecuta `dist/main`
 - `npm run build`: compila TypeScript
 - `npm run test`: corre pruebas unitarias
 - `npm run test:e2e`: corre pruebas e2e
 - `npm run lint`: lint con ESLint
 - `npm run format`: formato con Prettier
 
 ## Ejecución
 
 Desarrollo:
 
 ```bash
 npm run start:dev
 ```
 
 Producción (ejemplo):
 
 ```bash
 npm run build
 npm run start:prod
 ```
 
 La app arranca en `http://localhost:${PORT}` (por defecto `3000`).
 
 ## Endpoints principales
 - **GET `/producto`**: lista productos.
 
 Nota: Revisa los módulos y controladores en `src/` para más endpoints (`src/producto`, `src/usuario`).
 
 ## Estructura del proyecto (parcial)
 - `src/main.ts`: bootstrap del servidor Nest
 - `src/app.module.ts`: módulo raíz
 - `src/prisma/`: módulo y servicio Prisma (`PrismaService`)
 - `src/producto/`: módulo/controlador/servicio de productos
 - `src/usuario/`: módulo/controlador/servicio de usuarios
 - `prisma/schema.prisma`: modelos y datasource
 
 ## Prisma
 - Archivos: `prisma/schema.prisma`
 - Cliente: `@prisma/client`
 - Comandos útiles:
   - `npx prisma generate`
   - `npx prisma migrate dev --name <nombre>`
   - `npx prisma migrate deploy`
   - `npx prisma studio` (explorar BD)
 
 ## Pruebas
 
 ```bash
 npm run test
 npm run test:watch
 npm run test:cov
 ```
 
 ## Notas
 - Asegúrate de que `DATABASE_URL` apunte a una base MySQL válida antes de iniciar.
 - Si cambias el schema de Prisma, vuelve a generar el cliente con `npx prisma generate` y aplica migraciones.
 
