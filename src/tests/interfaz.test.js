import { validarResponsividad } from '../utilidades/validacionInterfaz.js';

describe('Pruebas de Interfaz', () => {
  describe('Responsividad', () => {
    test('debe adaptarse a vista móvil', () => {
      const resultado = validarResponsividad(320);
      expect(resultado.esValido).toBe(true);
      expect(resultado.breakpoint).toBe('mobile');
    });

    test('debe adaptarse a vista tablet', () => {
      const resultado = validarResponsividad(768);
      expect(resultado.esValido).toBe(true);
      expect(resultado.breakpoint).toBe('tablet');
    });

    test('debe adaptarse a vista escritorio', () => {
      const resultado = validarResponsividad(1024);
      expect(resultado.esValido).toBe(true);
      expect(resultado.breakpoint).toBe('desktop');
    });
  });
});