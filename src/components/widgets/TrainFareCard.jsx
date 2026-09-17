export default function TrainFareCard({ data }) {
  if (!data) return null;

  const {
    TrainNumber,
    TrainName,
    From,
    To,
    Distance,
    TrainType = 'Superfast',
    Fares = [],
  } = data;

  return (
    <div className="fare-card" role="region" aria-label={`Train fare breakdown for train ${TrainNumber}`}>
      <div className="fare-card__header">
        <div className="fare-card__title-wrap">
          <span className="fare-card__icon">🎫</span>
          <div>
            <div className="fare-card__title">
              #{TrainNumber} {TrainName || 'Express'}
            </div>
            <div className="fare-card__sub">
              <span>{From} ➔ {To}</span>
              {Distance && <span> • {Distance}</span>}
              <span> • {TrainType}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fare-grid">
        {Fares.map((fare, idx) => (
          <div key={idx} className="fare-tile">
            <div className="fare-tile__code">{fare.Code}</div>
            <div className="fare-tile__name">{fare.Name}</div>
            <div className="fare-tile__price">₹{Number(fare.Fare).toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
