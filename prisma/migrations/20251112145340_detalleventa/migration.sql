-- CreateTable
CREATE TABLE `cliente` (
    `CI` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NULL,
    `telefono` VARCHAR(20) NULL,
    `fechaRegistro` DATETIME(0) NULL,

    PRIMARY KEY (`CI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalleventa` (
    `idDetalle` INTEGER NOT NULL AUTO_INCREMENT,
    `idVenta` INTEGER NULL,
    `item` INTEGER NULL,
    `cantidad` INTEGER NULL,
    `precioUnitario` DECIMAL(10, 2) NULL,
    `subtotal` DECIMAL(10, 2) NULL,

    INDEX `idVenta`(`idVenta`),
    INDEX `item`(`item`),
    PRIMARY KEY (`idDetalle`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventario` (
    `idInventario` INTEGER NOT NULL,
    `item` INTEGER NULL,
    `cantidad` INTEGER NULL,
    `fechaActualizacion` DATETIME(0) NULL,

    INDEX `item`(`item`),
    PRIMARY KEY (`idInventario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metodopago` (
    `idPago` INTEGER NOT NULL,
    `tipo` VARCHAR(50) NULL,
    `monto` DECIMAL(10, 2) NULL,
    `fecha` DATETIME(0) NULL,

    PRIMARY KEY (`idPago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `producto` (
    `item` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(10, 2) NULL,
    `categoria` VARCHAR(50) NULL,
    `modelo` VARCHAR(50) NULL,
    `fechaRegistro` DATETIME(0) NULL,
    `imagen` VARCHAR(255) NULL,
    `idUsuario` INTEGER NULL,

    INDEX `idUsuario`(`idUsuario`),
    PRIMARY KEY (`item`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recibo` (
    `numeroRecibo` INTEGER NOT NULL,
    `fechaRecibo` DATETIME(0) NULL,
    `proveedor` VARCHAR(100) NULL,
    `cantidad` INTEGER NULL,
    `precio` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,
    `categoria` VARCHAR(50) NULL,
    `item` INTEGER NULL,
    `idInventario` INTEGER NULL,
    `idUsuario` INTEGER NULL,

    INDEX `idInventario`(`idInventario`),
    INDEX `idUsuario`(`idUsuario`),
    INDEX `item`(`item`),
    PRIMARY KEY (`numeroRecibo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporte` (
    `idReporte` INTEGER NOT NULL,
    `tipoReporte` VARCHAR(50) NULL,
    `fechaGeneracion` DATETIME(0) NULL,
    `rutaArchivo` VARCHAR(255) NULL,
    `idInventario` INTEGER NULL,
    `idVenta` INTEGER NULL,
    `idUsuario` INTEGER NULL,

    INDEX `idInventario`(`idInventario`),
    INDEX `idVenta`(`idVenta`),
    INDEX `reporte_ibfk_3_idx`(`idUsuario`),
    PRIMARY KEY (`idReporte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(100) NULL,
    `email` VARCHAR(100) NULL,
    `password` VARCHAR(100) NULL,
    `telefono` VARCHAR(20) NULL,
    `role` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `venta` (
    `idVenta` INTEGER NOT NULL,
    `fecha` DATETIME(0) NULL,
    `totalVenta` DECIMAL(10, 2) NULL,
    `metodoPago` VARCHAR(50) NULL,
    `cantidadProductos` INTEGER NULL,
    `idPago` INTEGER NULL,
    `CI` INTEGER NULL,
    `idUsuario` INTEGER NULL,

    INDEX `CI`(`CI`),
    INDEX `idPago`(`idPago`),
    INDEX `venta_ibfk_3_idx`(`idUsuario`),
    PRIMARY KEY (`idVenta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detalleventa` ADD CONSTRAINT `detalleventa_ibfk_1` FOREIGN KEY (`idVenta`) REFERENCES `venta`(`idVenta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `detalleventa` ADD CONSTRAINT `detalleventa_ibfk_2` FOREIGN KEY (`item`) REFERENCES `producto`(`item`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inventario` ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`item`) REFERENCES `producto`(`item`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `producto` ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recibo` ADD CONSTRAINT `recibo_ibfk_1` FOREIGN KEY (`item`) REFERENCES `producto`(`item`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recibo` ADD CONSTRAINT `recibo_ibfk_2` FOREIGN KEY (`idInventario`) REFERENCES `inventario`(`idInventario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recibo` ADD CONSTRAINT `recibo_ibfk_3` FOREIGN KEY (`idUsuario`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporte` ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`idInventario`) REFERENCES `inventario`(`idInventario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporte` ADD CONSTRAINT `reporte_ibfk_2` FOREIGN KEY (`idVenta`) REFERENCES `venta`(`idVenta`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporte` ADD CONSTRAINT `reporte_ibfk_3` FOREIGN KEY (`idUsuario`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`idPago`) REFERENCES `metodopago`(`idPago`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`CI`) REFERENCES `cliente`(`CI`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `venta` ADD CONSTRAINT `venta_ibfk_3` FOREIGN KEY (`idUsuario`) REFERENCES `usuario`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
