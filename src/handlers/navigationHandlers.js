export function configurarManejadoresNavegacion(usuarioActual, callbacks) {
  document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('nav-link')) {
      e.preventDefault();
      const nuevaVista = e.target.dataset.view;
      const nuevaSeccion = e.target.dataset.section;
      
      if (nuevaVista && usuarioActual.puedeAccederVista(nuevaVista)) {
        callbacks.onNavigate(nuevaVista);
      } else if (nuevaSeccion) {
        // Manejar navegación entre secciones
        const enlaces = document.querySelectorAll('.nav-link');
        enlaces.forEach(enlace => enlace.classList.remove('active'));
        e.target.classList.add('active');

        const secciones = {
          pedidos: document.getElementById('pedidosSection'),
          historial: document.getElementById('historialSection')
        };

        Object.keys(secciones).forEach(key => {
          if (secciones[key]) {
            secciones[key].style.display = key === nuevaSeccion ? 'block' : 'none';
          }
        });
      }
    } else if (e.target.id === 'logoutBtn') {
      callbacks.onLogout();
    }
  });
}