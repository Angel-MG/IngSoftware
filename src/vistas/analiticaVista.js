export function renderizarVistaAnalitica(datos = {}) {
  return `
    <div class="analytics-container">
      <h2 class="section-title">Análisis de Ventas</h2>
      
      <div class="analytics-grid">
        <!-- Gráfico de Ventas Semanales -->
        <div class="analytics-card">
          <h3>Ventas de la Última Semana</h3>
          <canvas id="consumoSemanalChart"></canvas>
        </div>

        <!-- Gráfico de Ventas Mensuales -->
        <div class="analytics-card">
          <h3>Ventas del Último Mes</h3>
          <canvas id="consumoMensualChart"></canvas>
        </div>

        <!-- Gráfico de Tendencias Semestrales -->
        <div class="analytics-card">
          <h3>Tendencias de Venta (6 meses)</h3>
          <canvas id="consumoSemestralChart"></canvas>
        </div>

        <!-- Predicciones de Stock -->
        <div class="analytics-card">
          <h3>Predicciones de Stock</h3>
          <div class="predictions-table">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Venta Promedio Diaria</th>
                  <th>Días hasta Agotamiento</th>
                  <th>Fecha Estimada de Agotamiento</th>
                </tr>
              </thead>
              <tbody>
                ${datos.predicciones ? datos.predicciones.map(pred => `
                  <tr>
                    <td>${pred.nombre}</td>
                    <td>${pred.stockActual} unidades</td>
                    <td>${pred.ventaPromedioDiaria} unidades</td>
                    <td>${pred.diasHastaAgotamiento} días</td>
                    <td>${pred.fechaEstimadaAgotamiento}</td>
                  </tr>
                `).join('') : ''}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Análisis de Tendencias -->
        <div class="analytics-card">
          <h3>Análisis de Tendencias</h3>
          <div class="predictions-table">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Tendencia</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${datos.tendencias ? datos.tendencias.map(tend => `
                  <tr>
                    <td>${tend.nombre}</td>
                    <td>${tend.tendencia}%</td>
                    <td>${tend.estable ? 'Estable' : tend.tendencia > 0 ? 'Creciente' : 'Decreciente'}</td>
                  </tr>
                `).join('') : ''}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}