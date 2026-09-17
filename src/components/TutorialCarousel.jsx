import { useState, useRef } from 'react';

const CARDS = [
  {
    icon: '✨',
    title: "Meet Moxy",
    body: "Your dedicated AI Concierge & Assistant. Ask me about IIHM courses & admissions, explore city guides, plan custom trips, or track live transit.",
    examples: [],
  },
  {
    icon: '🚀',
    title: 'Ask or Explore',
    body: 'Tap any quick action below to start:',
    examples: [
      'What degree courses are offered at IIHM Hyderabad?',
      '🚆 Track train 12565 live status',
      '✈️ Track flight 6E382 from DEL to HYD',
      '🗺️ Plan a 3-day Hyderabad food & heritage trip',
    ],
  },
  {
    icon: '🤝',
    title: 'Real-Time & Verified',
    body: "Powered by live Indian Railways, Aviationstack flight tracking, and direct 1-tap connections to IIHM Hyderabad admissions.",
    examples: [],
  },
];

export default function TutorialCarousel({ onDone }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const isLast = index === CARDS.length - 1;
  const card = CARDS[index];

  const next = () => {
    if (isLast) {
      onDone();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const prev = () => {
    if (index > 0) setIndex((i) => i - 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    touchStartX.current = null;
  };

  const handleExampleClick = (question) => {
    onDone(question);
  };

  return (
    <div className="tutorial" role="dialog" aria-label="Welcome tutorial">
      <button className="tutorial__skip" onClick={() => onDone()} id="tutorial-skip">
        Skip
      </button>

      <div
        className="tutorial__slides"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="tutorial__card" key={index}>
          <div className="tutorial__card-icon">{card.icon}</div>
          <h2 className="tutorial__card-title">{card.title}</h2>
          <p className="tutorial__card-body">{card.body}</p>

          {card.examples.length > 0 && (
            <div className="tutorial__examples">
              {card.examples.map((q) => (
                <button
                  key={q}
                  className="tutorial__example-btn"
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="tutorial__footer">
        <div className="tutorial__dots">
          {CARDS.map((_, i) => (
            <div
              key={i}
              className={`tutorial__dot${i === index ? ' tutorial__dot--active' : ''}`}
            />
          ))}
        </div>
        <button className="tutorial__btn" onClick={next} id="tutorial-next">
          {isLast ? "Start Exploring ✨" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
