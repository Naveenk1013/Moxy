import { useState } from 'react';

export default function FlightCard({ data }) {
  if (!data || !Array.isArray(data.flights) || data.flights.length === 0) return null;

  const [activeIndex, setActiveIndex] = useState(0);
  const flights = data.flights;
  const currentFlight = flights[activeIndex] || flights[0];

  const formatFlightTime = (isoString) => {
    if (!isoString) return '--:--';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status = 'scheduled') => {
    const s = String(status).toLowerCase();
    if (s === 'active' || s === 'in-air') {
      return <span className="flight-badge flight-badge--active">🟢 In Air</span>;
    }
    if (s === 'landed') {
      return <span className="flight-badge flight-badge--landed">✅ Landed</span>;
    }
    if (s === 'scheduled') {
      return <span className="flight-badge flight-badge--scheduled">🗓️ Scheduled</span>;
    }
    if (s === 'cancelled') {
      return <span className="flight-badge flight-badge--cancelled">❌ Cancelled</span>;
    }
    if (s === 'incident' || s === 'diverted') {
      return <span className="flight-badge flight-badge--delayed">⚠️ Diverted</span>;
    }
    return <span className="flight-badge flight-badge--scheduled">{status.toUpperCase()}</span>;
  };

  const {
    airline = {},
    flight = {},
    departure = {},
    arrival = {},
    flight_status = 'scheduled',
    flight_date,
    aircraft = {},
    live,
  } = currentFlight;

  const depDelay = departure.delay ? `${departure.delay}m delay` : null;
  const arrDelay = arrival.delay ? `${arrival.delay}m delay` : null;

  return (
    <div className="flight-card" role="region" aria-label={`Flight status for ${flight.iata || 'flight'}`}>
      <div className="flight-card__header">
        <div className="flight-card__airline-wrap">
          <span className="flight-card__icon">✈️</span>
          <div>
            <div className="flight-card__code">
              {flight.iata || flight.number || 'Flight'}
            </div>
            <div className="flight-card__airline-name">
              {airline.name || 'Commercial Airline'}
            </div>
          </div>
        </div>
        <div>
          {getStatusBadge(flight_status)}
        </div>
      </div>

      {flight_date && (
        <div className="flight-card__date">
          <span>📅 Date: <strong>{flight_date}</strong></span>
          {aircraft.iata && <span>🛩️ Aircraft: {aircraft.iata} ({aircraft.registration || 'Active'})</span>}
        </div>
      )}

      <div className="flight-route-box">
        {/* Departure */}
        <div className="flight-point">
          <div className="flight-point__iata">{departure.iata || 'DEP'}</div>
          <div className="flight-point__time">{formatFlightTime(departure.estimated || departure.scheduled)}</div>
          <div className="flight-point__airport" title={departure.airport}>
            {departure.airport || 'Departure Airport'}
          </div>
          <div className="flight-point__chips">
            {departure.terminal && <span className="fp-chip">Term {departure.terminal}</span>}
            {departure.gate && <span className="fp-chip">Gate {departure.gate}</span>}
            {depDelay && <span className="fp-chip fp-chip--delay">{depDelay}</span>}
          </div>
        </div>

        {/* Center line with airplane */}
        <div className="flight-middle">
          <div className="flight-middle__line" />
          <div className="flight-middle__plane">✈</div>
          <div className="flight-middle__type">Non-Stop</div>
        </div>

        {/* Arrival */}
        <div className="flight-point flight-point--arr">
          <div className="flight-point__iata">{arrival.iata || 'ARR'}</div>
          <div className="flight-point__time">{formatFlightTime(arrival.estimated || arrival.scheduled)}</div>
          <div className="flight-point__airport" title={arrival.airport}>
            {arrival.airport || 'Arrival Airport'}
          </div>
          <div className="flight-point__chips">
            {arrival.terminal && <span className="fp-chip">Term {arrival.terminal}</span>}
            {arrival.gate && <span className="fp-chip">Gate {arrival.gate}</span>}
            {arrival.baggage && <span className="fp-chip fp-chip--baggage">🧳 {arrival.baggage}</span>}
            {arrDelay && <span className="fp-chip fp-chip--delay">{arrDelay}</span>}
          </div>
        </div>
      </div>

      {/* Live telemetry if available */}
      {live && (
        <div className="flight-live-telemetry">
          <span>📍 Altitude: <strong>{live.altitude ? `${live.altitude.toLocaleString()} ft` : 'Cruising'}</strong></span>
          <span>⚡ Speed: <strong>{live.speed_horizontal ? `${Math.round(live.speed_horizontal)} km/h` : 'En Route'}</strong></span>
        </div>
      )}

      {/* Multiple flight switcher if route search */}
      {flights.length > 1 && (
        <div className="flight-card__switcher">
          <span className="flight-card__switch-label">Available Flights ({flights.length}):</span>
          <div className="flight-card__pills">
            {flights.map((f, idx) => (
              <button
                key={idx}
                type="button"
                className={`flight-pill-btn ${activeIndex === idx ? 'flight-pill-btn--active' : ''}`}
                onClick={() => setActiveIndex(idx)}
              >
                {f.flight?.iata || f.airline?.name?.slice(0, 8) || `Flight #${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
