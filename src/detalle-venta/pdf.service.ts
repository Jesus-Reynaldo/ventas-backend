// src/detalle-venta/pdf.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
const PDFDocument = require('pdfkit');

@Injectable()
export class PdfService {
  generateDetalleVentaPDF(data: any[], res: Response) {
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 30,
      bufferPages: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=detalle-ventas.pdf');
    doc.pipe(res);

    // === ENCABEZADO PROFESIONAL ===
    // Fondo azul
    doc.fillColor('#0f172a')
       .rect(0, 0, 612, 90)
       .fill();

    // Logo/Nombre empresa
    doc.fontSize(28)
       .font('Helvetica-Bold')
       .fillColor('#ffffff')
       .text('IVETH', 40, 15);
    
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#cbd5e1')
       .text('Tienda de Calzados', 40, 48);

    // Título reporte
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#f1f5f9')
       .text('REPORTE DE VENTAS', 30, 30, { align: 'center', width: 552 });

    const now = new Date();
    const fecha = now.toLocaleDateString('es-BO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    const hora = now.toLocaleTimeString('es-BO', { 
      hour: '2-digit',
      minute: '2-digit'
    });

    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#cbd5e1')
       .text(`Fecha: ${fecha}`, 400, 48, { align: 'right' });

    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#cbd5e1')
       .text(`Hora: ${hora}`, 400, 62, { align: 'right' });

    // === ESTADÍSTICAS EN TARJETAS ===
    const totalVentas = data.length;
    const montoTotal = data.reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0);
    const cantidadTotal = data.reduce((sum, item) => sum + item.cantidad, 0);

    const statsY = 110;
    const statBoxWidth = 165;
    const statBoxHeight = 55;
    const statSpacing = 10;
    let statXPos = 35;

    const stats = [
      { label: 'Registros', value: totalVentas.toString(), color: '#3b82f6', bgColor: '#eff6ff' },
      { label: 'Cantidad Total de Productos ', value: cantidadTotal.toString(), color: '#10b981', bgColor: '#f0fdf4' },
      { label: 'Monto Total', value: `Bs. ${montoTotal.toFixed(2)}`, color: '#f59e0b', bgColor: '#fffbeb' }
    ];

    stats.forEach((stat) => {
      // Fondo tarjeta
      doc.fillColor(stat.bgColor)
         .rect(statXPos, statsY, statBoxWidth, statBoxHeight)
         .fill();

      // Borde
      doc.strokeColor(stat.color)
         .lineWidth(2)
         .rect(statXPos, statsY, statBoxWidth, statBoxHeight)
         .stroke();

      // Texto
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#6b7280')
         .text(stat.label, statXPos + 10, statsY + 10, { width: statBoxWidth - 20 });

      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor(stat.color)
         .text(stat.value, statXPos + 10, statsY + 26, { width: statBoxWidth - 20 });

      statXPos += statBoxWidth + statSpacing;
    });

    // === TABLA DE DATOS ===
    const tableTop = statsY + statBoxHeight + 30;
    const colWidths = [130, 130, 70, 95, 110];
    const headers = ['Producto', 'Cliente', 'Cantidad', 'Precio Unit.', 'Subtotal'];
    const totalWidth = colWidths.reduce((a, b) => a + b);
    const rowHeight = 22;
    const maxRowsPerPage = 16;

    // Encabezado tabla
    doc.fillColor('#1e293b')
       .rect(30, tableTop, totalWidth, 35)
       .fill();

    doc.fillColor('#ffffff')
       .fontSize(10)
       .font('Helvetica-Bold');

    let xPosition = 30;
    headers.forEach((header, i) => {
      doc.text(header, xPosition + 10, tableTop + 12, {
        width: colWidths[i] - 20,
        align: i >= 2 ? 'center' : 'left'
      });
      xPosition += colWidths[i];
    });

    // Filas de datos
    let yPosition = tableTop + 35;
    let isAlternate = false;
    let rowCount = 0;

    data.forEach((item) => {
      if (rowCount >= maxRowsPerPage) {
        // Nueva página
        doc.addPage();
        yPosition = 30;
        isAlternate = false;
        rowCount = 0;

        // Repetir encabezado
        doc.fillColor('#1e293b')
           .rect(30, yPosition, totalWidth, 35)
           .fill();

        doc.fillColor('#ffffff')
           .fontSize(10)
           .font('Helvetica-Bold');

        xPosition = 30;
        headers.forEach((header, i) => {
          doc.text(header, xPosition + 10, yPosition + 12, {
            width: colWidths[i] - 20,
            align: i >= 2 ? 'center' : 'left'
          });
          xPosition += colWidths[i];
        });

        yPosition += 35;
      }

      // Fondo alternado
      if (isAlternate) {
        doc.fillColor('#f8fafc')
           .rect(30, yPosition, totalWidth, rowHeight)
           .fill();
      } else {
        doc.fillColor('#ffffff')
           .rect(30, yPosition, totalWidth, rowHeight)
           .fill();
      }

      // Borde
      doc.strokeColor('#e2e8f0')
         .lineWidth(0.5)
         .rect(30, yPosition, totalWidth, rowHeight)
         .stroke();

      doc.fillColor('#1f2937')
         .fontSize(9)
         .font('Helvetica');

      xPosition = 30;

      // Producto
      doc.text(item.productos?.modelo || '-', xPosition + 10, yPosition + 7, {
        width: colWidths[0] - 20,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[0];

      // Cliente
      doc.text(item.ventas?.clientes?.nombre || '-', xPosition + 10, yPosition + 7, {
        width: colWidths[1] - 20,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[1];

      // Cantidad
      doc.text(item.cantidad.toString(), xPosition + 10, yPosition + 7, {
        width: colWidths[2] - 20,
        align: 'center'
      });
      xPosition += colWidths[2];

      // Precio Unitario
      doc.text(`Bs. ${parseFloat(item.precio_unitario).toFixed(2)}`, xPosition + 10, yPosition + 7, {
        width: colWidths[3] - 20,
        align: 'right'
      });
      xPosition += colWidths[3];

      // Subtotal
      doc.fillColor('#dc2626')
         .font('Helvetica-Bold')
         .text(`Bs. ${parseFloat(item.subtotal).toFixed(2)}`, xPosition + 10, yPosition + 7, {
           width: colWidths[4] - 20,
           align: 'right'
         });

      yPosition += rowHeight;
      isAlternate = !isAlternate;
      rowCount++;
    });

    doc.end();
  }
}