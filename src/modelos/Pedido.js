import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

const COLECCION = 'pedidos';

export class Pedido {
  constructor(datos) {
    this.id = datos.id;
    this.nombreCliente = datos.nombreCliente;
    this.productos = datos.productos;
    this.estado = datos.estado;
    this.fechaEntrega = datos.fechaEntrega;
    this.instruccionesEspeciales = datos.instruccionesEspeciales;
    this.fechaCreacion = datos.fechaCreacion;
    this.total = datos.total;
  }

  static async obtenerTodos() {
    try {
      const querySnapshot = await getDocs(collection(db, COLECCION));
      return querySnapshot.docs.map(doc => new Pedido({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      throw error;
    }
  }

  static async crear(datosPedido) {
    try {
      const docRef = await addDoc(collection(db, COLECCION), {
        ...datosPedido,
        fechaCreacion: new Date().toISOString()
      });
      return new Pedido({
        id: docRef.id,
        ...datosPedido,
        fechaCreacion: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  static async actualizar(id, datosPedido) {
    try {
      const pedidoRef = doc(db, COLECCION, id);
      await updateDoc(pedidoRef, datosPedido);
      return new Pedido({
        id,
        ...datosPedido
      });
    } catch (error) {
      console.error('Error al actualizar pedido:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      await deleteDoc(doc(db, COLECCION, id));
      return true;
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    }
  }
}