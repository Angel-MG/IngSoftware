export function renderizarFormularioInicioSesion() {
  return `
    <div class="login-container">
      <h1 class="login-title">Pastelería El Ángel</h1>
      <p class="login-subtitle">Sistema de Gestión</p>
      <form id="loginForm" class="login-form">
        <div class="form-group">
          <label for="username">Usuario:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            placeholder="Ingrese su nombre de usuario" 
            required
          >
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Ingrese su contraseña" 
            required
          >
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  `;
}