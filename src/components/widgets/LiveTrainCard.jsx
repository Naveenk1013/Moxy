import { useState } from 'react';

export default function LiveTrainCard({ data }) {
  const [showFullRoute, setShowFullRoute] = useState(false);
  if (!data) return null;

  const {
    TrainNumber,
    TrainName,
    StartDate,
    CurrentStation,
    TrainRoute = [],
    CurrentPosition,
  } = data;

  const delayText = CurrentStation?.DelayInArrival || '00 M';
  const isDelayed = delayText && delayText !== '-' && delayText !== '00 M' && !delayText.startsWith('0');

  return (
    <div className="train-card" role="region" aria-label={`Live train status for ${TrainNumber}`}>
      <div className="train-card__header">
        <div className="train-card__title-wrap">
          <span className="train-card__icon">🚆</span>
          <div>
            <div className="train-card__number">
              Train #{TrainNumber}
              {data.isLiveTelemetry && (
                <span className="live-telemetry-pill">● LIVE GPS</span>
              )}
            </div>
            <div className="train-card__name">{TrainName || 'Express Service'}</div>
          </div>
        </div>
        <span className={`train-badge ${isDelayed ? 'train-badge--delayed' : 'train-badge--ontime'}`}>
          {isDelayed ? `Delayed ${delayText}` : 'On Time'}
        </span>
      </div>

      <div className="train-card__meta">
        <span>📅 Journey Date: <strong>{StartDate}</strong></span>
        {CurrentPosition && <span>📍 {CurrentPosition}</span>}
      </div>

      {CurrentStation && (
        <div className="train-station-box">
          <div className="train-station-box__badge">CURRENT STATION</div>
          <div className="train-station-box__main">
            <div className="train-station-box__name">
              {CurrentStation.StationName} <span className="train-station-box__code">({CurrentStation.StationCode})</span>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {CurrentStation.Platform && (
                <span className="train-station-box__dist">Platform {CurrentStation.Platform}</span>
              )}
              {CurrentStation.Distance && (
                <span className="train-station-box__dist">{CurrentStation.Distance}</span>
              )}
            </div>
          </div>

          <div className="train-timing-grid">
            <div className="train-timing-cell">
              <span className="train-timing-cell__label">Scheduled Arr</span>
              <span className="train-timing-cell__val">{CurrentStation.ScheduleArrival || '-'}</span>
            </div>
            <div className="train-timing-cell">
              <span className="train-timing-cell__label">Actual Arr</span>
              <span className="train-timing-cell__val train-timing-cell__val--actual">
                {CurrentStation.ActualArrival || '-'}
              </span>
            </div>
            <div className="train-timing-cell">
              <span className="train-timing-cell__label">Scheduled Dep</span>
              <span className="train-timing-cell__val">{CurrentStation.ScheduleDeparture || '-'}</span>
            </div>
            <div className="train-timing-cell">
              <span className="train-timing-cell__label">Actual Dep</span>
              <span className="train-timing-cell__val train-timing-cell__val--actual">
                {CurrentStation.ActualDeparture || '-'}
              </span>
            </div>
          </div>
        </div>
      )}

      {TrainRoute.length > 0 && (
        <div className="train-route-section">
          <button
            type="button"
            className="train-route-toggle"
            onClick={() => setShowFullRoute((prev) => !prev)}
            aria-expanded={showFullRoute}
          >
            <span>{showFullRoute ? '▲ Hide Full Route' : `▼ View Full Route (${TrainRoute.length} Stations)`}</span>
          </button>

          {showFullRoute && (
            <div className="train-timeline">
              {TrainRoute.map((st, idx) => {
                const isCurrent =
                  CurrentStation &&
                  (st.StationCode === CurrentStation.StationCode ||
                    st.StationName === CurrentStation.StationName);
                const isDeparted = st.IsDeparted === 'YES';

                return (
                  <div
                    key={idx}
                    className={`train-timeline__stop ${
                      isCurrent ? 'train-timeline__stop--current' : ''
                    } ${isDeparted ? 'train-timeline__stop--departed' : ''}`}
                  >
                    <div className="train-timeline__bullet">
                      {isCurrent ? '📍' : isDeparted ? '✓' : '○'}
                    </div>
                    <div className="train-timeline__info">
                      <div className="train-timeline__top">
                        <strong>{st.StationName} ({st.StationCode})</strong>
                        <span className="train-timeline__day">Day {st.Day}</span>
                      </div>
                      <div className="train-timeline__times">
                        <span>Arr: {st.ActualArrival || st.ScheduleArrival}</span>
                        <span>Dep: {st.ActualDeparture || st.ScheduleDeparture}</span>
                        {st.Platform && <span>Plat {st.Platform}</span>}
                        {st.DelayInArrival && st.DelayInArrival !== '-' && (
                          <span className="train-timeline__delay">Delay: {st.DelayInArrival}</span>
                        )}
                      </div>
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
