export function inicializarFiltrosHistorial(pedidosCompletados, callbacks) {
  const configurarFiltros = () => {
    const botonAplicar = document.getElementById('aplicarFiltros');
    const botonLimpiar = document.getElementById('limpiarFiltros');
    const inputCliente = document.getElementById('clienteFilter');
    const inputFechaDesde = document.getElementById('fechaDesde');
    const inputFechaHasta = document.getElementById('fechaHasta');

    if (!botonAplicar || !botonLimpiar || !inputCliente || !inputFechaDesde || !inputFechaHasta) {
      return;
    }

    const aplicarFiltros = () => {
      const filtros = {
        cliente: inputCliente.value.toLowerCase().trim(),
        fechaDesde: inputFechaDesde.value,
        fechaHasta: inputFechaHasta.value
      };

      const pedidosFiltrados = pedidosCompletados.filter(pedido => {
        // Filtro por cliente
        const cumpleCliente = !filtros.cliente || 
          pedido.nombreCliente.toLowerCase().includes(filtros.cliente);
        
        // Filtro por fechas
        let cumpleFechas = true;
        const fechaPedido = new Date(pedido.fechaCreacion);
        
        if (filtros.fechaDesde) {
          const fechaDesde = new Date(filtros.fechaDesde);
          fechaDesde.setHours(0, 0, 0, 0);
          cumpleFechas = cumpleFechas && fechaPedido >= fechaDesde;
        }
        
        if (filtros.fechaHasta) {
          const fechaHasta = new Date(filtros.fechaHasta);
          fechaHasta.setHours(23, 59, 59, 999);
          cumpleFechas = cumpleFechas && fechaPedido <= fechaHasta;
        }

        return cumpleCliente && cumpleFechas;
      });

      callbacks.onFiltrar(pedidosFiltrados);
    };

    // Evento para el botón de aplicar filtros
    botonAplicar.addEventListener('click', aplicarFiltros);

    // Evento para el botón de limpiar filtros
    botonLimpiar.addEventListener('click', () => {
      inputCliente.value = '';
      inputFechaDesde.value = '';
      inputFechaHasta.value = '';
      callbacks.onFiltrar(pedidosCompletados);
    });

    // Eventos para aplicar filtros al presionar Enter en los inputs
    [inputCliente, inputFechaDesde, inputFechaHasta].forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          aplicarFiltros();
        }
      });
    });
  };

  configurarFiltros();

  return {
    actualizarFiltros: configurarFiltros
  };
}