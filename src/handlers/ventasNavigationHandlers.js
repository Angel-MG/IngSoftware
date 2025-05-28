export function inicializarNavegacionVentas() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const seccion = e.target.dataset.section;
      if (seccion) {
        // Actualizar clases activas
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');

        // Mostrar/ocultar secciones
        document.getElementById('pedidosSection').style.display = seccion === 'pedidos' ? 'block' : 'none';
        document.getElementById('historialSection').style.display = seccion === 'historial' ? 'block' : 'none';
      }
    });
  });
}