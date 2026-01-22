import { describe, it, expect } from 'vitest';
import {
  calculateSquareRoot,
  calculateRealSquareRoot,
  calculateComplexSquareRoot,
  calculateArbitraryPrecisionSquareRoot,
  calculateAnalyticalSquareRoot,
} from './calculator';

describe('Calculator Utils', () => {
  describe('calculateRealSquareRoot', () => {
    it('calculates square root of positive numbers', () => {
      expect(calculateRealSquareRoot('16')).toEqual({
        success: true,
        value: '4',
      });
      expect(calculateRealSquareRoot('25')).toEqual({
        success: true,
        value: '5',
      });
      expect(calculateRealSquareRoot('100')).toEqual({
        success: true,
        value: '10',
      });
    });

    it('calculates square root of zero', () => {
      expect(calculateRealSquareRoot('0')).toEqual({
        success: true,
        value: '0',
      });
    });

    it('calculates square root of non-perfect squares', () => {
      const result = calculateRealSquareRoot('2');
      expect(result.success).toBe(true);
      expect(parseFloat(result.value!)).toBeCloseTo(1.41421356, 5);
    });

    it('returns error for negative numbers', () => {
      expect(calculateRealSquareRoot('-4')).toEqual({
        success: false,
        error: 'negativeReal',
      });
    });

    it('returns error for invalid input', () => {
      expect(calculateRealSquareRoot('abc')).toEqual({
        success: false,
        error: 'invalidInput',
      });
      expect(calculateRealSquareRoot('')).toEqual({
        success: false,
        error: 'invalidInput',
      });
    });
  });

  describe('calculateComplexSquareRoot', () => {
    it('handles positive real numbers', () => {
      const result = calculateComplexSquareRoot('16');
      expect(result.success).toBe(true);
      expect(result.complex?.real).toBe(4);
      expect(result.complex?.imaginary).toBe(0);
    });

    it('handles negative real numbers', () => {
      const result = calculateComplexSquareRoot('-4');
      expect(result.success).toBe(true);
      expect(result.complex?.real).toBe(0);
      expect(result.complex?.imaginary).toBe(2);
    });

    it('handles pure imaginary numbers', () => {
      const result = calculateComplexSquareRoot('4i');
      expect(result.success).toBe(true);
      expect(result.complex?.real).toBeCloseTo(Math.sqrt(2), 5);
      expect(result.complex?.imaginary).toBeCloseTo(Math.sqrt(2), 5);
    });

    it('handles complex numbers a+bi', () => {
      const result = calculateComplexSquareRoot('3+4i');
      expect(result.success).toBe(true);
      expect(result.complex?.real).toBe(2);
      expect(result.complex?.imaginary).toBe(1);
    });

    it('handles zero', () => {
      const result = calculateComplexSquareRoot('0');
      expect(result.success).toBe(true);
      expect(result.complex?.real).toBe(0);
      expect(result.complex?.imaginary).toBe(0);
    });

    it('returns error for invalid input', () => {
      expect(calculateComplexSquareRoot('abc')).toEqual({
        success: false,
        error: 'invalidInput',
      });
    });
  });

  describe('calculateArbitraryPrecisionSquareRoot', () => {
    it('calculates with specified precision', () => {
      const result = calculateArbitraryPrecisionSquareRoot('2', 20);
      expect(result.success).toBe(true);
      expect(result.value).toBe('1.41421356237309504880');
    });

    it('handles perfect squares', () => {
      const result = calculateArbitraryPrecisionSquareRoot('144', 10);
      expect(result.success).toBe(true);
      expect(result.value).toBe('12.0000000000');
    });

    it('handles zero', () => {
      const result = calculateArbitraryPrecisionSquareRoot('0', 10);
      expect(result.success).toBe(true);
      expect(result.value).toBe('0');
    });

    it('handles negative numbers with imaginary result', () => {
      const result = calculateArbitraryPrecisionSquareRoot('-9', 5);
      expect(result.success).toBe(true);
      expect(result.value).toBe('3.00000i');
    });

    it('handles large numbers', () => {
      const result = calculateArbitraryPrecisionSquareRoot(
        '12345678901234567890',
        10
      );
      expect(result.success).toBe(true);
      expect(result.value?.startsWith('3513641828')).toBe(true);
    });

    it('returns error for invalid input', () => {
      expect(calculateArbitraryPrecisionSquareRoot('abc', 10)).toEqual({
        success: false,
        error: 'invalidInput',
      });
    });
  });

  describe('calculateAnalyticalSquareRoot', () => {
    it('simplifies perfect squares', () => {
      const result = calculateAnalyticalSquareRoot('16');
      expect(result.analytical).toBe('4');
    });

    it('returns sqrt symbol for non-perfect squares', () => {
      const result = calculateAnalyticalSquareRoot('2');
      expect(result.analytical).toBe('√2');
    });

    it('handles x^2 pattern', () => {
      expect(calculateAnalyticalSquareRoot('x^2').analytical).toBe('|x|');
      expect(calculateAnalyticalSquareRoot('y**2').analytical).toBe('|y|');
    });

    it('handles coefficient*x^2 pattern', () => {
      const result = calculateAnalyticalSquareRoot('4x^2');
      expect(result.analytical).toBe('2|x|');
    });

    it('handles fractions with perfect square components', () => {
      const result = calculateAnalyticalSquareRoot('4/9');
      expect(result.analytical).toBe('2/3');
    });

    it('handles negative numbers symbolically', () => {
      const result = calculateAnalyticalSquareRoot('-4');
      expect(result.analytical).toBe('2i');
    });

    it('handles simple variables', () => {
      const result = calculateAnalyticalSquareRoot('x');
      expect(result.analytical).toBe('√x');
    });

    it('handles x^4 pattern (even power)', () => {
      const result = calculateAnalyticalSquareRoot('x^4');
      expect(result.analytical).toBe('x\u00B2'); // x²
    });

    it('handles x^6 pattern (even power, odd result)', () => {
      const result = calculateAnalyticalSquareRoot('x^6');
      expect(result.analytical).toBe('|x\u00B3|'); // |x³|
    });

    it('handles x^8 pattern (even power, even result)', () => {
      const result = calculateAnalyticalSquareRoot('x^8');
      expect(result.analytical).toBe('x\u2074'); // x⁴
    });

    it('handles odd powers', () => {
      const result = calculateAnalyticalSquareRoot('x^3');
      expect(result.analytical).toBe('√(x\u00B3)'); // √(x³)
    });

    it('handles coefficient with x^4', () => {
      const result = calculateAnalyticalSquareRoot('4x^4');
      expect(result.analytical).toBe('2x\u00B2'); // 2x²
    });
  });

  describe('calculateSquareRoot (main function)', () => {
    it('returns error for empty input', () => {
      expect(calculateSquareRoot('', 'real')).toEqual({
        success: false,
        error: 'emptyInput',
      });
      expect(calculateSquareRoot('   ', 'complex')).toEqual({
        success: false,
        error: 'emptyInput',
      });
    });

    it('delegates to correct mode handler', () => {
      expect(calculateSquareRoot('16', 'real').value).toBe('4');
      expect(calculateSquareRoot('-4', 'complex').value).toBe('2i');
      expect(calculateSquareRoot('2', 'arbitrary', 5).value).toBe('1.41421');
      expect(calculateSquareRoot('x^2', 'analytical').analytical).toBe('|x|');
    });
  });
});

describe('Edge Cases', () => {
  it('handles very small numbers', () => {
    const result = calculateArbitraryPrecisionSquareRoot('0.0001', 10);
    expect(result.success).toBe(true);
    expect(result.value).toBe('0.0100000000');
  });

  it('handles decimal inputs', () => {
    const result = calculateRealSquareRoot('0.25');
    expect(result.success).toBe(true);
    expect(result.value).toBe('0.5');
  });

  it('handles negative imaginary parts', () => {
    const result = calculateComplexSquareRoot('3-4i');
    expect(result.success).toBe(true);
    expect(result.complex?.real).toBe(2);
    expect(result.complex?.imaginary).toBe(-1);
  });
});
