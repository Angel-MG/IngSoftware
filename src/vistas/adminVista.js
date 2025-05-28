export function renderizarVistaAdmin(usuarios = [], productos = [], pedidos = []) {
  const ingredientes = productos.filter(p => p.tipo === 'ingrediente');
  const productosTerminados = productos.filter(p => p.tipo === 'terminado');

  return `
    <div class="app-layout">
      <nav class="nav-menu">
        <div class="nav-container">
          <div class="nav-brand">Pastelería El Ángel</div>
          <div class="nav-links">
            <a href="#" class="nav-link active" data-section="usuarios">Usuarios</a>
            <a href="#" class="nav-link" data-section="inventario">Inventario</a>
            <a href="#" class="nav-link" data-section="reportes">Reportes</a>
            <a href="#" class="nav-link" data-section="analitica">Predicciones</a>
          </div>
          <div class="nav-actions">
            <button id="logoutBtn" class="logout-btn">
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <div class="main-content">
        <!-- Sección de Usuarios -->
        <div id="usuariosSection" class="section">
          <div class="section-header">
            <h2 class="section-title">Gestión de Usuarios</h2>
            <button id="newUserBtn" class="primary-btn">Crear Nuevo Usuario</button>
          </div>
          <div class="table-container">
            <table id="usersTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${usuarios.map(usuario => `
                  <tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.nombreUsuario}</td>
                    <td>${usuario.rol}</td>
                    <td>
                      <button class="edit-btn" data-id="${usuario.id}" data-type="user">Editar</button>
                      <button class="delete-btn" data-id="${usuario.id}" data-type="user">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sección de Inventario -->
        <div id="inventarioSection" class="section" style="display: none;">
          <div class="section-header">
            <h2 class="section-title">Gestión de Inventario</h2>
            <button id="newProductBtn" class="primary-btn">Agregar Nuevo Producto</button>
          </div>
          <div class="table-container">
            <h3 class="section-subtitle">Ingredientes</h3>
            <table id="ingredientsTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${ingredientes.map(producto => `
                  <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>
                      <button class="edit-btn" data-id="${producto.id}" data-type="product">Editar</button>
                      <button class="delete-btn" data-id="${producto.id}" data-type="product">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <h3 class="section-subtitle">Productos Terminados</h3>
            <table id="finishedProductsTable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Unidad</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${productosTerminados.map(producto => `
                  <tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.unidad}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                    <td>
                      <button class="edit-btn" data-id="${producto.id}" data-type="product">Editar</button>
                      <button class="delete-btn" data-id="${producto.id}" data-type="product">Eliminar</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sección de Reportes -->
        <div id="reportesSection" class="section" style="display: none;">
          <div class="section-header">
            <h2 class="section-title">Generación de Reportes</h2>
          </div>
          <div class="reports-section">
            <div class="filters-container">
              <h3>Reporte de Ventas</h3>
              <div class="filter-group">
                <div class="date-filters">
                  <div class="filter-date-group">
                    <label for="reporteFechaDesde">Desde:</label>
                    <input 
                      type="date" 
                      id="reporteFechaDesde" 
                      class="filter-input"
                      required
                    >
                  </div>
                  <div class="filter-date-group">
                    <label for="reporteFechaHasta">Hasta:</label>
                    <input 
                      type="date" 
                      id="reporteFechaHasta" 
                      class="filter-input"
                      required
                    >
                  </div>
                </div>
                <button id="generarReporteBtn" class="primary-btn">
                  Generar Reporte PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de Analítica -->
        <div id="analiticaSection" class="section" style="display: none;">
          <div id="analiticaContent"></div>
        </div>
      </div>

      <!-- Modal de Usuario -->
      <div id="userModal" class="modal" style="display: none;">
        <div class="modal-content">
          <h3>Crear Nuevo Usuario</h3>
          <form id="userForm" novalidate>
            <div class="form-group">
              <label for="username">Usuario:</label>
              <input 
                type="text" 
                id="username" 
                pattern="^[a-zA-Z][a-zA-Z0-9]{2,14}$"
                required
                minlength="3"
                maxlength="15"
                title="El nombre de usuario debe comenzar con una letra y puede contener letras y números"
              >
              <span class="error-message" id="username-error"></span>
            </div>
            <div class="form-group">
              <label for="password">Contraseña:</label>
              <input 
                type="password" 
                id="password" 
                required
                minlength="6"
                maxlength="20"
                title="La contraseña debe tener entre 6 y 20 caracteres"
              >
              <span class="error-message" id="password-error"></span>
            </div>
            <div class="form-group">
              <label for="role">Rol:</label>
              <select id="role" required>
                <option value="ventas">Ventas</option>
                <option value="produccion">Producción</option>
                <option value="decoracion">Decoración</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit">Guardar</button>
              <button type="button" id="cancelUserBtn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de Producto -->
      <div id="productModal" class="modal" style="display: none;">
        <div class="modal-content">
          <h3>Agregar Nuevo Producto</h3>
          <form id="productForm">
            <div class="form-group">
              <label for="productName">Nombre del Producto:</label>
              <input type="text" id="productName" required>
            </div>
            <div class="form-group">
              <label for="productType">Tipo de Producto:</label>
              <select id="productType" required>
                <option value="ingrediente">Ingrediente</option>
                <option value="terminado">Producto Terminado</option>
              </select>
            </div>
            <div class="form-group">
              <label for="productQuantity">Cantidad:</label>
              <input type="number" id="productQuantity" min="0" required>
            </div>
            <div class="form-group">
              <label for="productUnit">Unidad:</label>
              <select id="productUnit" required>
                <option value="pieza">Pieza</option>
                <option value="kg">Kilogramo</option>
                <option value="g">Gramo</option>
                <option value="litro">Litro</option>
                <option value="ml">Mililitro</option>
              </select>
            </div>
            <div class="form-group">
              <label for="productPrice">Precio:</label>
              <input type="number" id="productPrice" min="0" step="0.01" required>
            </div>
            <div class="form-actions">
              <button type="submit">Guardar</button>
              <button type="button" id="cancelProductBtn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}