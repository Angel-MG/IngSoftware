import { validarNombreCliente, validarPedido } from '../utilidades/validacionPedido.js';

describe('Validación de Pedido', () => {
  describe('validarNombreCliente', () => {
    test('debe rechazar un nombre vacío', () => {
      const resultado = validarNombreCliente('');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre del cliente es requerido');
    });

    test('debe rechazar un nombre con números', () => {
      const resultado = validarNombreCliente('Juan123');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre solo puede contener letras y espacios');
    });

    test('debe aceptar un nombre válido', () => {
      const resultado = validarNombreCliente('Juan Pérez');
      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('');
    });

    test('debe aceptar nombres con acentos', () => {
      const resultado = validarNombreCliente('José María');
      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('');
    });

    test('debe rechazar nombres con caracteres especiales', () => {
      const resultado = validarNombreCliente('Juan@Pérez');
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre solo puede contener letras y espacios');
    });

    test('debe aceptar nombres compuestos', () => {
      const resultado = validarNombreCliente('María de los Ángeles');
      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('');
    });
  });

  describe('validarPedido', () => {
    test('debe validar un pedido completo', () => {
      const pedido = {
        nombreCliente: 'Juan Pérez',
        productos: [
          { id: 1, cantidad: 2, nombre: 'Pastel de Chocolate', precio: 300 }
        ],
        fechaEntrega: '2023-12-31',
        total: 600
      };

      const resultado = validarPedido(pedido);
      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('');
    });

    test('debe rechazar un pedido sin nombre de cliente', () => {
      const pedido = {
        nombreCliente: '',
        productos: [
          { id: 1, cantidad: 2, nombre: 'Pastel de Chocolate', precio: 300 }
        ],
        fechaEntrega: '2023-12-31',
        total: 600
      };

      const resultado = validarPedido(pedido);
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre del cliente es requerido');
    });

    test('debe rechazar un pedido con nombre de cliente inválido', () => {
      const pedido = {
        nombreCliente: 'Juan123',
        productos: [
          { id: 1, cantidad: 2, nombre: 'Pastel de Chocolate', precio: 300 }
        ],
        fechaEntrega: '2023-12-31',
        total: 600
      };

      const resultado = validarPedido(pedido);
      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toBe('El nombre solo puede contener letras y espacios');
    });
  });
});