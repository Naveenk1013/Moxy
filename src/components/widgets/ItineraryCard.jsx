import { useState } from 'react';
import { openWhatsApp, formatItineraryShare } from '../../utils/whatsapp';

export default function ItineraryCard({ data }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const {
    destination,
    days,
    budget,
    travelStyle,
    interests = [],
    title,
    summary,
    dayPlans = [],
    essentials = [],
  } = data;

  const activePlan = dayPlans[activeDayIndex] || dayPlans[0];

  const handleCopy = () => {
    let text = `🗺️ ${title}\n${summary}\n\n`;
    dayPlans.forEach((dp) => {
      text += `--- Day ${dp.day}: ${dp.theme} ---\n`;
      if (dp.morning) text += `🌅 Morning (${dp.morning.time}): ${dp.morning.title}\n   ${dp.morning.desc}\n   💡 Tip: ${dp.morning.tip || ''}\n`;
      if (dp.afternoon) text += `☀️ Afternoon (${dp.afternoon.time}): ${dp.afternoon.title}\n   ${dp.afternoon.desc}\n   💡 Tip: ${dp.afternoon.tip || ''}\n`;
      if (dp.evening) text += `🌆 Evening (${dp.evening.time}): ${dp.evening.title}\n   ${dp.evening.desc}\n   💡 Tip: ${dp.evening.tip || ''}\n`;
      if (dp.night) text += `🌙 Night (${dp.night.time}): ${dp.night.title}\n   ${dp.night.desc}\n`;
      if (dp.foodSpot) text += `🍽️ Top Food Spot: ${dp.foodSpot}\n`;
      if (dp.estimatedDailyCost) text += `💰 Est. Daily Cost: ${dp.estimatedDailyCost}\n\n`;
    });

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  };

  const handleShareWhatsApp = () => {
    const text = formatItineraryShare(data);
    openWhatsApp(text);
  };

  return (
    <div className="itinerary-card" role="region" aria-label={`Itinerary for ${destination}`}>
      <div className="itinerary-card__header">
        <div className="itinerary-card__title-row">
          <div className="itinerary-card__title-wrap">
            <span className="itinerary-card__icon">🗺️</span>
            <div>
              <h3 className="itinerary-card__title">{title}</h3>
              <div className="itinerary-card__badges">
                <span className="itin-pill itin-pill--days">{days} Days</span>
                {budget && <span className="itin-pill itin-pill--budget">{budget}</span>}
                {travelStyle && <span className="itin-pill itin-pill--style">{travelStyle}</span>}
              </div>
            </div>
          </div>
          <div className="itin-actions">
            <button
              type="button"
              className="itin-whatsapp-btn"
              onClick={handleShareWhatsApp}
              title="Share this itinerary directly on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              💬 WhatsApp
            </button>
            <button
              type="button"
              className="itin-print-btn"
              onClick={() => window.print()}
              title="Print itinerary or save as PDF pass"
            >
              🖨️ Print Pass
            </button>
            <button
              type="button"
              className="itin-copy-btn"
              onClick={handleCopy}
              title="Copy full itinerary plan"
            >
              {copied ? '✓ Copied Plan' : '📋 Copy Plan'}
            </button>
          </div>
        </div>

        {summary && <p className="itinerary-card__summary">{summary}</p>}

        {interests.length > 0 && (
          <div className="itinerary-card__tags">
            {interests.map((int, i) => (
              <span key={i} className="interest-tag">🏷️ {int}</span>
            ))}
          </div>
        )}
      </div>

      {dayPlans.length > 1 && (
        <div className="itinerary-tabs" role="tablist">
          {dayPlans.map((dp, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={activeDayIndex === idx}
              className={`itinerary-tab ${activeDayIndex === idx ? 'itinerary-tab--active' : ''}`}
              onClick={() => setActiveDayIndex(idx)}
            >
              Day {dp.day}
            </button>
          ))}
        </div>
      )}

      {activePlan && (
        <div className="itinerary-day-view">
          <div className="itinerary-day-theme">
            <span className="itinerary-day-theme__badge">DAY {activePlan.day}</span>
            <span className="itinerary-day-theme__title">{activePlan.theme}</span>
          </div>

          <div className="itinerary-timeline">
            {activePlan.morning && (
              <div className="itinerary-slot itinerary-slot--morning">
                <div className="itinerary-slot__icon">🌅</div>
                <div className="itinerary-slot__content">
                  <div className="itinerary-slot__header">
                    <strong>Morning</strong>
                    <span className="itinerary-slot__time">{activePlan.morning.time}</span>
                  </div>
                  <div className="itinerary-slot__title">{activePlan.morning.title}</div>
                  <p className="itinerary-slot__desc">{activePlan.morning.desc}</p>
                  {activePlan.morning.tip && (
                    <div className="itinerary-slot__tip">💡 <em>Tip: {activePlan.morning.tip}</em></div>
                  )}
                </div>
              </div>
            )}

            {activePlan.afternoon && (
              <div className="itinerary-slot itinerary-slot--afternoon">
                <div className="itinerary-slot__icon">☀️</div>
                <div className="itinerary-slot__content">
                  <div className="itinerary-slot__header">
                    <strong>Afternoon</strong>
                    <span className="itinerary-slot__time">{activePlan.afternoon.time}</span>
                  </div>
                  <div className="itinerary-slot__title">{activePlan.afternoon.title}</div>
                  <p className="itinerary-slot__desc">{activePlan.afternoon.desc}</p>
                  {activePlan.afternoon.tip && (
                    <div className="itinerary-slot__tip">💡 <em>Tip: {activePlan.afternoon.tip}</em></div>
                  )}
                </div>
              </div>
            )}

            {activePlan.evening && (
              <div className="itinerary-slot itinerary-slot--evening">
                <div className="itinerary-slot__icon">🌆</div>
                <div className="itinerary-slot__content">
                  <div className="itinerary-slot__header">
                    <strong>Evening</strong>
                    <span className="itinerary-slot__time">{activePlan.evening.time}</span>
                  </div>
                  <div className="itinerary-slot__title">{activePlan.evening.title}</div>
                  <p className="itinerary-slot__desc">{activePlan.evening.desc}</p>
                  {activePlan.evening.tip && (
                    <div className="itinerary-slot__tip">💡 <em>Tip: {activePlan.evening.tip}</em></div>
                  )}
                </div>
              </div>
            )}

            {activePlan.night && (
              <div className="itinerary-slot itinerary-slot--night">
                <div className="itinerary-slot__icon">🌙</div>
                <div className="itinerary-slot__content">
                  <div className="itinerary-slot__header">
                    <strong>Night</strong>
                    <span className="itinerary-slot__time">{activePlan.night.time}</span>
                  </div>
                  <div className="itinerary-slot__title">{activePlan.night.title}</div>
                  <p className="itinerary-slot__desc">{activePlan.night.desc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="itinerary-day-footer">
            {activePlan.foodSpot && (
              <div className="itinerary-food-badge">
                <span>🍽️ <strong>Recommended Food Spot:</strong> {activePlan.foodSpot}</span>
              </div>
            )}
            {activePlan.estimatedDailyCost && (
              <div className="itinerary-cost-badge">
                <span>💰 <strong>Daily Budget:</strong> {activePlan.estimatedDailyCost}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {essentials.length > 0 && (
        <div className="itinerary-essentials">
          <strong>🎒 Travel Essentials:</strong>
          <ul>
            {essentials.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
