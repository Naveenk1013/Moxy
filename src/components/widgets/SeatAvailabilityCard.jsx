export default function SeatAvailabilityCard({ data }) {
  if (!data) return null;

  const {
    TrainNo,
    TrainName,
    From,
    To,
    ClassCode = '3A',
    Quota = 'GN',
    Availability = [],
  } = data;

  const getStatusClass = (statusStr = '') => {
    const s = statusStr.toUpperCase();
    if (s.includes('AVAILABLE') || s.includes('CURR_AVBL')) return 'avail-badge--available';
    if (s.includes('RAC')) return 'avail-badge--rac';
    if (s.includes('WL') || s.includes('WAITLIST')) return 'avail-badge--wl';
    if (s.includes('REGRET') || s.includes('NOT AVAILABLE')) return 'avail-badge--regret';
    return 'avail-badge--neutral';
  };

  return (
    <div className="avail-card" role="region" aria-label={`Seat availability for train ${TrainNo}`}>
      <div className="avail-card__header">
        <div className="avail-card__title-wrap">
          <span className="avail-card__icon">💺</span>
          <div>
            <div className="avail-card__train-num">Train #{TrainNo} {TrainName ? `• ${TrainName}` : ''}</div>
            <div className="avail-card__route">
              <span className="route-code">{From}</span> ➔ <span className="route-code">{To}</span>
            </div>
          </div>
        </div>
        <div className="avail-card__badges">
          <span className="class-badge">{ClassCode}</span>
          <span className="quota-badge">{Quota === 'GN' ? 'General' : Quota}</span>
        </div>
      </div>

      <div className="avail-card__list">
        {Availability.map((item, idx) => {
          const statusClass = getStatusClass(item.Availability);
          const confirmPercent = parseInt(item.Confirm) || (item.Availability.includes('AVAILABLE') ? 100 : 50);

          return (
            <div key={idx} className="avail-row">
              <div className="avail-row__date">
                <span className="avail-row__day-icon">📅</span>
                <strong>{item.JourneyDate}</strong>
              </div>

              <div className="avail-row__status-wrap">
                <span className={`avail-badge ${statusClass}`}>
                  {item.Availability}
                </span>

                {item.Confirm && (
                  <div className="confirm-pill" title="Probability of confirmation">
                    <div className="confirm-pill__bar" style={{ width: `${confirmPercent}%` }} />
                    <span className="confirm-pill__text">{item.Confirm} Confirm</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
