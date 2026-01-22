import Decimal from 'decimal.js';

export type CalculationMode = 'real' | 'complex' | 'arbitrary' | 'analytical';

export interface ComplexNumber {
  real: number;
  imaginary: number;
}

export interface CalculationResult {
  success: boolean;
  value?: string;
  complex?: ComplexNumber;
  analytical?: string;
  error?: string;
}

/**
 * Calculate square root of a real number (standard mode)
 */
export function calculateRealSquareRoot(input: string): CalculationResult {
  const num = parseFloat(input);

  if (isNaN(num)) {
    return { success: false, error: 'invalidInput' };
  }

  if (num < 0) {
    return { success: false, error: 'negativeReal' };
  }

  if (num === 0) {
    return { success: true, value: '0' };
  }

  const result = Math.sqrt(num);
  return { success: true, value: result.toString() };
}

/**
 * Calculate square root of a complex number
 * For input a+bi, sqrt(a+bi) = sqrt((r+a)/2) + i*sign(b)*sqrt((r-a)/2)
 * where r = sqrt(a^2 + b^2)
 */
export function calculateComplexSquareRoot(input: string): CalculationResult {
  const parsed = parseComplexNumber(input);

  if (!parsed) {
    return { success: false, error: 'invalidInput' };
  }

  const { real: a, imaginary: b } = parsed;

  // For pure real negative numbers
  if (b === 0 && a < 0) {
    return {
      success: true,
      complex: { real: 0, imaginary: Math.sqrt(Math.abs(a)) },
      value: `${Math.sqrt(Math.abs(a))}i`,
    };
  }

  // For zero
  if (a === 0 && b === 0) {
    return {
      success: true,
      complex: { real: 0, imaginary: 0 },
      value: '0',
    };
  }

  // For pure real positive numbers
  if (b === 0 && a >= 0) {
    const result = Math.sqrt(a);
    return {
      success: true,
      complex: { real: result, imaginary: 0 },
      value: result.toString(),
    };
  }

  // General complex number case
  const r = Math.sqrt(a * a + b * b);
  const realPart = Math.sqrt((r + a) / 2);
  const imaginaryPart = Math.sign(b) * Math.sqrt((r - a) / 2);

  return {
    success: true,
    complex: { real: realPart, imaginary: imaginaryPart },
    value: formatComplexNumber(realPart, imaginaryPart),
  };
}

/**
 * Calculate square root with arbitrary precision using Decimal.js
 */
export function calculateArbitraryPrecisionSquareRoot(
  input: string,
  precision: number
): CalculationResult {
  try {
    // Set precision (add extra digits for intermediate calculations)
    Decimal.set({ precision: precision + 10 });

    const num = new Decimal(input);

    if (num.isNegative()) {
      // Handle negative numbers - return imaginary result
      const absNum = num.abs();
      const sqrtResult = absNum.sqrt().toFixed(precision);
      return {
        success: true,
        value: `${sqrtResult}i`,
        complex: { real: 0, imaginary: parseFloat(sqrtResult) },
      };
    }

    if (num.isZero()) {
      return { success: true, value: '0' };
    }

    const result = num.sqrt().toFixed(precision);
    return { success: true, value: result };
  } catch {
    return { success: false, error: 'invalidInput' };
  }
}

/**
 * Analytical/symbolic square root calculation
 * Handles expressions like x^2, perfect squares, etc.
 */
