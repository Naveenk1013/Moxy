export default function PlaceGuideCard({ data }) {
  if (!data) return null;

  const {
    placeName,
    tagline,
    highlights = [],
    bestTimeToVisit,
    localSpecialty,
  } = data;

  return (
    <div className="guide-card" role="region" aria-label={`Guide for ${placeName}`}>
      <div className="guide-card__header">
        <div className="guide-card__icon">🏛️</div>
        <div>
          <h3 className="guide-card__title">{placeName}</h3>
          <p className="guide-card__tagline">{tagline || `City & Travel Guide`}</p>
        </div>
      </div>

      <div className="guide-card__grid">
        {highlights.map((item, idx) => (
          <div key={idx} className="guide-tile">
            <div className="guide-tile__name">{item.name}</div>
            <p className="guide-tile__desc">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="guide-card__footer">
        {bestTimeToVisit && (
          <div className="guide-card__pill">
            <span>🗓️ <strong>Best Time:</strong> {bestTimeToVisit}</span>
          </div>
        )}
        {localSpecialty && (
          <div className="guide-card__pill">
            <span>✨ <strong>Must Experience:</strong> {localSpecialty}</span>
          </div>
        )}
      </div>
    </div>
  );
}
