import { useState, useEffect } from 'react';

export default function ConciergeToolsModal({ isOpen, onClose, onSelectAction, userLocation, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('route');

  // Flight tracker form state
  const [flightNum, setFlightNum] = useState('6E382');
  const [flightDep, setFlightDep] = useState('DEL');
  const [flightArr, setFlightArr] = useState('HYD');

  // PNR status form state
  const [pnrInput, setPnrInput] = useState('6719687062');

  // Live station board form state
  const [stationCode, setStationCode] = useState('SC');
  const [stationHours, setStationHours] = useState('2');

  // Train tracker form state
  const [trainNum, setTrainNum] = useState('12565');
  const [trainDate, setTrainDate] = useState('');

  // Seat availability form state
  const [seatTrainNum, setSeatTrainNum] = useState('12565');
  const [seatFrom, setSeatFrom] = useState('NDLS');
  const [seatTo, setSeatTo] = useState('HYB');
  const [seatClass, setSeatClass] = useState('3A');

  // Fare calculator form state
  const [fareTrainNum, setFareTrainNum] = useState('12565');
  const [fareFrom, setFareFrom] = useState('SEE');
  const [fareTo, setFareTo] = useState('NDLS');

  // Itinerary form state
  const [itinDest, setItinDest] = useState(userLocation?.city || 'Hyderabad');
  const [itinDays, setItinDays] = useState('3');
  const [itinBudget, setItinBudget] = useState('Moderate');
  const [itinStyle, setItinStyle] = useState('Culture & Culinary');

  // Route calculation form state
  const [routeOrigin, setRouteOrigin] = useState(
    userLocation?.address || userLocation?.city || 'IIHM Hyderabad, Hafeezpet'
  );
  const [routeDest, setRouteDest] = useState('Rajiv Gandhi International Airport (HYD)');
  const [routeMode, setRouteMode] = useState('DRIVE');

  // Weather forecast form state
  const [weatherLoc, setWeatherLoc] = useState(userLocation?.city || 'Hyderabad');

  // SOS Emergency state
  const [sosLoc, setSosLoc] = useState(userLocation?.city || 'Hyderabad');

  // Metro transit state
  const [metroFrom, setMetroFrom] = useState('Miyapur');
  const [metroTo, setMetroTo] = useState('Raidurg (Hitec City)');

  // Station Food state
  const [foodStn, setFoodStn] = useState('Secunderabad (SC)');

  // Currency & Split state
  const [currCode, setCurrCode] = useState('USD');
  const [currAmt, setCurrAmt] = useState('100');
  const [splitBill, setSplitBill] = useState('3500');

  useEffect(() => {
    if (userLocation) {
      if (userLocation.address || userLocation.city) {
        setRouteOrigin(userLocation.address || userLocation.city);
      }
      if (userLocation.city) {
        setWeatherLoc(userLocation.city);
        setItinDest(userLocation.city);
        setSosLoc(userLocation.city);
      }
    }
  }, [userLocation]);

  if (!isOpen) return null;

  const handleFlightSubmit = (e) => {
    e.preventDefault();
    if (flightNum.trim()) {
      onSelectAction(`Track flight ${flightNum.trim()}`);
    } else if (flightDep.trim() && flightArr.trim()) {
      onSelectAction(`Find flights from ${flightDep.trim().toUpperCase()} to ${flightArr.trim().toUpperCase()}`);
    }
    onClose();
  };

  const handlePnrSubmit = (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    const cleanPnr = pnrInput.replace(/[^0-9]/g, '');
    onSelectAction(`Check PNR status for ${cleanPnr}`);
    onClose();
  };

  const handleStationSubmit = (e) => {
    e.preventDefault();
    if (!stationCode.trim()) return;
    onSelectAction(`Show live station departures at ${stationCode.trim().toUpperCase()} for next ${stationHours} hours`);
    onClose();
  };

  const handleTrainSubmit = (e) => {
    e.preventDefault();
    if (!trainNum.trim()) return;
    const query = trainDate
      ? `Check live running status of train ${trainNum.trim()} for date ${trainDate}`
      : `Check live running status of train ${trainNum.trim()}`;
    onSelectAction(query);
    onClose();
  };

  const handleSeatSubmit = (e) => {
    e.preventDefault();
    if (!seatTrainNum.trim() || !seatFrom.trim() || !seatTo.trim()) return;
    const query = `Check seat availability for train ${seatTrainNum.trim()} from ${seatFrom.trim().toUpperCase()} to ${seatTo.trim().toUpperCase()} in class ${seatClass}`;
    onSelectAction(query);
    onClose();
  };

  const handleFareSubmit = (e) => {
    e.preventDefault();
    if (!fareTrainNum.trim() || !fareFrom.trim() || !fareTo.trim()) return;
    const query = `What is the train fare for train ${fareTrainNum.trim()} from ${fareFrom.trim().toUpperCase()} to ${fareTo.trim().toUpperCase()}?`;
    onSelectAction(query);
    onClose();
  };

  const handleItinerarySubmit = (e) => {
    e.preventDefault();
    if (!itinDest.trim()) return;
    const query = `Create a detailed ${itinDays}-day itinerary for ${itinDest.trim()} with a ${itinBudget.toLowerCase()} budget focusing on ${itinStyle}`;
    onSelectAction(query);
    onClose();
  };

  const handleRouteSubmit = (e) => {
    e.preventDefault();
    if (!routeOrigin.trim() || !routeDest.trim()) return;
    const query = `Calculate the distance, travel time, and route from ${routeOrigin.trim()} to ${routeDest.trim()} by ${routeMode.toLowerCase()}`;
    onSelectAction(query);
    onClose();
  };

  const handleWeatherSubmit = (e) => {
    e.preventDefault();
    if (!weatherLoc.trim()) return;
    const query = `What is the live weather forecast and temperature in ${weatherLoc.trim()}?`;
    onSelectAction(query);
    onClose();
  };

  const handleSosSubmit = (e) => {
    e.preventDefault();
    onSelectAction(`Show tourist emergency SOS numbers and safety helplines for ${sosLoc}`);
    onClose();
  };

  const handleMetroSubmit = (e) => {
    e.preventDefault();
    onSelectAction(`Plan Hyderabad Metro transit route from ${metroFrom} to ${metroTo}`);
    onClose();
  };

  const handleFoodSubmit = (e) => {
    e.preventDefault();
    onSelectAction(`Show station food on track and famous platform specialties for ${foodStn}`);
    onClose();
  };

  const handleCurrencySubmit = (e) => {
    e.preventDefault();
    onSelectAction(`Convert ${currAmt} ${currCode} to INR and split ₹${splitBill} bill`);
    onClose();
  };

  const handleQuickPrompt = (prompt) => {
    onSelectAction(prompt);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="concierge-modal" onClick={(e) => e.stopPropagation()}>
        <div className="concierge-modal__header">
          <div className="concierge-modal__title-wrap">
            <span className="concierge-modal__icon">✨</span>
            <div>
              <h2 className="concierge-modal__title">Concierge Toolkit</h2>
              <p className="concierge-modal__sub">Routes, Weather, PNR, Flights, Trains & Itineraries</p>
            </div>
          </div>
          <div className="concierge-modal__header-actions">
            {onToggleTheme && (
              <button
                type="button"
                className="c-header-theme-btn"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Luxury Dark Mode'}
                aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Luxury Dark Mode'}
              >
                <span>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</span>
              </button>
            )}
            <button type="button" className="concierge-modal__close" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        <div className="concierge-modal__tabs">
          <button
            type="button"
            className={`c-tab ${activeTab === 'route' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('route')}
          >
            🚗 Routes
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'weather' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('weather')}
          >
            ☀️ Weather
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'flights' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('flights')}
          >
            ✈️ Flights
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'pnr' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('pnr')}
          >
            🎟️ PNR Status
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'station' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('station')}
          >
            🚉 Station Board
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'train' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('train')}
          >
            🚆 Live Train
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'seats' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('seats')}
          >
            💺 Seat Avail
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'fare' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('fare')}
          >
            🎫 Train Fare
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'itinerary' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            🗺️ Itinerary
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'sos' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('sos')}
          >
            🚨 SOS Safety
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'metro' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('metro')}
          >
            🚇 Metro Guide
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'food' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            🍱 Station Food
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'currency' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('currency')}
          >
            💱 Currency & Split
          </button>
          <button
            type="button"
            className={`c-tab ${activeTab === 'iihm' ? 'c-tab--active' : ''}`}
            onClick={() => setActiveTab('iihm')}
          >
            🎓 IIHM Guide
          </button>
        </div>

        <div className="concierge-modal__body">
          {activeTab === 'route' && (
            <form onSubmit={handleRouteSubmit} className="c-form">
              <label className="c-label">
                <span>Origin (Starting Point)</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. IIHM Hyderabad, Hafeezpet"
                  value={routeOrigin}
                  onChange={(e) => setRouteOrigin(e.target.value)}
                  required
                />
              </label>

              <label className="c-label">
                <span>Destination</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. Rajiv Gandhi International Airport, Secunderabad Station"
                  value={routeDest}
                  onChange={(e) => setRouteDest(e.target.value)}
                  required
                />
              </label>

              <label className="c-label">
                <span>Travel Mode</span>
                <select
                  className="c-input"
                  value={routeMode}
                  onChange={(e) => setRouteMode(e.target.value)}
                >
                  <option value="DRIVE">🚗 Drive / Taxi</option>
                  <option value="TWO_WHEELER">🛵 Two-Wheeler (Bike/Scooter)</option>
                  <option value="TRANSIT">🚌 Public Transit / Metro</option>
                  <option value="WALK">🚶 Walking</option>
                </select>
              </label>

              <div className="c-quick-links">
                <span>Quick Origin: </span>
                {userLocation?.city && (
                  <button
                    type="button"
                    style={{ borderColor: 'var(--color-brand-400)', background: 'rgba(27,95,170,0.08)', fontWeight: '700' }}
                    onClick={() => {
                      setRouteOrigin(userLocation.address || userLocation.city);
                    }}
                  >
                    📍 My Location ({userLocation.city})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setRouteOrigin('IIHM Hyderabad, Hafeezpet');
                    setRouteDest('Rajiv Gandhi International Airport (HYD)');
                  }}
                >
                  IIHM ➔ HYD Airport
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRouteOrigin('IIHM Hyderabad, Hafeezpet');
                    setRouteDest('Secunderabad Railway Station');
                  }}
                >
                  IIHM ➔ Secunderabad Stn
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRouteOrigin('IIHM Hyderabad, Hafeezpet');
                    setRouteDest('Hitech City Cyber Towers');
                  }}
                >
                  IIHM ➔ Hitech City
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRouteOrigin('Charminar, Hyderabad');
                    setRouteDest('Golconda Fort, Hyderabad');
                  }}
                >
                  Charminar ➔ Golconda
                </button>
              </div>

              <button type="submit" className="c-submit-btn">
                🗺️ Calculate Route & Distance
              </button>
            </form>
          )}

          {activeTab === 'weather' && (
            <form onSubmit={handleWeatherSubmit} className="c-form">
              <label className="c-label">
                <span>City / Destination Location</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. Hyderabad, Secunderabad, Delhi, Goa, London"
                  value={weatherLoc}
                  onChange={(e) => setWeatherLoc(e.target.value)}
                  required
                />
              </label>

              <div className="c-quick-links">
                <span>Quick Select: </span>
                {userLocation?.city && (
                  <button
                    type="button"
                    style={{ borderColor: 'var(--color-brand-400)', background: 'rgba(27,95,170,0.08)', fontWeight: '700' }}
                    onClick={() => setWeatherLoc(userLocation.city)}
                  >
                    📍 My City ({userLocation.city})
                  </button>
                )}
                <button type="button" onClick={() => setWeatherLoc('Hyderabad')}>Hyderabad</button>
                <button type="button" onClick={() => setWeatherLoc('Secunderabad')}>Secunderabad</button>
                <button type="button" onClick={() => setWeatherLoc('Goa')}>Goa</button>
                <button type="button" onClick={() => setWeatherLoc('Delhi')}>New Delhi</button>
                <button type="button" onClick={() => setWeatherLoc('Mumbai')}>Mumbai</button>
                <button type="button" onClick={() => setWeatherLoc('London')}>London (UK)</button>
              </div>

              <button type="submit" className="c-submit-btn">
                ☀️ View Live Weather & Forecast
              </button>
            </form>
          )}

          {activeTab === 'flights' && (
            <form onSubmit={handleFlightSubmit} className="c-form">
              <label className="c-label">
                <span>Flight Number (IATA Code)</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. 6E382, AI101, EK524, UK955"
                  value={flightNum}
                  onChange={(e) => setFlightNum(e.target.value)}
                />
              </label>

              <div className="c-divider-text"><span>OR SEARCH BY ROUTE</span></div>

              <div className="c-row">
                <label className="c-label">
                  <span>Origin (City or Airport)</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. DEL, Delhi"
                    value={flightDep}
                    onChange={(e) => setFlightDep(e.target.value)}
                  />
                </label>
                <label className="c-label">
                  <span>Destination (City or Airport)</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. HYD, Hyderabad"
                    value={flightArr}
                    onChange={(e) => setFlightArr(e.target.value)}
                  />
                </label>
              </div>

              <div className="c-quick-links">
                <span>Popular: </span>
                <button type="button" onClick={() => { setFlightNum('6E382'); setFlightDep(''); setFlightArr(''); }}>6E382 (IndiGo)</button>
                <button type="button" onClick={() => { setFlightNum('AI101'); setFlightDep(''); setFlightArr(''); }}>AI101 (Air India)</button>
                <button type="button" onClick={() => { setFlightNum(''); setFlightDep('DEL'); setFlightArr('HYD'); }}>DEL ➔ HYD</button>
              </div>

              <button type="submit" className="c-submit-btn">
                ✈️ Track Live Flight
              </button>
            </form>
          )}

          {activeTab === 'pnr' && (
            <form onSubmit={handlePnrSubmit} className="c-form">
              <label className="c-label">
                <span>10-Digit PNR Number</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. 6719687062, 4528193041"
                  maxLength={10}
                  value={pnrInput}
                  onChange={(e) => setPnrInput(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                />
              </label>

              <div className="c-quick-links">
                <span>Sample PNRs: </span>
                <button type="button" onClick={() => setPnrInput('4344722640')}>4344722640 (KCG ➔ JAM)</button>
                <button type="button" onClick={() => setPnrInput('6719687062')}>6719687062 (Hate Bazare)</button>
                <button type="button" onClick={() => setPnrInput('4528193041')}>4528193041 (Telangana Exp)</button>
              </div>

              <button type="submit" className="c-submit-btn">
                🎟️ Check PNR Status
              </button>
            </form>
          )}

          {activeTab === 'station' && (
            <form onSubmit={handleStationSubmit} className="c-form">
              <label className="c-label">
                <span>Station Code</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. SC, HYB, NDLS, ST, ADI"
                  value={stationCode}
                  onChange={(e) => setStationCode(e.target.value.toUpperCase())}
                  required
                />
              </label>

              <label className="c-label">
                <span>Time Window</span>
                <select
                  className="c-input"
                  value={stationHours}
                  onChange={(e) => setStationHours(e.target.value)}
                >
                  <option value="1">Next 1 Hour</option>
                  <option value="2">Next 2 Hours</option>
                  <option value="4">Next 4 Hours</option>
                  <option value="8">Next 8 Hours</option>
                </select>
              </label>

              <div className="c-quick-links">
                <span>Popular Stations: </span>
                <button type="button" onClick={() => setStationCode('SC')}>SC (Secunderabad)</button>
                <button type="button" onClick={() => setStationCode('HYB')}>HYB (Hyderabad)</button>
                <button type="button" onClick={() => setStationCode('ST')}>ST (Surat)</button>
                <button type="button" onClick={() => setStationCode('ADI')}>ADI (Ahmedabad)</button>
                <button type="button" onClick={() => setStationCode('NDLS')}>NDLS (New Delhi)</button>
              </div>

              <button type="submit" className="c-submit-btn">
                🚉 View Live Station Board
              </button>
            </form>
          )}

          {activeTab === 'train' && (
            <form onSubmit={handleTrainSubmit} className="c-form">
              <label className="c-label">
                <span>Train Number</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. 22960, 12565, 12723, 12951"
                  value={trainNum}
                  onChange={(e) => setTrainNum(e.target.value)}
                  required
                />
              </label>
              <label className="c-label">
                <span>Date (Optional - YYYYMMDD)</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. 20260916 or leave blank for today"
                  value={trainDate}
                  onChange={(e) => setTrainDate(e.target.value)}
                />
              </label>
              <div className="c-quick-links">
                <span>Popular: </span>
                <button type="button" onClick={() => setTrainNum('22960')}>22960 (Surat – Jamnagar)</button>
                <button type="button" onClick={() => setTrainNum('12565')}>12565 (Bihar Sampark)</button>
                <button type="button" onClick={() => setTrainNum('12723')}>12723 (Telangana Exp)</button>
                <button type="button" onClick={() => setTrainNum('12951')}>12951 (Rajdhani)</button>
              </div>
              <button type="submit" className="c-submit-btn">
                🔍 Track Live Train Status
              </button>
            </form>
          )}

          {activeTab === 'seats' && (
            <form onSubmit={handleSeatSubmit} className="c-form">
              <label className="c-label">
                <span>Train Number</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. 12565"
                  value={seatTrainNum}
                  onChange={(e) => setSeatTrainNum(e.target.value)}
                  required
                />
              </label>
              <div className="c-row">
                <label className="c-label">
                  <span>From Station Code</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. NDLS, SC"
                    value={seatFrom}
                    onChange={(e) => setSeatFrom(e.target.value)}
                    required
                  />
                </label>
                <label className="c-label">
                  <span>To Station Code</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. HYB, DBG"
                    value={seatTo}
                    onChange={(e) => setSeatTo(e.target.value)}
                    required
                  />
                </label>
              </div>
              <label className="c-label">
                <span>Travel Class</span>
                <select
                  className="c-input"
                  value={seatClass}
                  onChange={(e) => setSeatClass(e.target.value)}
                >
                  <option value="3A">3A - AC 3 Tier</option>
                  <option value="2A">2A - AC 2 Tier</option>
                  <option value="1A">1A - AC First Class</option>
                  <option value="SL">SL - Sleeper</option>
                  <option value="CC">CC - AC Chair Car</option>
                  <option value="2S">2S - Second Seating</option>
                </select>
              </label>
              <button type="submit" className="c-submit-btn">
                💺 Check Seat Availability
              </button>
            </form>
          )}

          {activeTab === 'fare' && (
            <form onSubmit={handleFareSubmit} className="c-form">
              <label className="c-label">
                <span>Train Number</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. 12565"
                  value={fareTrainNum}
                  onChange={(e) => setFareTrainNum(e.target.value)}
                  required
                />
              </label>
              <div className="c-row">
                <label className="c-label">
                  <span>From Station Code</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. SEE, SC"
                    value={fareFrom}
                    onChange={(e) => setFareFrom(e.target.value)}
                    required
                  />
                </label>
                <label className="c-label">
                  <span>To Station Code</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. NDLS, HYB"
                    value={fareTo}
                    onChange={(e) => setFareTo(e.target.value)}
                    required
                  />
                </label>
              </div>
              <button type="submit" className="c-submit-btn">
                🎫 Calculate Train Fare
              </button>
            </form>
          )}

          {activeTab === 'itinerary' && (
            <form onSubmit={handleItinerarySubmit} className="c-form">
              <label className="c-label">
                <span>Destination City or Place</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. Hyderabad, Goa, Jaipur, Paris, Kerala"
                  value={itinDest}
                  onChange={(e) => setItinDest(e.target.value)}
                  required
                />
              </label>
              <div className="c-row">
                <label className="c-label">
                  <span>Days</span>
                  <select
                    className="c-input"
                    value={itinDays}
                    onChange={(e) => setItinDays(e.target.value)}
                  >
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="4">4 Days</option>
                    <option value="5">5 Days</option>
                    <option value="7">7 Days</option>
                  </select>
                </label>
                <label className="c-label">
                  <span>Budget Tier</span>
                  <select
                    className="c-input"
                    value={itinBudget}
                    onChange={(e) => setItinBudget(e.target.value)}
                  >
                    <option value="Budget">Budget</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </label>
              </div>
              <label className="c-label">
                <span>Focus / Interests</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. Food & Biryani, Heritage, Photography, Relax"
                  value={itinStyle}
                  onChange={(e) => setItinStyle(e.target.value)}
                />
              </label>
              <button type="submit" className="c-submit-btn">
                🗺️ Generate Interactive Itinerary
              </button>
            </form>
          )}

          {activeTab === 'sos' && (
            <form onSubmit={handleSosSubmit} className="c-form">
              <label className="c-label">
                <span>Your Location or City for Emergency Services</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. Hyderabad, Secunderabad Station, Hitec City"
                  value={sosLoc}
                  onChange={(e) => setSosLoc(e.target.value)}
                  required
                />
              </label>
              <div className="c-quick-chips">
                <span className="c-quick-chips__label">Quick Presets:</span>
                {['Hyderabad City', 'Secunderabad Jn', 'IIHM Hyderabad, Hafeezpet', 'Cyberabad / Hitec City', 'Delhi / NDLS'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="c-chip"
                    onClick={() => setSosLoc(city)}
                  >
                    📍 {city}
                  </button>
                ))}
              </div>
              <button type="submit" className="c-submit-btn c-submit-btn--danger">
                🚨 Access 24/7 Safety & Emergency Hub
              </button>
            </form>
          )}

          {activeTab === 'metro' && (
            <form onSubmit={handleMetroSubmit} className="c-form">
              <div className="c-form-row">
                <label className="c-label">
                  <span>Origin Station</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. Miyapur, Ameerpet, Nagole"
                    value={metroFrom}
                    onChange={(e) => setMetroFrom(e.target.value)}
                    required
                  />
                </label>
                <label className="c-label">
                  <span>Destination Station</span>
                  <input
                    type="text"
                    className="c-input"
                    placeholder="e.g. Raidurg (Hitec City), LB Nagar, MGBS"
                    value={metroTo}
                    onChange={(e) => setMetroTo(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="c-quick-chips">
                <span className="c-quick-chips__label">Popular Metro Routes:</span>
                {[
                  { from: 'Miyapur', to: 'Raidurg (Hitec City)' },
                  { from: 'Secunderabad East', to: 'Hitec City' },
                  { from: 'Ameerpet', to: 'MGBS (Charminar)' },
                  { from: 'Nagole', to: 'Raidurg' },
                ].map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    className="c-chip"
                    onClick={() => {
                      setMetroFrom(r.from);
                      setMetroTo(r.to);
                    }}
                  >
                    🚇 {r.from} ➔ {r.to}
                  </button>
                ))}
              </div>
              <button type="submit" className="c-submit-btn">
                🚇 Plan Hyderabad Metro Route & Fares
              </button>
            </form>
          )}

          {activeTab === 'food' && (
            <form onSubmit={handleFoodSubmit} className="c-form">
              <label className="c-label">
                <span>Railway Station Code or City</span>
                <input
                  type="text"
                  className="c-input"
                  placeholder="e.g. SC, Secunderabad, HYB, ST, NDLS, Surat"
                  value={foodStn}
                  onChange={(e) => setFoodStn(e.target.value)}
                  required
                />
              </label>
              <div className="c-quick-chips">
                <span className="c-quick-chips__label">Popular Hubs:</span>
                {['Secunderabad (SC)', 'Hyderabad Deccan (HYB)', 'Surat (ST)', 'New Delhi (NDLS)', 'Vijayawada (BZA)'].map((stn) => (
                  <button
                    key={stn}
                    type="button"
                    className="c-chip"
                    onClick={() => setFoodStn(stn)}
                  >
                    🍱 {stn}
                  </button>
                ))}
              </div>
              <button type="submit" className="c-submit-btn">
                🍱 Find Food on Track & Platform Delicacies
              </button>
            </form>
          )}

          {activeTab === 'currency' && (
            <form onSubmit={handleCurrencySubmit} className="c-form">
              <div className="c-form-row">
                <label className="c-label">
                  <span>Foreign Currency</span>
                  <select
                    className="c-input"
                    value={currCode}
                    onChange={(e) => setCurrCode(e.target.value)}
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                    <option value="SAR">SAR (﷼) - Saudi Riyal</option>
                    <option value="SGD">SGD ($) - Singapore Dollar</option>
                    <option value="CAD">CAD ($) - Canadian Dollar</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                  </select>
                </label>
                <label className="c-label">
                  <span>Amount to Convert</span>
                  <input
                    type="number"
                    className="c-input"
                    value={currAmt}
                    onChange={(e) => setCurrAmt(e.target.value)}
                    min="1"
                    required
                  />
                </label>
              </div>
              <label className="c-label">
                <span>Trip Bill Amount to Split in INR (₹)</span>
                <input
                  type="number"
                  className="c-input"
                  value={splitBill}
                  onChange={(e) => setSplitBill(e.target.value)}
                  min="0"
                  step="50"
                  placeholder="e.g. 3500 for dinner or cab"
                />
              </label>
              <button type="submit" className="c-submit-btn">
                💱 Convert Currency & Calculate Split
              </button>
            </form>
          )}

          {activeTab === 'iihm' && (
            <div className="c-quick-grid">
              <button
                type="button"
                className="c-quick-tile"
                onClick={() => handleQuickPrompt('What courses and degree programs are offered at IIHM Hyderabad?')}
              >
                <span className="c-quick-tile__icon">🎓</span>
                <strong>Hyderabad Courses</strong>
                <span>BHM&CT, West London Degree, SBTET</span>
              </button>

              <button
                type="button"
                className="c-quick-tile"
                onClick={() => handleQuickPrompt('How do I apply for admissions through eCHAT?')}
              >
                <span className="c-quick-tile__icon">📋</span>
                <strong>Admission & eCHAT</strong>
                <span>Process, eligibility & registration</span>
              </button>

              <button
                type="button"
                className="c-quick-tile"
                onClick={() => handleQuickPrompt('Where is IIHM Hyderabad campus and how do I contact the team?')}
              >
                <span className="c-quick-tile__icon">📍</span>
                <strong>Campus Location & Contacts</strong>
                <span>Hafeezpet campus details & phones</span>
              </button>

              <button
                type="button"
                className="c-quick-tile"
                onClick={() => handleQuickPrompt('Tell me about IIHM placements, recruiters and the Young Chef Olympiad')}
              >
                <span className="c-quick-tile__icon">🏆</span>
                <strong>Placements & YCO</strong>
                <span>Global career network & recruiters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
