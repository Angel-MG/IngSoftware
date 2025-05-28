import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatearFecha } from './formatoFecha.js';

export async function generarPDFReporte(datosReporte) {
  const doc = new jsPDF();

  // Configuración de estilos
  doc.setFont('helvetica');
  doc.setFontSize(20);

  // Título
  doc.text('Reporte de Ventas', 105, 20, { align: 'center' });
  
  // Información del período
  doc.setFontSize(12);
  doc.text(`Período: ${formatearFecha(datosReporte.fechaInicio)} - ${formatearFecha(datosReporte.fechaFin)}`, 20, 35);
  
  // Resumen
  doc.text(`Total de Ventas: $${datosReporte.totalVentas.toFixed(2)}`, 20, 45);
  doc.text(`Cantidad de Pedidos: ${datosReporte.cantidadPedidos}`, 20, 55);

  // Tabla de pedidos
  const headers = [['ID', 'Cliente', 'Productos', 'Total', 'Fecha']];
  const data = datosReporte.pedidos.map(pedido => [
    pedido.id,
    pedido.nombreCliente,
    pedido.productos.map(p => `${p.cantidad}x ${p.nombre}`).join('\n'),
    `$${pedido.total.toFixed(2)}`,
    formatearFecha(pedido.fechaCreacion)
  ]);

  doc.autoTable({
    startY: 65,
    head: headers,
    body: data,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 60 },
      3: { cellWidth: 30 },
      4: { cellWidth: 40 }
    }
  });

  return doc.output('blob');
}