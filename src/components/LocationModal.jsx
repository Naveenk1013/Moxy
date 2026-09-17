import { useState } from 'react';
import { POPULAR_LOCATIONS, detectBrowserLocation, setManualLocation } from '../utils/geolocation';

export default function LocationModal({ isOpen, onClose, currentLocation, onLocationChanged }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleGpsDetect = async () => {
    setIsDetecting(true);
    setErrorMsg('');
    try {
      const loc = await detectBrowserLocation();
      onLocationChanged(loc);
      setTimeout(() => {
        onClose();
      }, 400);
    } catch (err) {
      console.warn('GPS detection failed:', err);
      setErrorMsg(err.message || 'Unable to access GPS location. Please choose a city below.');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectPreset = (preset) => {
    const loc = setManualLocation(preset);
    onLocationChanged(loc);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const loc = setManualLocation(customInput.trim());
    onLocationChanged(loc);
    setCustomInput('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="location-modal" onClick={(e) => e.stopPropagation()}>
        <div className="location-modal__header">
          <div className="location-modal__title-wrap">
            <span className="location-modal__icon">📍</span>
            <div>
              <h2 className="location-modal__title">Your Location</h2>
              <p className="location-modal__sub">Moxy uses this for instant routes, weather & local recommendations</p>
            </div>
          </div>
          <button type="button" className="location-modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Current Active Location Card */}
        <div className="location-modal__current-card">
          <div className="location-modal__current-left">
            <span className="location-modal__pin-pulse" />
            <div>
              <div className="location-modal__current-city">
                {currentLocation?.address || currentLocation?.city || 'Hyderabad'}
              </div>
              <div className="location-modal__current-meta">
                {currentLocation?.source === 'gps' ? (
                  <span className="loc-badge loc-badge--gps">🛰️ GPS Auto-Detected</span>
                ) : currentLocation?.source === 'manual' ? (
                  <span className="loc-badge loc-badge--manual">📍 Selected City</span>
                ) : (
                  <span className="loc-badge loc-badge--default">🎓 IIHM Flagship Default</span>
                )}
                {currentLocation?.latitude && currentLocation?.longitude && (
                  <span className="loc-coords">
                    {currentLocation.latitude.toFixed(2)}°N, {currentLocation.longitude.toFixed(2)}°E
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GPS Detect Action */}
        <div className="location-modal__actions">
          <button
            type="button"
            className="loc-gps-btn"
            onClick={handleGpsDetect}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <span className="loc-spinner" />
                <span>Detecting your coordinates...</span>
              </>
            ) : (
              <>
                <span className="loc-gps-icon">🛰️</span>
                <span>Auto-Detect Current GPS Location</span>
              </>
            )}
          </button>

          {errorMsg && <div className="location-modal__error">{errorMsg}</div>}
        </div>

        {/* Custom Location Search */}
        <form onSubmit={handleCustomSubmit} className="location-modal__search-form">
          <input
            type="text"
            className="location-modal__search-input"
            placeholder="Type any city or neighborhood (e.g. Banjara Hills, Jaipur, Paris)..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          <button type="submit" className="location-modal__search-btn" disabled={!customInput.trim()}>
            Set
          </button>
        </form>

        {/* Preset Cities Grid */}
        <div className="location-modal__presets-section">
          <h3 className="location-modal__presets-title">Popular Campuses & Cities</h3>
          <div className="location-modal__presets-grid">
            {POPULAR_LOCATIONS.map((preset) => {
              const isSelected =
                currentLocation?.city?.toLowerCase() === preset.city.toLowerCase();
              return (
                <button
                  key={preset.city}
                  type="button"
                  className={`loc-preset-tile ${isSelected ? 'loc-preset-tile--active' : ''}`}
                  onClick={() => handleSelectPreset(preset)}
                >
                  <div className="loc-preset-tile__header">
                    <span className="loc-preset-tile__city">{preset.city}</span>
                    {isSelected && <span className="loc-preset-tile__check">✓</span>}
                  </div>
                  <div className="loc-preset-tile__sub">{preset.locality}</div>
                  <div className="loc-preset-tile__badge">{preset.badge}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