export function calculateAnalyticalSquareRoot(
  input: string
): CalculationResult {
  const trimmed = input.trim().toLowerCase();

  // Handle x^n pattern where n is any even number
  const xPowerMatch = trimmed.match(/^([a-z])(?:\^|\*\*)(\d+)$/);
  if (xPowerMatch) {
    const variable = xPowerMatch[1];
    const power = parseInt(xPowerMatch[2]);

    if (power % 2 === 0) {
      // Even power: √(x^n) = x^(n/2) or |x^(n/2)|
      const halfPower = power / 2;
      if (halfPower === 1) {
        return { success: true, analytical: `|${variable}|` };
      } else if (halfPower % 2 === 0) {
        // Result power is even, no absolute value needed
        return {
          success: true,
          analytical: `${variable}${formatPower(halfPower)}`,
        };
      } else {
        // Result power is odd, need absolute value
        return {
          success: true,
          analytical: `|${variable}${formatPower(halfPower)}|`,
        };
      }
    } else {
      // Odd power: cannot simplify completely
      return {
        success: true,
        analytical: `√(${variable}${formatPower(power)})`,
      };
    }
  }

  // Handle x^2 pattern with special notation (², **2)
  const xSquaredMatch = trimmed.match(/^([a-z])²$/);
  if (xSquaredMatch) {
    const variable = xSquaredMatch[1];
    return { success: true, analytical: `|${variable}|` };
  }

  // Handle (expression)^n pattern
  const parenPowerMatch = trimmed.match(/^\(([^)]+)\)(?:\^|\*\*)(\d+)$/);
  if (parenPowerMatch) {
    const expr = parenPowerMatch[1];
    const power = parseInt(parenPowerMatch[2]);

    if (power % 2 === 0) {
      const halfPower = power / 2;
      if (halfPower === 1) {
        return { success: true, analytical: `|${expr}|` };
      } else if (halfPower % 2 === 0) {
        return {
          success: true,
          analytical: `(${expr})${formatPower(halfPower)}`,
        };
      } else {
        return {
          success: true,
          analytical: `|(${expr})${formatPower(halfPower)}|`,
        };
      }
    } else {
      return { success: true, analytical: `√((${expr})${formatPower(power)})` };
    }
  }

  // Handle (expression)^2 pattern with ² notation
  const parenSquaredMatch = trimmed.match(/^\(([^)]+)\)²$/);
  if (parenSquaredMatch) {
    return { success: true, analytical: `|${parenSquaredMatch[1]}|` };
  }

  // Handle coefficient*x^n pattern (e.g., 4x^2, 9x^4)
  const coeffXPowerMatch = trimmed.match(
    /^(\d+)\s*\*?\s*([a-z])(?:\^|\*\*)(\d+)$/
  );
  if (coeffXPowerMatch) {
    const coeff = parseInt(coeffXPowerMatch[1]);
    const variable = coeffXPowerMatch[2];
    const power = parseInt(coeffXPowerMatch[3]);
    const sqrtCoeff = Math.sqrt(coeff);

    if (power % 2 === 0) {
      const halfPower = power / 2;
      const varPart =
        halfPower === 1 ? variable : `${variable}${formatPower(halfPower)}`;
      const needsAbsValue = halfPower % 2 !== 0;

      if (Number.isInteger(sqrtCoeff)) {
        if (needsAbsValue) {
          return { success: true, analytical: `${sqrtCoeff}|${varPart}|` };
        }
        return { success: true, analytical: `${sqrtCoeff}${varPart}` };
      }
      if (needsAbsValue) {
        return { success: true, analytical: `√${coeff}·|${varPart}|` };
      }
      return { success: true, analytical: `√${coeff}·${varPart}` };
    } else {
      if (Number.isInteger(sqrtCoeff)) {
        return {
          success: true,
          analytical: `${sqrtCoeff}√(${variable}${formatPower(power)})`,
        };
      }
      return {
        success: true,
        analytical: `√(${coeff}${variable}${formatPower(power)})`,
      };
    }
  }

  // Handle coefficient*x^2 pattern with ² notation
  const coeffXSquaredMatch = trimmed.match(/^(\d+)\s*\*?\s*([a-z])²$/);
  if (coeffXSquaredMatch) {
    const coeff = parseInt(coeffXSquaredMatch[1]);
    const variable = coeffXSquaredMatch[2];
    const sqrtCoeff = Math.sqrt(coeff);
    if (Number.isInteger(sqrtCoeff)) {
      return { success: true, analytical: `${sqrtCoeff}|${variable}|` };
    }
    return { success: true, analytical: `√${coeff}·|${variable}|` };
  }

  // Handle fractions a/b
  const fractionMatch = trimmed.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fractionMatch) {
    const a = parseInt(fractionMatch[1]);
    const b = parseInt(fractionMatch[2]);
    const sqrtA = Math.sqrt(a);
    const sqrtB = Math.sqrt(b);
    if (Number.isInteger(sqrtA) && Number.isInteger(sqrtB)) {
      return {
        success: true,
        analytical: `${sqrtA}/${sqrtB}`,
        value: (sqrtA / sqrtB).toString(),
      };
    }
    return {
      success: true,
      analytical: `√(${a}/${b})`,
      value: Math.sqrt(a / b).toString(),
    };
  }

  // Handle a*b pattern (product)
  const productMatch = trimmed.match(/^(\d+)\s*\*\s*(\d+)$/);
  if (productMatch) {
    const a = parseInt(productMatch[1]);
    const b = parseInt(productMatch[2]);
    const product = a * b;
    const sqrt = Math.sqrt(product);
    if (Number.isInteger(sqrt)) {
      return {
        success: true,
        analytical: sqrt.toString(),
        value: sqrt.toString(),
      };
    }
    // Try to simplify
    const simplified = simplifySquareRoot(product);
    return { success: true, analytical: simplified, value: sqrt.toString() };
  }

  // Handle pure numeric values (check that the whole string is a number)
  if (/^-?\d+\.?\d*$/.test(trimmed)) {
    const numericValue = parseFloat(trimmed);
    if (numericValue >= 0) {
      const sqrt = Math.sqrt(numericValue);
      if (Number.isInteger(sqrt)) {
        return {
          success: true,
          analytical: sqrt.toString(),
          value: sqrt.toString(),
        };
      }
      return {
        success: true,
        analytical: `√${numericValue}`,
        value: sqrt.toString(),
      };
    } else {
      const sqrt = Math.sqrt(Math.abs(numericValue));
      if (Number.isInteger(sqrt)) {
        return { success: true, analytical: `${sqrt}i`, value: `${sqrt}i` };
      }
      return {
        success: true,
        analytical: `√${Math.abs(numericValue)}·i`,
        value: `${sqrt}i`,
      };
    }
  }

  // Handle simple variable
  if (/^[a-z]$/.test(trimmed)) {
    return { success: true, analytical: `√${trimmed}` };
  }

  // Default: wrap in sqrt symbol
  return { success: true, analytical: `√(${trimmed})` };
}

