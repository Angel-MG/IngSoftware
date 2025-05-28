import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

const COLECCION = 'productos';

export class Producto {
  constructor(datos) {
    this.id = datos.id;
    this.nombre = datos.nombre;
    this.cantidad = datos.cantidad;
    this.unidad = datos.unidad;
    this.precio = datos.precio;
    this.tipo = datos.tipo || 'ingrediente';
  }

  static async obtenerTodos() {
    try {
      const querySnapshot = await getDocs(collection(db, COLECCION));
      return querySnapshot.docs.map(doc => new Producto({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  static async crear(datosProducto) {
    try {
      const docRef = await addDoc(collection(db, COLECCION), datosProducto);
      return new Producto({
        id: docRef.id,
        ...datosProducto
      });
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  static async actualizar(id, datosProducto) {
    try {
      const productoRef = doc(db, COLECCION, id);
      await updateDoc(productoRef, datosProducto);
      return new Producto({
        id,
        ...datosProducto
      });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      await deleteDoc(doc(db, COLECCION, id));
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }
}