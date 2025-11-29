// src/inventario/pdf.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
const PDFDocument = require('pdfkit');

@Injectable()
export class PdfService {
  generateInventoryPDF(data: any[], res: Response) {
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      bufferPages: true
    });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventario.pdf');

    // Pipe del PDF a la respuesta
    doc.pipe(res);

    // === ENCABEZADO ===
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text('TIENDA DE CALZADOS IVETH', { align: 'center' });
    
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('REPORTE DE INVENTARIO', { align: 'center' });
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Fecha: ${new Date().toLocaleDateString('es-BO', { 
         year: 'numeric', 
         month: 'long', 
         day: 'numeric' 
       })}`, { align: 'center' });
    
    doc.moveDown(2);

    // === ESTADÍSTICAS GENERALES ===
    const totalProductos = data.length;
    const stockBajo = data.filter(item => 
      item.stock_actual > 0 && item.stock_actual <= item.stock_minimo
    ).length;
    const sinStock = data.filter(item => item.stock_actual === 0).length;
    const valorTotal = data.reduce((sum, item) => {
      const precio = item.productos ? parseFloat(item.productos.precio_actual || 0) : 0;
      return sum + (item.stock_actual * precio);
    }, 0);

    // Cuadro de estadísticas
    const statsY = doc.y;
    doc.fontSize(9)
       .font('Helvetica-Bold');

    // Cuadros de estadísticas
    const boxWidth = 120;
    const boxHeight = 50;
    const spacing = 10;
    let xPos = 50;

    // Total Productos
    doc.rect(xPos, statsY, boxWidth, boxHeight).stroke();
    doc.fillColor('#4F46E5')
       .fontSize(10)
       .text('Total Productos', xPos + 10, statsY + 10, { width: boxWidth - 20 });
    doc.fillColor('#000')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text(totalProductos.toString(), xPos + 10, statsY + 28, { width: boxWidth - 20 });

    xPos += boxWidth + spacing;

    // Stock Bajo
    doc.rect(xPos, statsY, boxWidth, boxHeight).stroke();
    doc.fillColor('#F59E0B')
       .fontSize(10)
       .font('Helvetica-Bold')
       .text('Stock Bajo', xPos + 10, statsY + 10, { width: boxWidth - 20 });
    doc.fillColor('#000')
       .fontSize(20)
       .text(stockBajo.toString(), xPos + 10, statsY + 28, { width: boxWidth - 20 });

    xPos += boxWidth + spacing;

    // Sin Stock
    doc.rect(xPos, statsY, boxWidth, boxHeight).stroke();
    doc.fillColor('#EF4444')
       .fontSize(10)
       .text('Sin Stock', xPos + 10, statsY + 10, { width: boxWidth - 20 });
    doc.fillColor('#000')
       .fontSize(20)
       .text(sinStock.toString(), xPos + 10, statsY + 28, { width: boxWidth - 20 });

    xPos += boxWidth + spacing;

    // Valor Total
    doc.rect(xPos, statsY, boxWidth, boxHeight).stroke();
    doc.fillColor('#10B981')
       .fontSize(10)
       .text('Valor Total', xPos + 10, statsY + 10, { width: boxWidth - 20 });
    doc.fillColor('#000')
       .fontSize(16)
       .text(`Bs. ${valorTotal.toFixed(2)}`, xPos + 10, statsY + 28, { width: boxWidth - 20 });

    doc.moveDown(4);

    // === TABLA DE INVENTARIO ===
    const tableTop = doc.y + 20;
    const colWidths = [40, 70, 100, 60, 60, 50, 50, 65];
    const headers = ['SKU', 'Marca', 'Modelo', 'Medida', 'Color', 'Precio', 'Stock', 'Estado'];

    // Encabezados de tabla
    doc.fillColor('#4F46E5')
       .rect(50, tableTop, 545, 25)
       .fill();

    doc.fillColor('#FFF')
       .fontSize(9)
       .font('Helvetica-Bold');

    let xPosition = 50;
    headers.forEach((header, i) => {
      doc.text(header, xPosition + 5, tableTop + 8, {
        width: colWidths[i] - 10,
        align: 'left'
      });
      xPosition += colWidths[i];
    });

    // Filas de datos
    doc.fillColor('#000');
    let yPosition = tableTop + 25;
    const rowHeight = 30;
    let isAlternate = false;

    data.forEach((item, index) => {
      const producto = item.productos;
      
      if (!producto) return;

      // Verificar si necesitamos una nueva página
      if (yPosition > 720) {
        doc.addPage();
        yPosition = 50;
        isAlternate = false;
      }

      // Fondo alternado
      if (isAlternate) {
        doc.fillColor('#F9FAFB')
           .rect(50, yPosition, 545, rowHeight)
           .fill();
      }

      // Contenido de la fila
      doc.fillColor('#000')
         .fontSize(8)
         .font('Helvetica');

      xPosition = 50;

      // SKU
      doc.text(producto.codigo_sku || 'N/A', xPosition + 5, yPosition + 10, {
        width: colWidths[0] - 10,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[0];

      // Marca
      doc.text(producto.marca || '-', xPosition + 5, yPosition + 10, {
        width: colWidths[1] - 10,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[1];

      // Modelo
      doc.text(producto.modelo || '-', xPosition + 5, yPosition + 10, {
        width: colWidths[2] - 10,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[2];

      // Medida
      doc.text(producto.medida || '-', xPosition + 5, yPosition + 10, {
        width: colWidths[3] - 10,
        height: rowHeight - 10
      });
      xPosition += colWidths[3];

      // Color
      doc.text(producto.color || '-', xPosition + 5, yPosition + 10, {
        width: colWidths[4] - 10,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[4];

      // Precio
      doc.text(`Bs. ${parseFloat(producto.precio_actual || 0).toFixed(2)}`, xPosition + 5, yPosition + 10, {
        width: colWidths[5] - 10,
        height: rowHeight - 10
      });
      xPosition += colWidths[5];

      // Stock
      const stockStatus = this.getStockStatus(item.stock_actual, item.stock_minimo);
      const stockColor = this.getStockColor(stockStatus);
      
      doc.fillColor(stockColor)
         .font('Helvetica-Bold')
         .text(item.stock_actual.toString(), xPosition + 5, yPosition + 10, {
           width: colWidths[6] - 10,
           height: rowHeight - 10
         });
      xPosition += colWidths[6];

      // Estado
      doc.fillColor(stockColor)
         .fontSize(7)
         .text(stockStatus, xPosition + 5, yPosition + 10, {
           width: colWidths[7] - 10,
           height: rowHeight - 10
         });

      // Línea divisoria
      doc.strokeColor('#E5E7EB')
         .moveTo(50, yPosition + rowHeight)
         .lineTo(595, yPosition + rowHeight)
         .stroke();

      yPosition += rowHeight;
      isAlternate = !isAlternate;
    });

    // === PIE DE PÁGINA ===
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      doc.fontSize(8)
         .fillColor('#6B7280')
         .text(
           `Página ${i + 1} de ${pageCount}`,
           50,
           doc.page.height - 50,
           { align: 'center' }
         );
      
      doc.text(
        'Tienda de Calzados Iveth - Sistema de Gestión de Inventario',
        50,
        doc.page.height - 35,
        { align: 'center' }
      );
    }

    // Finalizar el documento
    doc.end();
  }

  private getStockStatus(stockActual: number, stockMinimo: number): string {
    if (stockActual === 0) return 'Agotado';
    if (stockActual <= stockMinimo) return 'Bajo';
    if (stockActual <= stockMinimo * 2) return 'Medio';
    return 'Disponible';
  }

  private getStockColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Agotado': '#6B7280',
      'Bajo': '#DC2626',
      'Medio': '#D97706',
      'Disponible': '#059669'
    };
    return colors[status] || '#000000';
  }
}