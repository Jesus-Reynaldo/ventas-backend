import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');

@Injectable()
export class PdfService {
  generateInventoryPDF(data: any[], res: any) {
    const doc = new PDFDocument({ 
      size: 'LETTER',
      margin: 30,
      bufferPages: true
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=inventario.pdf');
    doc.pipe(res);

    // ENCABEZADO PROFESIONAL
    // Fondo azul oscuro
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
       .text('REPORTE DE INVENTARIO', 30, 30, { align: 'center', width: 552 });

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

    // ESTADÍSTICAS EN TARJETAS 
    const totalProductos = data.length;
    const stockBajo = data.filter(item => 
      item.stock_actual > 0 && item.stock_actual <= item.stock_minimo
    ).length;
    const sinStock = data.filter(item => item.stock_actual === 0).length;
    const valorTotal = data.reduce((sum, item) => {
      const precio = item.productos ? parseFloat(item.productos.precio_actual || 0) : 0;
      return sum + (item.stock_actual * precio);
    }, 0);

    const statsY = 110;
    const statBoxWidth = 130;
    const statBoxHeight = 55;
    const statSpacing = 8;
    let statXPos = 35;

    const stats = [
      { label: 'Total Productos', value: totalProductos.toString(), color: '#3b82f6', bgColor: '#eff6ff' },
      { label: 'Stock Bajo', value: stockBajo.toString(), color: '#f59e0b', bgColor: '#fffbeb' },
      { label: 'Sin Stock', value: sinStock.toString(), color: '#ef4444', bgColor: '#fef2f2' },
      { label: 'Valor Total', value: `Bs. ${valorTotal.toFixed(2)}`, color: '#10b981', bgColor: '#f0fdf4' }
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
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#6b7280')
         .text(stat.label, statXPos + 8, statsY + 10, { width: statBoxWidth - 16 });

      doc.fontSize(14)
         .font('Helvetica-Bold')
         .fillColor(stat.color)
         .text(stat.value, statXPos + 8, statsY + 26, { width: statBoxWidth - 16 });

      statXPos += statBoxWidth + statSpacing;
    });

    // === TABLA DE INVENTARIO ===
    const tableTop = statsY + statBoxHeight + 30;
    const colWidths = [80, 90, 70, 55, 50, 70, 55, 65];
    const headers = ['SKU', 'Marca/Modelo', 'Categoría', 'Medida', 'Color', 'Precio', 'Stock', 'Estado'];
    const totalWidth = colWidths.reduce((a, b) => a + b);
    const rowHeight = 24;

    // Encabezado tabla
    doc.fillColor('#1e293b')
       .rect(30, tableTop, totalWidth, 35)
       .fill();

    doc.fillColor('#ffffff')
       .fontSize(9)
       .font('Helvetica-Bold');

    let xPosition = 30;
    headers.forEach((header, i) => {
      doc.text(header, xPosition + 6, tableTop + 13, {
        width: colWidths[i] - 12,
        align: 'left'
      });
      xPosition += colWidths[i];
    });

    // Filas de datos
    let yPosition = tableTop + 35;
    let isAlternate = false;
    let currentPageNumber = 0;

    data.forEach((item) => {
      const producto = item.productos;
      if (!producto) return;

      // Verificar si necesitamos nueva página ANTES de dibujar
      if (yPosition + rowHeight > doc.page.height - 120) {
        // Agregar pie de página a la página actual antes de cambiar
        this.addFooter(doc, currentPageNumber + 1, 0); // Lo actualizaremos después
        
        // Nueva página
        doc.addPage();
        currentPageNumber++;
        yPosition = 30;
        isAlternate = false;

        // Repetir encabezado
        doc.fillColor('#1e293b')
           .rect(30, yPosition, totalWidth, 35)
           .fill();

        doc.fillColor('#ffffff')
           .fontSize(9)
           .font('Helvetica-Bold');

        xPosition = 30;
        headers.forEach((header, i) => {
          doc.text(header, xPosition + 6, yPosition + 13, {
            width: colWidths[i] - 12,
            align: 'left'
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
         .fontSize(8)
         .font('Helvetica');

      xPosition = 30;

      // SKU
      doc.text(producto.codigo_sku || 'N/A', xPosition + 6, yPosition + 8, {
        width: colWidths[0] - 12,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[0];

      // Marca/Modelo
      const marcaModelo = `${producto.marca || ''} ${producto.modelo || ''}`.trim();
      doc.text(marcaModelo || '-', xPosition + 6, yPosition + 8, {
        width: colWidths[1] - 12,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[1];

      // Categoría
      doc.text(producto.categoria || '-', xPosition + 6, yPosition + 8, {
        width: colWidths[2] - 12,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[2];

      // Medida
      doc.text(producto.medida || '-', xPosition + 6, yPosition + 8, {
        width: colWidths[3] - 12,
        align: 'center'
      });
      xPosition += colWidths[3];

      // Color
      doc.text(producto.color || '-', xPosition + 6, yPosition + 8, {
        width: colWidths[4] - 12,
        height: rowHeight - 10,
        ellipsis: true
      });
      xPosition += colWidths[4];

      // Precio
      doc.text(`${parseFloat(producto.precio_actual || 0).toFixed(2)}`, xPosition + 6, yPosition + 8, {
        width: colWidths[5] - 12,
        align: 'right'
      });
      xPosition += colWidths[5];

      // Stock
      const stockStatus = this.getStockStatus(item.stock_actual, item.stock_minimo);
      const stockColor = this.getStockColor(stockStatus);
      
      doc.fillColor(stockColor)
         .font('Helvetica-Bold')
         .text(item.stock_actual.toString(), xPosition + 6, yPosition + 8, {
           width: colWidths[6] - 12,
           align: 'center'
         });
      xPosition += colWidths[6];

      // Estado
      doc.fillColor(stockColor)
         .fontSize(7)
         .font('Helvetica-Bold')
         .text(stockStatus, xPosition + 6, yPosition + 9, {
           width: colWidths[7] - 12,
           align: 'center'
         });

      yPosition += rowHeight;
      isAlternate = !isAlternate;
    });

    // Agregar pie de página a todas las páginas con el total correcto
    const totalPages = currentPageNumber + 1;
    for (let i = 0; i <= currentPageNumber; i++) {
      doc.switchToPage(i);
      this.addFooter(doc, i + 1, totalPages);
    }

    doc.end();
  }

  private addFooter(doc: any, pageNum: number, totalPages: number) {
    const footerY = doc.page.height - 40;
    
    // Línea separadora
    doc.strokeColor('#e2e8f0')
       .lineWidth(1)
       .moveTo(30, footerY - 10)
       .lineTo(582, footerY - 10)
       .stroke();
    
    doc.fontSize(8)
       .fillColor('#6b7280')
       .font('Helvetica')
       .text(
         totalPages > 0 ? `Página ${pageNum} de ${totalPages}` : '',
         30,
         footerY,
         { align: 'center', width: 552 }
       );
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