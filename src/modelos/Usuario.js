import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const COLECCION = "usuarios";
const COLECCION_SESIONES = "sesiones";

export class Usuario {
  constructor(datos) {
    this.id = datos.id;
    this.nombreUsuario = datos.nombreUsuario;
    this.rol = datos.rol;
    this.contrasena = datos.contrasena;
  }

  static async obtenerTodos() {
    try {
      const querySnapshot = await getDocs(collection(db, COLECCION));
      return querySnapshot.docs.map(
        (doc) =>
          new Usuario({
            id: doc.id,
            ...doc.data(),
          }),
      );
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  static async crear(datosUsuario) {
    try {
      const docRef = await addDoc(collection(db, COLECCION), datosUsuario);
      return new Usuario({
        id: docRef.id,
        ...datosUsuario,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  }

  static async actualizar(id, datosUsuario) {
    try {
      const userRef = doc(db, COLECCION, id);
      await updateDoc(userRef, datosUsuario);
      return new Usuario({
        id,
        ...datosUsuario,
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      await deleteDoc(doc(db, COLECCION, id));
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }

  static async autenticar(nombreUsuario, contrasena) {
    try {
      const usuarios = await Usuario.obtenerTodos();
      const usuario = usuarios.find(
        (u) => u.nombreUsuario === nombreUsuario && u.contrasena === contrasena,
      );

      if (!usuario) {
        return null;
      }

      // Verificar si ya existe una sesión activa
      const sesionesRef = collection(db, COLECCION_SESIONES);
      const q = query(sesionesRef, where("usuarioId", "==", usuario.id));
      const sesionesSnapshot = await getDocs(q);

      if (!sesionesSnapshot.empty) {
        throw new Error("Este usuario ya tiene una sesión activa");
      }

      // Crear nueva sesión
      await addDoc(collection(db, COLECCION_SESIONES), {
        usuarioId: usuario.id,
        fechaInicio: new Date().toISOString(),
        activa: true,
      });

      return usuario;
    } catch (error) {
      console.error("Error en autenticación:", error);
      throw error;
    }
  }

  static async cerrarSesion(usuarioId) {
    try {
      const sesionesRef = collection(db, COLECCION_SESIONES);
      const q = query(sesionesRef, where("usuarioId", "==", usuarioId));
      const sesionesSnapshot = await getDocs(q);

      const promesasEliminacion = [];
      sesionesSnapshot.forEach((doc) => {
        promesasEliminacion.push(deleteDoc(doc.ref));
      });

      await Promise.all(promesasEliminacion);
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  }

  obtenerVistaDefecto() {
    if (this.rol === "admin") return "admin";
    return this.rol;
  }

  puedeAccederVista(vista) {
    if (this.rol === "admin") {
      return vista === "admin";
    }
    return this.obtenerVistaDefecto() === vista;
  }
}

