import { useState } from 'react';

// Live approximate exchange rates to INR
const DEFAULT_RATES = {
  USD: 87.25,
  EUR: 91.50,
  GBP: 110.80,
  AED: 23.75,
  SAR: 23.25,
  SGD: 65.40,
  JPY: 0.58,
  AUD: 55.60,
  CAD: 61.20,
};

export default function CurrencyCalculatorCard({ data }) {
  const initialCurrency = data?.currency || 'USD';
  const initialAmount = data?.amount || 100;
  const rates = { ...DEFAULT_RATES, ...(data?.rates || {}) };

  const [mode, setMode] = useState('currency'); // 'currency' | 'split'

  // Currency Converter State
  const [selectedCurrency, setSelectedCurrency] = useState(initialCurrency);
  const [foreignAmount, setForeignAmount] = useState(initialAmount);

  // Bill Splitter State
  const [billTotal, setBillTotal] = useState(data?.billTotal || 3500);
  const [numPeople, setNumPeople] = useState(4);
  const [tipPercent, setTipPercent] = useState(5);
  const [copiedSplit, setCopiedSplit] = useState(false);

  // Currency calculation
  const currentRate = rates[selectedCurrency] || 87.25;
  const inrTotal = (foreignAmount * currentRate).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
  });

  // Split calculation
  const tipAmount = (billTotal * tipPercent) / 100;
  const finalBill = billTotal + tipAmount;
  const perPerson = Math.ceil(finalBill / Math.max(numPeople, 1));

  const handleCopySplit = () => {
    const text = `💰 Trip Bill Split:\nTotal: ₹${billTotal}\nTip (${tipPercent}%): ₹${tipAmount}\nGrand Total: ₹${finalBill}\nDivided among ${numPeople} travelers: ₹${perPerson} per person`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedSplit(true);
        setTimeout(() => setCopiedSplit(false), 2000);
      });
    }
  };

  return (
    <div className="currency-card" role="region" aria-label="Currency Converter & Trip Bill Splitter">
      {/* Header */}
      <div className="currency-card__header">
        <div className="currency-card__title-wrap">
          <span className="currency-card__icon">💱</span>
          <div>
            <div className="currency-card__title">Currency & Trip Splitter</div>
            <div className="currency-card__subtitle">Live Foreign Exchange & Group Expenses</div>
          </div>
        </div>
        <span className="currency-badge">FINANCE</span>
      </div>

      {/* Mode Tabs */}
      <div className="currency-tabs">
        <button
          type="button"
          className={`currency-tab ${mode === 'currency' ? 'currency-tab--active' : ''}`}
          onClick={() => setMode('currency')}
        >
          💵 Convert to INR (₹)
        </button>
        <button
          type="button"
          className={`currency-tab ${mode === 'split' ? 'currency-tab--active' : ''}`}
          onClick={() => setMode('split')}
        >
          👥 Split Group Bill
        </button>
      </div>

      {/* Mode 1: Currency Converter */}
      {mode === 'currency' && (
        <div className="currency-converter-body">
          <div className="currency-row">
            <div className="currency-input-box">
              <label className="currency-label">From Currency</label>
              <div className="currency-select-wrap">
                <select
                  className="currency-select"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {Object.keys(rates).map((c) => (
                    <option key={c} value={c}>
                      {c} ({rates[c]} ₹)
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="currency-input"
                  value={foreignAmount}
                  onChange={(e) => setForeignAmount(Math.max(0, Number(e.target.value)))}
                  min="1"
                />
              </div>
            </div>

            <div className="currency-equals-sign">➔</div>

            <div className="currency-result-box">
              <label className="currency-label">To Indian Rupee (INR)</label>
              <div className="currency-result-val">₹{inrTotal}</div>
            </div>
          </div>

          <div className="currency-rate-info">
            <span>Exchange Rate: 1 {selectedCurrency} ≈ ₹{currentRate.toFixed(2)} INR</span>
            <span>Live indicative interbank rate</span>
          </div>
        </div>
      )}

      {/* Mode 2: Bill Splitter */}
      {mode === 'split' && (
        <div className="bill-splitter-body">
          <div className="split-grid">
            <div className="split-field">
              <label className="split-label">Total Bill Amount (₹)</label>
              <input
                type="number"
                className="split-input"
                value={billTotal}
                onChange={(e) => setBillTotal(Math.max(0, Number(e.target.value)))}
                min="0"
                step="50"
              />
            </div>

            <div className="split-field">
              <label className="split-label">Number of People</label>
              <div className="split-counter">
                <button
                  type="button"
                  className="split-counter-btn"
                  onClick={() => setNumPeople((p) => Math.max(1, p - 1))}
                >
                  -
                </button>
                <span className="split-counter-val">{numPeople}</span>
                <button
                  type="button"
                  className="split-counter-btn"
                  onClick={() => setNumPeople((p) => p + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Tip selection */}
          <div className="split-tip-bar">
            <span className="split-tip-label">Tip / Service Charge:</span>
            {[0, 5, 10, 15].map((t) => (
              <button
                key={t}
                type="button"
                className={`split-tip-btn ${tipPercent === t ? 'split-tip-btn--active' : ''}`}
                onClick={() => setTipPercent(t)}
              >
                {t}%
              </button>
            ))}
          </div>

          {/* Result Card */}
          <div className="split-result-box">
            <div className="split-result-left">
              <span className="split-result-sub">Each person pays</span>
              <div className="split-result-amount">₹{perPerson}</div>
              <span className="split-result-calc">
                (₹{billTotal} + ₹{tipAmount} tip ÷ {numPeople})
              </span>
            </div>
            <button
              type="button"
              className="split-copy-btn"
              onClick={handleCopySplit}
              title="Copy bill breakdown"
            >
              {copiedSplit ? '✓ Copied' : '📋 Copy Breakdown'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
