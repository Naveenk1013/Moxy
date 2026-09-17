import { useState } from 'react';
import { openWhatsApp, formatMetroShare } from '../../utils/whatsapp';

export default function MetroTransitCard({ data }) {
  const [showStations, setShowStations] = useState(false);

  if (!data) return null;

  const {
    originStation = 'Miyapur',
    destinationStation = 'Raidurg (Hitec City)',
    fromLine = 'Red',
    toLine = 'Blue',
    interchangeStation = 'Ameerpet',
    totalStops = 14,
    estimatedFare = 45,
    estimatedTime = '32 mins',
    routeStops = [],
    timings = '6:00 AM – 11:00 PM',
    frequency = 'Every 4-7 mins',
    nearestStation = null,
  } = data;

  const getLineColor = (lineName) => {
    const l = String(lineName).toLowerCase();
    if (l.includes('red')) return { bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5', dot: '#EF4444' };
    if (l.includes('blue')) return { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD', dot: '#3B82F6' };
    if (l.includes('green')) return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC', dot: '#22C55E' };
    return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1', dot: '#64748B' };
  };

  const originColor = getLineColor(fromLine);
  const destColor = getLineColor(toLine);

  return (
    <div className="metro-card" role="region" aria-label="Hyderabad Metro Route & Transit Guide">
      {/* Header */}
      <div className="metro-card__header">
        <div className="metro-card__title-wrap">
          <span className="metro-card__icon">🚇</span>
          <div>
            <div className="metro-card__title">Hyderabad Metro Route</div>
            <div className="metro-card__subtitle">Rapid Transit • Smart Fares & Interchanges</div>
          </div>
        </div>
        <div className="metro-card__actions">
          <button
            type="button"
            className="metro-whatsapp-btn"
            onClick={() => openWhatsApp(formatMetroShare(data))}
            title="Share metro route on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            💬 WhatsApp
          </button>
          <span className="metro-badge">HMR TRANSIT</span>
        </div>
      </div>

      {/* Nearest station prompt if user coordinate matched */}
      {nearestStation && (
        <div className="metro-nearest-chip">
          <span>📍 Nearest Station:</span>
          <strong>{nearestStation.name} ({nearestStation.line} Line)</strong>
          <span className="metro-nearest-dist">• {nearestStation.distance}</span>
        </div>
      )}

      {/* Origin -> Destination Banner */}
      <div className="metro-route-banner">
        <div className="metro-station-node">
          <span className="metro-dot" style={{ background: originColor.dot }}></span>
          <div className="metro-node-text">
            <span className="metro-node-label">FROM</span>
            <span className="metro-node-name">{originStation}</span>
            <span className="metro-line-tag" style={{ background: originColor.bg, color: originColor.text, borderColor: originColor.border }}>
              {fromLine} Line
            </span>
          </div>
        </div>

        <div className="metro-arrow-divider">
          <span className="metro-arrow-line"></span>
          {interchangeStation && (
            <div className="metro-interchange-chip" title={`Interchange at ${interchangeStation}`}>
              🔄 Change at {interchangeStation}
            </div>
          )}
        </div>

        <div className="metro-station-node">
          <span className="metro-dot" style={{ background: destColor.dot }}></span>
          <div className="metro-node-text">
            <span className="metro-node-label">TO</span>
            <span className="metro-node-name">{destinationStation}</span>
            <span className="metro-line-tag" style={{ background: destColor.bg, color: destColor.text, borderColor: destColor.border }}>
              {toLine} Line
            </span>
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div className="metro-stats-grid">
        <div className="metro-stat-tile">
          <span className="metro-stat-label">Estimated Fare</span>
          <span className="metro-stat-val metro-stat-val--fare">₹{estimatedFare}</span>
        </div>
        <div className="metro-stat-tile">
          <span className="metro-stat-label">Journey Duration</span>
          <span className="metro-stat-val">⏱️ {estimatedTime}</span>
        </div>
        <div className="metro-stat-tile">
          <span className="metro-stat-label">Total Stops</span>
          <span className="metro-stat-val">🚉 {totalStops} Stations</span>
        </div>
        <div className="metro-stat-tile">
          <span className="metro-stat-label">Frequency</span>
          <span className="metro-stat-val">⚡ {frequency}</span>
        </div>
      </div>

      {/* Operational Timings */}
      <div className="metro-timing-bar">
        <span>🕒 Operational Hours: <strong>{timings}</strong></span>
        <span>🎟️ Pay via Metro Smart Card, WhatsApp, or Metro Token</span>
      </div>

      {/* Route Stops Toggle */}
      {routeStops.length > 0 && (
        <div className="metro-stops-wrap">
          <button
            type="button"
            className="metro-stops-toggle"
            onClick={() => setShowStations(prev => !prev)}
            aria-expanded={showStations}
          >
            <span>{showStations ? '▲ Hide Station Progression' : `▼ View Route Progression (${routeStops.length} Stops)`}</span>
          </button>

          {showStations && (
            <div className="metro-timeline">
              {routeStops.map((stn, idx) => {
                const isInterchange = stn.isInterchange || stn.name === interchangeStation;
                const isOrigin = idx === 0;
                const isDest = idx === routeStops.length - 1;
                const stnColor = getLineColor(stn.line || fromLine);

                return (
                  <div key={idx} className={`metro-stop-row ${isInterchange ? 'metro-stop-row--interchange' : ''}`}>
                    <div className="metro-stop-marker">
                      <span className="metro-stop-dot" style={{ background: stnColor.dot }}></span>
                    </div>
                    <div className="metro-stop-content">
                      <div className="metro-stop-name">
                        <strong>{stn.name}</strong>
                        {isOrigin && <span className="metro-role-pill">Origin</span>}
                        {isDest && <span className="metro-role-pill">Destination</span>}
                        {isInterchange && (
                          <span className="metro-interchange-badge">
                            🔄 Interchange ({stn.changeTo || 'Lines'})
                          </span>
                        )}
                      </div>
                      <span className="metro-stop-line-text" style={{ color: stnColor.text }}>
                        {stn.line || fromLine} Line
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