/**
 * Main calculation function that delegates to the appropriate mode
 */
export function calculateSquareRoot(
  input: string,
  mode: CalculationMode,
  precision: number = 10
): CalculationResult {
  if (!input || input.trim() === '') {
    return { success: false, error: 'emptyInput' };
  }

  switch (mode) {
    case 'real':
      return calculateRealSquareRoot(input);
    case 'complex':
      return calculateComplexSquareRoot(input);
    case 'arbitrary':
      return calculateArbitraryPrecisionSquareRoot(input, precision);
    case 'analytical':
      return calculateAnalyticalSquareRoot(input);
    default:
      return calculateRealSquareRoot(input);
  }
}

// Helper functions

function parseComplexNumber(input: string): ComplexNumber | null {
  const trimmed = input.trim().toLowerCase().replace(/\s/g, '');

  // Pure imaginary: "5i" or "-3i" or "i"
  const pureImaginaryMatch = trimmed.match(/^([+-]?\d*\.?\d*)i$/);
  if (pureImaginaryMatch) {
    const imagStr = pureImaginaryMatch[1];
    const imaginary =
      imagStr === '' || imagStr === '+'
        ? 1
        : imagStr === '-'
          ? -1
          : parseFloat(imagStr);
    return { real: 0, imaginary };
  }

  // Pure real
  const pureReal = parseFloat(trimmed);
  if (!isNaN(pureReal) && !trimmed.includes('i')) {
    return { real: pureReal, imaginary: 0 };
  }

  // Complex: "a+bi" or "a-bi"
  const complexMatch = trimmed.match(/^([+-]?\d*\.?\d+)([+-]\d*\.?\d*)i$/);
  if (complexMatch) {
    const real = parseFloat(complexMatch[1]);
    const imagStr = complexMatch[2];
    const imaginary =
      imagStr === '+' ? 1 : imagStr === '-' ? -1 : parseFloat(imagStr);
    return { real, imaginary };
  }

  // Complex with just sign for imaginary: "3+i" or "3-i"
  const complexSimpleMatch = trimmed.match(/^([+-]?\d*\.?\d+)([+-])i$/);
  if (complexSimpleMatch) {
    const real = parseFloat(complexSimpleMatch[1]);
    const imaginary = complexSimpleMatch[2] === '+' ? 1 : -1;
    return { real, imaginary };
  }

  return null;
}

function formatComplexNumber(real: number, imaginary: number): string {
  const realStr = real.toFixed(10).replace(/\.?0+$/, '');
  const imaginaryAbs = Math.abs(imaginary);
  const imaginaryStr = imaginaryAbs.toFixed(10).replace(/\.?0+$/, '');

  if (imaginary === 0) {
    return realStr;
  }

  if (real === 0) {
    return imaginary < 0 ? `-${imaginaryStr}i` : `${imaginaryStr}i`;
  }

  const sign = imaginary < 0 ? ' - ' : ' + ';
  return `${realStr}${sign}${imaginaryStr}i`;
}

function simplifySquareRoot(n: number): string {
  if (n < 0) return `√${n}·i`;

  let outside = 1;
  let inside = n;

  for (let i = 2; i * i <= inside; i++) {
    while (inside % (i * i) === 0) {
      outside *= i;
      inside /= i * i;
    }
  }

  if (inside === 1) {
    return outside.toString();
  }

  if (outside === 1) {
    return `√${inside}`;
  }

  return `${outside}√${inside}`;
}

function formatPower(n: number): string {
  const superscripts: Record<string, string> = {
    '0': '\u2070',
    '1': '\u00B9',
    '2': '\u00B2',
    '3': '\u00B3',
    '4': '\u2074',
    '5': '\u2075',
    '6': '\u2076',
    '7': '\u2077',
    '8': '\u2078',
    '9': '\u2079',
  };

  return n
    .toString()
    .split('')
    .map((d) => superscripts[d] || d)
    .join('');
}
