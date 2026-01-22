import { useState, useCallback } from 'react';
import { useI18n } from '../i18n/I18nContext';
import {
  calculateSquareRoot,
  CalculationMode,
  CalculationResult,
} from '../utils/calculator';
import CopyIcon from '../components/CopyIcon';

export default function Calculator() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<CalculationMode>('real');
  const [precision, setPrecision] = useState(10);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!result?.success) return;
    const textToCopy = result.analytical || result.value || '';
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [result]);

  const handleCalculate = useCallback(() => {
    const calcResult = calculateSquareRoot(input, mode, precision);
    setResult(calcResult);
  }, [input, mode, precision]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate();
    }
  };

  const getErrorMessage = (errorKey: string): string => {
    const errors = t.calculator.errors as Record<string, string>;
    return errors[errorKey] || t.common.error;
  };

  const getHint = (): string => {
    const hints = t.calculator.hints as Record<string, string>;
    return hints[mode] || '';
  };

  return (
    <div className="calculator">
      <div className="card">
        <h2>{t.calculator.title}</h2>

        <div className="calculator-form">
          {/* Mode Selector */}
          <div className="form-group">
            <label>{t.calculator.modeLabel}</label>
            <div className="mode-selector">
              <button
                type="button"
                className={`mode-btn ${mode === 'real' ? 'active' : ''}`}
                onClick={() => setMode('real')}
              >
                {t.calculator.modes.real}
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === 'complex' ? 'active' : ''}`}
                onClick={() => setMode('complex')}
              >
                {t.calculator.modes.complex}
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === 'arbitrary' ? 'active' : ''}`}
                onClick={() => setMode('arbitrary')}
              >
                {t.calculator.modes.arbitrary}
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === 'analytical' ? 'active' : ''}`}
                onClick={() => setMode('analytical')}
              >
                {t.calculator.modes.analytical}
              </button>
            </div>
          </div>

          {/* Input Field */}
          <div className="form-group">
            <label htmlFor="number-input">{t.calculator.inputLabel}</label>
            <input
              id="number-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={getHint()}
              autoFocus
            />
          </div>

          {/* Precision Control (only for arbitrary mode) */}
          {mode === 'arbitrary' && (
            <div className="form-group">
              <label>{t.calculator.precisionLabel}</label>
              <div className="precision-control">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={precision}
                  onChange={(e) => setPrecision(Number(e.target.value))}
                />
                <span className="precision-value">{precision}</span>
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <button
            type="button"
            className="calculate-btn"
            onClick={handleCalculate}
          >
            {t.calculator.calculateButton}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="result-display">
            {result.success ? (
              <>
                <button
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopy}
                  title={copied ? '✓' : 'Copy'}
                >
                  <CopyIcon copied={copied} />
                </button>
                <h3>{t.calculator.result}</h3>
                <div className="result-value">
                  {result.analytical || result.value}
                </div>
                {result.complex &&
                  (result.complex.real !== 0 ||
                    result.complex.imaginary !== 0) && (
                    <div className="result-complex">
                      <span>
                        {t.calculator.realPart}:{' '}
                        {result.complex.real.toFixed(10).replace(/\.?0+$/, '')}
                      </span>
                      <span>
                        {t.calculator.imaginaryPart}:{' '}
                        {result.complex.imaginary
                          .toFixed(10)
                          .replace(/\.?0+$/, '')}
                      </span>
                    </div>
                  )}
              </>
            ) : (
              <div className="error-message">
                {getErrorMessage(result.error || 'invalidInput')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
