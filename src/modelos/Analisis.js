import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export class Analisis {
  static async obtenerConsumoIngredientes(fechaInicio, fechaFin) {
    try {
      const pedidosRef = collection(db, 'pedidos');
      const q = query(
        pedidosRef,
        where('fechaCreacion', '>=', fechaInicio),
        where('fechaCreacion', '<=', fechaFin),
        where('estado', '==', 'completed')
      );

      const querySnapshot = await getDocs(q);
      const consumoPorIngrediente = {};

      querySnapshot.forEach((doc) => {
        const pedido = doc.data();
        pedido.productos.forEach((producto) => {
          if (!consumoPorIngrediente[producto.id]) {
            consumoPorIngrediente[producto.id] = {
              nombre: producto.nombre,
              cantidad: 0
            };
          }
          consumoPorIngrediente[producto.id].cantidad += producto.cantidad;
        });
      });

      return Object.values(consumoPorIngrediente);
    } catch (error) {
      console.error('Error al obtener consumo:', error);
      throw error;
    }
  }

  static async predecirReabastecimiento(consumoHistorico) {
    // Implementar lógica de predicción basada en el consumo histórico
    const predicciones = consumoHistorico.map(item => {
      const consumoPromedioDiario = item.cantidad / 30; // Asumiendo datos mensuales
      const diasHastaReabastecimiento = Math.floor(item.stockActual / consumoPromedioDiario);
      
      return {
        ...item,
        diasHastaReabastecimiento,
        fechaEstimadaReabastecimiento: new Date(Date.now() + (diasHastaReabastecimiento * 24 * 60 * 60 * 1000))
      };
    });

    return predicciones;
  }

  static async obtenerEstadisticas() {
    try {
      const fechaActual = new Date();
      const inicioSemana = new Date(fechaActual.setDate(fechaActual.getDate() - 7));
      const inicioMes = new Date(fechaActual.setMonth(fechaActual.getMonth() - 1));
      const inicioSemestre = new Date(fechaActual.setMonth(fechaActual.getMonth() - 6));

      const [consumoSemanal, consumoMensual, consumoSemestral] = await Promise.all([
        this.obtenerConsumoIngredientes(inicioSemana, new Date()),
        this.obtenerConsumoIngredientes(inicioMes, new Date()),
        this.obtenerConsumoIngredientes(inicioSemestre, new Date())
      ]);

      return {
        semanal: consumoSemanal,
        mensual: consumoMensual,
        semestral: consumoSemestral
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}