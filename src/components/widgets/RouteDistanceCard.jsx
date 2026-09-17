import { useState } from 'react';

export default function RouteDistanceCard({ data }) {
  const [showSteps, setShowSteps] = useState(false);
  if (!data) return null;

  const {
    origin = 'Origin',
    destination = 'Destination',
    distance = '0 km',
    duration = '0 mins',
    travelMode = 'DRIVE',
    routeName = '',
    steps = [],
    mapUrl = '',
  } = data;

  const getModeIcon = (mode) => {
    switch (mode?.toUpperCase()) {
      case 'WALK':
        return '🚶 Walking';
      case 'TWO_WHEELER':
        return '🛵 Two-Wheeler';
      case 'TRANSIT':
        return '🚌 Public Transit';
      default:
        return '🚗 Drive / Cab';
    }
  };

  const getStepIcon = (maneuver) => {
    if (!maneuver) return '➔';
    if (maneuver.includes('RIGHT')) return '↱';
    if (maneuver.includes('LEFT')) return '↰';
    if (maneuver.includes('UTURN')) return '⮌';
    if (maneuver.includes('MERGE') || maneuver.includes('FORK')) return '⑂';
    return '⬆';
  };

  return (
    <div className="route-card" role="region" aria-label={`Route from ${origin} to ${destination}`}>
      <div className="route-card__header">
        <div className="route-card__title-wrap">
          <span className="route-card__icon">🗺️</span>
          <div>
            <div className="route-card__type">Google Maps Precision Route</div>
            <div className="route-card__mode-badge">{getModeIcon(travelMode)}</div>
          </div>
        </div>
        <span className="route-card__tag">Verified Live</span>
      </div>

      <div className="route-card__path">
        <div className="route-card__node">
          <span className="route-card__dot route-card__dot--origin" />
          <div className="route-card__node-info">
            <span className="route-card__node-label">FROM</span>
            <strong className="route-card__node-name">{origin}</strong>
          </div>
        </div>

        <div className="route-card__connector">
          <span className="route-card__connector-line" />
          {routeName && (
            <span className="route-card__connector-via">via {routeName}</span>
          )}
        </div>

        <div className="route-card__node">
          <span className="route-card__dot route-card__dot--dest" />
          <div className="route-card__node-info">
            <span className="route-card__node-label">TO</span>
            <strong className="route-card__node-name">{destination}</strong>
          </div>
        </div>
      </div>

      <div className="route-card__metrics-grid">
        <div className="route-card__metric">
          <span className="route-card__metric-label">Estimated Time</span>
          <span className="route-card__metric-val route-card__metric-val--time">⏱️ {duration}</span>
        </div>
        <div className="route-card__metric">
          <span className="route-card__metric-label">Total Distance</span>
          <span className="route-card__metric-val">📍 {distance}</span>
        </div>
      </div>

      {steps && steps.length > 0 && (
        <div className="route-card__steps-section">
          <button
            type="button"
            className="route-card__steps-toggle"
            onClick={() => setShowSteps((prev) => !prev)}
            aria-expanded={showSteps}
          >
            <span>{showSteps ? '▲ Hide Turn-by-Turn Steps' : `▼ View Turn-by-Turn Directions (${steps.length} Steps)`}</span>
          </button>

          {showSteps && (
            <div className="route-card__timeline">
              {steps.map((st, idx) => (
                <div key={idx} className="route-card__step-item">
                  <span className="route-card__step-bullet">
                    {getStepIcon(st.maneuver)}
                  </span>
                  <div className="route-card__step-body">
                    <p className="route-card__step-text">{st.instruction}</p>
                    <div className="route-card__step-meta">
                      {st.distance && <span>{st.distance}</span>}
                      {st.duration && <span> • {st.duration}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {mapUrl && (
        <div className="route-card__actions">
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="route-card__map-btn"
          >
            📍 Open in Google Maps ➔
          </a>
        </div>
      )}
    </div>
  );
}
