import { useState } from 'react';
import { openWhatsApp, formatSosShare } from '../../utils/whatsapp';

export default function EmergencySOSCard({ data }) {
  const [activeTab, setActiveTab] = useState('helplines'); // 'helplines' | 'facilities'

  if (!data) return null;

  const {
    location = 'Hyderabad & India',
    helplines = [],
    nearbyHospitals = [],
    policeStations = [],
    safetyTips = [],
  } = data;

  return (
    <div className="sos-card" role="region" aria-label="Tourist Emergency & SOS Helplines">
      {/* Header */}
      <div className="sos-card__header">
        <div className="sos-card__title-wrap">
          <span className="sos-card__icon">🚨</span>
          <div>
            <div className="sos-card__title">Tourist Emergency & Safety Hub</div>
            <div className="sos-card__subtitle">24/7 Verified Helplines • {location}</div>
          </div>
        </div>
        <div className="sos-card__actions">
          <button
            type="button"
            className="sos-whatsapp-btn"
            onClick={() => openWhatsApp(formatSosShare(data))}
            title="Share verified emergency helplines on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            💬 Share Helplines
          </button>
          <span className="sos-badge">EMERGENCY SOS</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="sos-tabs">
        <button
          type="button"
          className={`sos-tab ${activeTab === 'helplines' ? 'sos-tab--active' : ''}`}
          onClick={() => setActiveTab('helplines')}
        >
          📞 National Helplines ({helplines.length})
        </button>
        <button
          type="button"
          className={`sos-tab ${activeTab === 'facilities' ? 'sos-tab--active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          🏥 Nearby Facilities ({nearbyHospitals.length + policeStations.length})
        </button>
      </div>

      {/* Helplines List */}
      {activeTab === 'helplines' && (
        <div className="sos-grid">
          {helplines.map((h, idx) => (
            <div key={idx} className="sos-tile">
              <div className="sos-tile__info">
                <span className="sos-tile__icon">{h.icon || '📞'}</span>
                <div>
                  <div className="sos-tile__name">{h.name}</div>
                  <div className="sos-tile__desc">{h.description}</div>
                </div>
              </div>
              <a
                href={`tel:${h.number.replace(/[^0-9+]/g, '')}`}
                className="sos-dial-btn"
                title={`Call ${h.name} (${h.number})`}
              >
                <span>Call {h.number}</span>
                <span className="sos-dial-arrow">➔</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Facilities List */}
      {activeTab === 'facilities' && (
        <div className="sos-facilities">
          {nearbyHospitals.length > 0 && (
            <div className="sos-facility-sec">
              <div className="sos-facility-sec__title">🏥 24/7 Hospitals & Trauma Centers</div>
              <div className="sos-facility-list">
                {nearbyHospitals.map((hosp, idx) => (
                  <div key={idx} className="sos-facility-item">
                    <div className="sos-facility-item__main">
                      <strong>{hosp.name}</strong>
                      <span className="sos-facility-item__area">📍 {hosp.area} • {hosp.distance}</span>
                    </div>
                    {hosp.phone && (
                      <a href={`tel:${hosp.phone}`} className="sos-mini-call-btn">
                        📞 {hosp.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {policeStations.length > 0 && (
            <div className="sos-facility-sec">
              <div className="sos-facility-sec__title">👮 Police Stations & Tourist Patrols</div>
              <div className="sos-facility-list">
                {policeStations.map((pol, idx) => (
                  <div key={idx} className="sos-facility-item">
                    <div className="sos-facility-item__main">
                      <strong>{pol.name}</strong>
                      <span className="sos-facility-item__area">📍 {pol.area} • {pol.distance}</span>
                    </div>
                    {pol.phone && (
                      <a href={`tel:${pol.phone}`} className="sos-mini-call-btn">
                        📞 {pol.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety Tips Footer */}
      {safetyTips.length > 0 && (
        <div className="sos-footer-tip">
          <span className="sos-tip-icon">💡</span>
          <span><strong>Safety Tip:</strong> {safetyTips[0]}</span>
        </div>
      )}
    </div>
  );
}
