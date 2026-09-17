export default function WeatherCard({ data }) {
  if (!data) return null;

  const {
    location = 'Location',
    temperature = 28,
    apparentTemperature = 30,
    condition = 'Clear & Pleasant',
    weatherCode = 0,
    humidity = 55,
    windSpeed = 10,
    precipitation = 0,
    daily = [],
  } = data;

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '⛅';
  };

  return (
    <div className="weather-card" role="region" aria-label={`Weather forecast for ${location}`}>
      <div className="weather-card__header">
        <div className="weather-card__location-wrap">
          <span className="weather-card__pin">📍</span>
          <div>
            <div className="weather-card__location">{location}</div>
            <div className="weather-card__condition">{condition}</div>
          </div>
        </div>
        <div className="weather-card__main-icon">{getWeatherIcon(weatherCode)}</div>
      </div>

      <div className="weather-card__hero">
        <div className="weather-card__temp-wrap">
          <span className="weather-card__temp">{Math.round(temperature)}°</span>
          <span className="weather-card__unit">C</span>
        </div>
        <div className="weather-card__feels-like">
          Feels like <strong>{Math.round(apparentTemperature)}°C</strong>
        </div>
      </div>

      <div className="weather-card__stats-grid">
        <div className="weather-card__stat">
          <span className="weather-card__stat-icon">💧</span>
          <div>
            <div className="weather-card__stat-label">Humidity</div>
            <div className="weather-card__stat-val">{humidity}%</div>
          </div>
        </div>

        <div className="weather-card__stat">
          <span className="weather-card__stat-icon">💨</span>
          <div>
            <div className="weather-card__stat-label">Wind Speed</div>
            <div className="weather-card__stat-val">{windSpeed} km/h</div>
          </div>
        </div>

        <div className="weather-card__stat">
          <span className="weather-card__stat-icon">🌧️</span>
          <div>
            <div className="weather-card__stat-label">Rain Chance</div>
            <div className="weather-card__stat-val">{precipitation}%</div>
          </div>
        </div>
      </div>

      {daily && daily.length > 0 && (
        <div className="weather-card__forecast-section">
          <div className="weather-card__forecast-title">5-Day Outlook</div>
          <div className="weather-card__forecast-grid">
            {daily.map((day, idx) => (
              <div key={idx} className="weather-card__forecast-col">
                <span className="weather-card__f-day">{day.dayName}</span>
                <span className="weather-card__f-icon">{getWeatherIcon(day.weatherCode)}</span>
                <div className="weather-card__f-temps">
                  <span className="weather-card__f-max">{Math.round(day.tempMax)}°</span>
                  <span className="weather-card__f-min">{Math.round(day.tempMin)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
