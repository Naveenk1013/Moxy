import { useState } from 'react';
import { openWhatsApp, formatFoodShare } from '../../utils/whatsapp';

export default function StationFoodCard({ data }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'

  if (!data) return null;

  const {
    stationCode = 'SC',
    stationName = 'Secunderabad Junction',
    famousSpecialties = [],
    outlets = [],
    eCateringTips = 'Seat delivery available via IRCTC eCatering app or WhatsApp: 8750001323 at this station.',
  } = data;

  const filteredOutlets = outlets.filter(o => {
    if (filter === 'veg') return o.isVeg;
    if (filter === 'non-veg') return !o.isVeg;
    return true;
  });

  return (
    <div className="food-track-card" role="region" aria-label={`Food on Track for ${stationName}`}>
      {/* Header */}
      <div className="food-track-card__header">
        <div className="food-track-card__title-wrap">
          <span className="food-track-card__icon">🍱</span>
          <div>
            <div className="food-track-card__title">Food on Track & Culinary Radar</div>
            <div className="food-track-card__subtitle">{stationName} ({stationCode})</div>
          </div>
        </div>
        <div className="food-track-card__actions">
          <button
            type="button"
            className="food-whatsapp-btn"
            onClick={() => openWhatsApp(formatFoodShare(data))}
            title="Share station culinary guide on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            💬 WhatsApp
          </button>
          <span className="food-track-badge">STATION EATS</span>
        </div>
      </div>

      {/* Famous Regional Specialties */}
      {famousSpecialties.length > 0 && (
        <div className="food-specialties-bar">
          <span className="food-specialties-label">⭐ Must-Try Here:</span>
          <div className="food-specialties-chips">
            {famousSpecialties.map((item, idx) => (
              <span key={idx} className="food-specialty-pill">
                🍴 {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="food-filter-tabs">
        <button
          type="button"
          className={`food-filter-tab ${filter === 'all' ? 'food-filter-tab--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Outlets ({outlets.length})
        </button>
        <button
          type="button"
          className={`food-filter-tab ${filter === 'veg' ? 'food-filter-tab--active' : ''}`}
          onClick={() => setFilter('veg')}
        >
          🥬 Pure Veg
        </button>
        <button
          type="button"
          className={`food-filter-tab ${filter === 'non-veg' ? 'food-filter-tab--active' : ''}`}
          onClick={() => setFilter('non-veg')}
        >
          🍗 Biryani & Non-Veg
        </button>
      </div>

      {/* Outlets List */}
      <div className="food-outlets-grid">
        {filteredOutlets.map((outlet, idx) => (
          <div key={idx} className="food-outlet-item">
            <div className="food-outlet-item__top">
              <div className="food-outlet-item__name-wrap">
                <span className={`veg-indicator ${outlet.isVeg ? 'veg-indicator--veg' : 'veg-indicator--nonveg'}`}>
                  ●
                </span>
                <strong className="food-outlet-item__name">{outlet.name}</strong>
              </div>
              <span className="food-platform-badge">
                {outlet.platform ? `Platform ${outlet.platform}` : 'Concourse'}
              </span>
            </div>

            <div className="food-outlet-item__items">
              {outlet.highlights || outlet.description}
            </div>

            <div className="food-outlet-item__footer">
              <span className="food-outlet-price">💰 {outlet.priceRange || '₹80 - ₹250'}</span>
              <span className="food-outlet-rating">⭐ {outlet.rating || '4.5'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* IRCTC Seat Delivery eCatering Notice */}
      {eCateringTips && (
        <div className="food-ecatering-box">
          <div className="food-ecatering-title">
            <span>📲 Berths / Seat Food Delivery</span>
          </div>
          <p className="food-ecatering-text">{eCateringTips}</p>
        </div>
      )}
    </div>
  );
}
