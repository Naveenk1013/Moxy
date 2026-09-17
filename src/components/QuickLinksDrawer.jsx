const QUICK_LINKS = [
  { icon: '🎓', label: 'IIHM Courses & Programs', question: 'What courses and programs are offered at IIHM Hyderabad?' },
  { icon: '📋', label: 'Admission & eCHAT Form', question: 'How do I apply to IIHM Hyderabad and register for eCHAT?' },
  { icon: '🚆', label: 'Live Train Tracker (12565)', question: 'Check live running status of train 12565' },
  { icon: '💺', label: 'Check Seat Availability', question: 'Check 3A seat availability for train 12565 from NDLS to HYB' },
  { icon: '🗺️', label: 'Hyderabad 3-Day Itinerary', question: 'Create a 3-day itinerary for Hyderabad focusing on Food & Heritage' },
  { icon: '💼', label: 'Placements & YCO Info', question: 'What are the placement opportunities and packages at IIHM?' },
  { icon: '📞', label: 'Contact Admissions Team', question: 'How can I contact IIHM Hyderabad admissions?' },
];

export default function QuickLinksDrawer({ onClose, onReplayTutorial, onSend, onOpenTools, theme, onToggleTheme }) {
  const handleLink = (question) => {
    onClose();
    setTimeout(() => onSend(question), 200);
  };

  return (
    <>
      {/* Overlay */}
      <div className="drawer-overlay" onClick={onClose} aria-hidden="true" />

      {/* Drawer */}
      <div className="drawer" role="dialog" aria-label="Quick links menu">
        <div className="drawer__handle" />

        <div className="drawer__header">
          <div className="drawer__title">Concierge & Quick Actions</div>
          <button
            type="button"
            className="drawer__tools-cta"
            onClick={onOpenTools}
          >
            ✨ Open Toolkit
          </button>
        </div>

        {QUICK_LINKS.map((link) => (
          <button
            key={link.label}
            className="drawer__link"
            onClick={() => handleLink(link.question)}
          >
            <span className="drawer__link-icon" aria-hidden="true">{link.icon}</span>
            {link.label}
          </button>
        ))}

        <div className="drawer__divider" />

        {onToggleTheme && (
          <button className="drawer__link" onClick={onToggleTheme}>
            <span className="drawer__link-icon" aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Luxury Dark Mode'}
          </button>
        )}

        <button className="drawer__link" onClick={() => { onClose(); onReplayTutorial(); }}>
          <span className="drawer__link-icon" aria-hidden="true">❓</span>
          How Moxy Works
        </button>
      </div>
    </>
  );
}
