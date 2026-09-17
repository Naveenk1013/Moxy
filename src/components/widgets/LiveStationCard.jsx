import { useState } from 'react';

export default function LiveStationCard({ data }) {
  const [filterType, setFilterType] = useState('ALL');

  if (!data || !Array.isArray(data.trains)) return null;

  const { stationCode = 'SC', stationName = 'Secunderabad Jn', hours = 2, trains = [] } = data;

  const filteredTrains = trains.filter((t) => {
    if (filterType === 'ALL') return true;
    const type = (t.trainType || '').toUpperCase();
    if (filterType === 'SF') return type.includes('SUPERFAST') || type.includes('MAIL') || type.includes('EXPRESS');
    if (filterType === 'PREMIUM') return type.includes('RAJDHANI') || type.includes('VANDE') || type.includes('SHATABDI');
    if (filterType === 'LOCAL') return type.includes('SUBURBAN') || type.includes('MEMU') || type.includes('LOCAL') || type.includes('PASSENGER');
    return true;
  });

  const getTrainTypeBadge = (type = '') => {
    const s = type.toUpperCase();
    if (s.includes('RAJDHANI') || s.includes('VANDE') || s.includes('SHATABDI')) {
      return <span className="st-type-badge st-type-badge--premium">⚡ {type}</span>;
    }
    if (s.includes('SUPERFAST') || s.includes('SF')) {
      return <span className="st-type-badge st-type-badge--sf">🚀 {type}</span>;
    }
    if (s.includes('SUBURBAN') || s.includes('MEMU') || s.includes('LOCAL')) {
      return <span className="st-type-badge st-type-badge--local">🚉 {type}</span>;
    }
    return <span className="st-type-badge st-type-badge--express">🚆 {type || 'Express'}</span>;
  };

  const formatClock = (timeStr) => {
    if (!timeStr || timeStr === '00:00' || timeStr === 'Source') return 'Source / Start';
    if (timeStr === '24:00' || timeStr === 'Destination') return 'Destination';
    return timeStr;
  };

  return (
    <div className="station-card" role="region" aria-label={`Live Station Board for ${stationCode}`}>
      {/* Station Header */}
      <div className="station-card__header">
        <div className="station-card__title-wrap">
          <span className="station-card__icon">🚉</span>
          <div>
            <div className="station-card__name">
              {stationName} <span className="station-card__code">[{stationCode}]</span>
            </div>
            <div className="station-card__subtitle">
              Live Station Departure & Arrival Board • Next {hours}h
            </div>
          </div>
        </div>

        <div className="station-card__live-pill">
          <span className="st-pulse-dot" />
          <span>LIVE BOARD</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="station-card__filters">
        <button
          type="button"
          className={`st-filter-btn ${filterType === 'ALL' ? 'st-filter-btn--active' : ''}`}
          onClick={() => setFilterType('ALL')}
        >
          All ({trains.length})
        </button>
        <button
          type="button"
          className={`st-filter-btn ${filterType === 'SF' ? 'st-filter-btn--active' : ''}`}
          onClick={() => setFilterType('SF')}
        >
          Express / SF
        </button>
        <button
          type="button"
          className={`st-filter-btn ${filterType === 'PREMIUM' ? 'st-filter-btn--active' : ''}`}
          onClick={() => setFilterType('PREMIUM')}
        >
          Premium
        </button>
        <button
          type="button"
          className={`st-filter-btn ${filterType === 'LOCAL' ? 'st-filter-btn--active' : ''}`}
          onClick={() => setFilterType('LOCAL')}
        >
          Suburban / Local
        </button>
      </div>

      {/* Train List */}
      <div className="station-card__list">
        {filteredTrains.length === 0 ? (
          <div className="station-card__empty">No trains scheduled in this category for the next {hours} hours.</div>
        ) : (
          filteredTrains.slice(0, 8).map((t, idx) => (
            <div key={`${t.trainNumber}-${idx}`} className="st-train-item">
              <div className="st-train-item__top">
                <div className="st-train-item__info">
                  <span className="st-train-number">#{t.trainNumber}</span>
                  <span className="st-train-name">{t.trainName}</span>
                </div>
                {getTrainTypeBadge(t.trainType)}
              </div>

              <div className="st-train-item__timings">
                <div className="st-timing-col">
                  <span className="st-time-label">Arrival</span>
                  <span className="st-time-val">{formatClock(t.arrivalTime)}</span>
                </div>
                <div className="st-timing-divider">➔</div>
                <div className="st-timing-col st-timing-col--dep">
                  <span className="st-time-label">Departure</span>
                  <span className="st-time-val st-time-val--dep">{formatClock(t.departureTime)}</span>
                </div>
              </div>

              {Array.isArray(t.classes) && t.classes.length > 0 && (
                <div className="st-train-item__classes">
                  <span className="st-class-label">Classes:</span>
                  <div className="st-class-pills">
                    {t.classes.slice(0, 6).map((c, cIdx) => (
                      <span key={cIdx} className="st-class-chip" title={c.name || c.value}>
                        {c.value || c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {trains.length > 8 && (
        <div className="station-card__footer-note">
          Showing top 8 of {trains.length} live trains in this window.
        </div>
      )}
    </div>
  );
}
