export function validarResponsividad(width) {
  const breakpoints = {
    mobile: 320,
    tablet: 768,
    desktop: 1024
  };

  let currentBreakpoint = 'mobile';

  if (width >= breakpoints.desktop) {
    currentBreakpoint = 'desktop';
  } else if (width >= breakpoints.tablet) {
    currentBreakpoint = 'tablet';
  }

  return {
    esValido: width >= breakpoints.mobile,
    breakpoint: currentBreakpoint
  };
}

export function validarContraste(colorFondo, colorTexto) {
  // Función para convertir color a RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Cálculo de luminancia relativa
  const calcularLuminancia = (r, g, b) => {
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const rgb1 = hexToRgb(colorFondo);
  const rgb2 = hexToRgb(colorTexto);
  
  if (!rgb1 || !rgb2) return false;

  const l1 = calcularLuminancia(rgb1.r, rgb1.g, rgb1.b);
  const l2 = calcularLuminancia(rgb2.r, rgb2.g, rgb2.b);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    esValido: ratio >= 4.5,
    ratio: ratio
  };
}