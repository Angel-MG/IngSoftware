export function validarNombreCliente(nombre) {
  // Expresión regular que permite solo letras y espacios
  const regex = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/;
  
  if (!nombre || nombre.trim() === '') {
    return {
      esValido: false,
      mensaje: 'El nombre del cliente es requerido'
    };
  }

  if (!regex.test(nombre)) {
    return {
      esValido: false,
      mensaje: 'El nombre solo puede contener letras y espacios'
    };
  }

  return {
    esValido: true,
    mensaje: ''
  };
}

export function validarPedido(datosPedido) {
  // Validar nombre del cliente
  const validacionNombre = validarNombreCliente(datosPedido.nombreCliente);
  if (!validacionNombre.esValido) {
    return validacionNombre;
  }

  return {
    esValido: true,
    mensaje: ''
  };
}