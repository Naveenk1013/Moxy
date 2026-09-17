import { useState } from 'react';

export default function PNRStatusCard({ data }) {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const {
    PnrNumber = '----------',
    TrainNumber = '',
    TrainName = '',
    JourneyClass = '',
    ChatPrepared = 'NO',
    From = '',
    To = '',
    JourneyDate = '',
    TicketFare = '',
    Distance = '',
    Passangers = [],
    isGatewayBusy = false,
    isFlushedOrInvalid = false,
    Message = '',
  } = data;

  const handleCopyPnr = () => {
    if (navigator.clipboard && PnrNumber) {
      navigator.clipboard.writeText(PnrNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isFlushedOrInvalid) {
    return (
      <div className="pnr-card" role="region" aria-label={`PNR Status for ${PnrNumber}`}>
        <div className="pnr-card__top">
          <div className="pnr-card__pnr-wrap">
            <span className="pnr-card__icon">🎟️</span>
            <div>
              <div className="pnr-card__label">PNR NUMBER</div>
              <div className="pnr-card__number">{PnrNumber}</div>
            </div>
          </div>
          <button
            type="button"
            className="pnr-card__copy-btn"
            onClick={handleCopyPnr}
            title="Copy PNR"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        <div className="pnr-notice-box pnr-notice-box--flushed">
          <div className="pnr-notice-title">
            <span>ℹ️</span> {Message || 'FLUSHED PNR / PNR NOT YET GENERATED'}
          </div>
          <p className="pnr-notice-desc">
            This PNR has been archived/flushed from the active Indian Railways PRS reservation servers (commonly happens for completed journeys) or has not yet been generated.
          </p>
          <a
            href="https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?locale=en"
            target="_blank"
            rel="noopener noreferrer"
            className="pnr-notice-link"
          >
            🔍 Check Official PRS Portal ➔
          </a>
        </div>
      </div>
    );
  }

  if (isGatewayBusy) {
    return (
      <div className="pnr-card" role="region" aria-label={`PNR Status for ${PnrNumber}`}>
        <div className="pnr-card__top">
          <div className="pnr-card__pnr-wrap">
            <span className="pnr-card__icon">🎟️</span>
            <div>
              <div className="pnr-card__label">PNR NUMBER</div>
              <div className="pnr-card__number">{PnrNumber}</div>
            </div>
          </div>
          <button
            type="button"
            className="pnr-card__copy-btn"
            onClick={handleCopyPnr}
            title="Copy PNR"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
        </div>

        <div className="pnr-notice-box pnr-notice-box--busy">
          <div className="pnr-notice-title">
            <span>⚠️</span> Live IRCTC Gateway Rate-Limited
          </div>
          <p className="pnr-notice-desc">
            The live railway telemetry server is temporarily busy or rate-limited on the basic quota. You can verify real-time charting directly on the official Indian Railways passenger enquiry portal.
          </p>
          <a
            href="https://www.indianrail.gov.in/enquiry/PNR/PnrEnquiry.html?locale=en"
            target="_blank"
            rel="noopener noreferrer"
            className="pnr-notice-link pnr-notice-link--warning"
          >
            🔍 Verify on Official Indian Railways Portal ➔
          </a>
        </div>
      </div>
    );
  }

  const isChartPrepared = String(ChatPrepared).toUpperCase() === 'YES';

  const parseStatusBadge = (statusStr = '') => {
    const s = String(statusStr).trim().toUpperCase();
    if (s.startsWith('CNF') || s.includes('CONFIRM')) {
      return <span className="pnr-badge pnr-badge--cnf">✅ {statusStr}</span>;
    }
    if (s.startsWith('RAC')) {
      return <span className="pnr-badge pnr-badge--rac">⚠️ {statusStr}</span>;
    }
    if (s.includes('WL') || s.includes('WAITLIST')) {
      return <span className="pnr-badge pnr-badge--wl">⏳ {statusStr}</span>;
    }
    if (s.includes('CAN') || s.includes('CANCEL')) {
      return <span className="pnr-badge pnr-badge--can">❌ {statusStr}</span>;
    }
    return <span className="pnr-badge pnr-badge--neutral">{statusStr || 'N/A'}</span>;
  };

  return (
    <div className="pnr-card" role="region" aria-label={`PNR Status for ${PnrNumber}`}>
      {/* Top Banner with PNR and Chart Status */}
      <div className="pnr-card__top">
        <div className="pnr-card__pnr-wrap">
          <span className="pnr-card__icon">🎟️</span>
          <div>
            <div className="pnr-card__label">PNR NUMBER</div>
            <div className="pnr-card__number">{PnrNumber}</div>
          </div>
        </div>

        <div className="pnr-card__actions">
          <button
            type="button"
            className="pnr-card__copy-btn"
            onClick={handleCopyPnr}
            title="Copy PNR to clipboard"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>
          <span
            className={`pnr-chart-badge ${
              isChartPrepared ? 'pnr-chart-badge--prepared' : 'pnr-chart-badge--not-prepared'
            }`}
          >
            {isChartPrepared ? '⚡ Chart Prepared' : '⏳ Chart Not Prepared'}
          </span>
        </div>
      </div>

      {/* Train Details Banner */}
      <div className="pnr-card__train-bar">
        <div className="pnr-card__train-info">
          <div className="pnr-card__train-num">
            Train #{TrainNumber} {TrainName ? `• ${TrainName}` : ''}
          </div>
          <div className="pnr-card__route">
            <span className="pnr-station">{From}</span>
            <span className="pnr-arrow">➔</span>
            <span className="pnr-station">{To}</span>
          </div>
        </div>

        <div className="pnr-card__chips">
          {JourneyClass && <span className="pnr-class-pill">{JourneyClass}</span>}
          {JourneyDate && <span className="pnr-date-pill">📅 {JourneyDate}</span>}
          {TicketFare && <span className="pnr-date-pill">💰 {TicketFare}</span>}
          {Distance && <span className="pnr-date-pill">📏 {Distance}</span>}
        </div>
      </div>

      {/* Passenger Breakdown List */}
      <div className="pnr-card__passengers">
        <div className="pnr-card__pass-header">
          <span>Passenger Details</span>
          <span className="pnr-card__pass-count">
            {Passangers.length} {Passangers.length === 1 ? 'Passenger' : 'Passengers'}
          </span>
        </div>

        <div className="pnr-card__pass-list">
          {Passangers.map((p, idx) => (
            <div key={idx} className="pnr-pass-row">
              <div className="pnr-pass-row__left">
                <span className="pnr-pass-icon">👤</span>
                <div>
                  <div className="pnr-pass-name">{p.Passenger || `Passenger ${idx + 1}`}</div>
                  {p.BookingStatus && (
                    <div className="pnr-pass-booking">
                      Booked: <span className="pnr-code-text">{p.BookingStatus}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pnr-pass-row__status">
                <div className="pnr-status-label">Current Status</div>
                {parseStatusBadge(p.CurrentStatus || p.BookingStatus)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
