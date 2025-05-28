export function validarUsuario(nombreUsuario) {
  if (!nombreUsuario) {
    return {
      esValido: false,
      mensaje: 'El nombre de usuario es requerido'
    };
  }

  if (nombreUsuario.length < 3) {
    return {
      esValido: false,
      mensaje: 'El nombre de usuario debe tener al menos 3 caracteres'
    };
  }

  if (nombreUsuario.length > 15) {
    return {
      esValido: false,
      mensaje: 'El nombre de usuario no puede tener más de 15 caracteres'
    };
  }

  if (!nombreUsuario.match(/^[a-zA-Z]/)) {
    return {
      esValido: false,
      mensaje: 'El nombre de usuario debe comenzar con una letra'
    };
  }

  const numeroDeNumeros = (nombreUsuario.match(/\d/g) || []).length;
  if (numeroDeNumeros > 4) {
    return {
      esValido: false,
      mensaje: 'El nombre de usuario no puede contener más de 4 números'
    };
  }

  if (!nombreUsuario.match(/^[a-zA-Z][a-zA-Z0-9]{2,14}$/)) {
    return {
      esValido: false,
      mensaje: 'El nombre de usuario solo puede contener letras y números'
    };
  }

  return {
    esValido: true,
    mensaje: ''
  };
}

export function validarContrasena(contrasena) {
  if (!contrasena) {
    return {
      esValido: false,
      mensaje: 'La contraseña es requerida'
    };
  }

  if (contrasena.length < 6) {
    return {
      esValido: false,
      mensaje: 'La contraseña debe tener al menos 6 caracteres'
    };
  }

  if (contrasena.length > 20) {
    return {
      esValido: false,
      mensaje: 'La contraseña no puede tener más de 20 caracteres'
    };
  }

  return {
    esValido: true,
    mensaje: ''
  };
}