export default function SplashScreen({ onDone }) {
  return (
    <div className="splash" role="banner">
      <img src="/logo.svg" alt="IIHM Hyderabad Badge Logo" className="splash__logo" />

      <h1 className="splash__title">Moxy</h1>

      <p className="splash__tagline">
        AI Concierge & Universal Assistant
      </p>

      <p className="splash__sub">
        IIHM Hyderabad admissions, courses, global trip itineraries, live train tracking & flight schedules.
      </p>

      <button className="splash__btn" onClick={onDone} id="splash-get-started">
        Enter Concierge ✨
      </button>
    </div>
  );
}
