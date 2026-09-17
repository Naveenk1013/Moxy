import { useState, useCallback, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import TutorialCarousel from './components/TutorialCarousel';
import ChatThread from './components/ChatThread';
import SuggestionChips from './components/SuggestionChips';
import ChatInput from './components/ChatInput';
import QuickLinksDrawer from './components/QuickLinksDrawer';
import ConciergeToolsModal from './components/ConciergeToolsModal';
import LocationModal from './components/LocationModal';
import { getStoredLocation, detectBrowserLocation } from './utils/geolocation';

const STORAGE_KEY = 'moxy_tutorial_seen';
const THEME_KEY = 'moxy_theme';
const MAX_HISTORY = 10;

const INITIAL_SUGGESTIONS = [
  '🎓 What courses are offered at IIHM Hyderabad?',
  '🗺️ Plan a 3-day curated Hyderabad itinerary',
  '🚗 Distance & route from IIHM to Airport',
  '☀️ Live weather & forecast in Hyderabad',
  '🎟️ Check PNR status for 4344722640',
  '🚆 Live status for Train #22960',
  '🚉 Live train board at Secunderabad (SC)',
  '✈️ Live flight tracker for 6E382',
];

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'moxy',
  content:
    "Hello! 👋 I'm **Moxy**, your AI Concierge & Assistant.\n\nI can help you with:\n- **IIHM Hyderabad & Campuses**: Admissions (eCHAT), courses (BHM&CT, West London degree), fees & campus contacts.\n- **Travel & Concierge**: Custom day-by-day itineraries, place guides, sightseeing, food spots & stays.\n- **Indian Railways & Flights**: PNR status checks, live train tracking, seat availability (GN/WL/Confirm %), train fares & global flight tracking.\n\nHow can I assist you today?",
  suggestions: INITIAL_SUGGESTIONS,
  isHandoff: false,
  widgets: [],
  timestamp: Date.now(),
};

export default function App() {
  const [screen, setScreen] = useState(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    return seen ? 'chat' : 'splash';
  });
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isToolsModalOpen, setIsToolsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(() => getStoredLocation());
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  // Sync theme to document root
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Attempt non-intrusive background location detection on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      detectBrowserLocation()
        .then((loc) => {
          if (loc && loc.city) {
            setUserLocation(loc);
          }
        })
        .catch(() => {
          // Silently retain cached or default location
        });
    }
  }, []);

  // ------- Screen transitions -------
  const handleSplashDone = () => setScreen('tutorial');

  const handleTutorialDone = (firstQuestion) => {
    localStorage.setItem(STORAGE_KEY, '1');
    setScreen('chat');
    if (firstQuestion) {
      setTimeout(() => sendMessage(firstQuestion), 400);
    }
  };

  const handleReplayTutorial = () => {
    setIsDrawerOpen(false);
    setScreen('tutorial');
  };

  // ------- Send message -------
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading) return;

      const userMsg = {
        id: Date.now(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setSuggestions([]);
      setIsLoading(true);

      // Build conversation history for the API (Claude format)
      const history = messages
        .filter((m) => m.id !== 'welcome' || m.role === 'moxy')
        .slice(-MAX_HISTORY)
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content,
        }));

      try {
        const res = await fetch('/.netlify/functions/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            history,
            userLocation,
          }),
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        const moxyMsg = {
          id: Date.now() + 1,
          role: 'moxy',
          content:
            data.reply || "I've processed your request.",
          suggestions: data.suggestions || [],
          isHandoff: data.isHandoff || false,
          widgets: data.widgets || [],
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, moxyMsg]);
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error('Chat error:', err);
        const errorMsg = {
          id: Date.now() + 1,
          role: 'moxy',
          content:
            "Oops — I'm having trouble connecting right now. Please try again in a moment, or reach out to IIHM Hyderabad directly.",
          suggestions: INITIAL_SUGGESTIONS,
          isHandoff: true,
          widgets: [],
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setSuggestions(INITIAL_SUGGESTIONS);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, userLocation]
  );

  // ------- Render screens -------
  if (screen === 'splash') {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  if (screen === 'tutorial') {
    return <TutorialCarousel onDone={handleTutorialDone} />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__left">
          <img src="/logo.svg" alt="IIHM" className="header__avatar" />
          <div className="header__info">
            <div className="header__name">Moxy</div>
            <div className="header__status">
              <span className="header__status-dot" />
              AI Concierge & Assistant
            </div>
          </div>
        </div>

        <div className="header__actions">
          {/* Location Pill */}
          <button
            type="button"
            className="header__location-btn"
            onClick={() => setIsLocationModalOpen(true)}
            title={`Active Location: ${userLocation?.address || userLocation?.city || 'Hyderabad'} (Click to change)`}
          >
            <span className="header__location-icon">📍</span>
            <span className="header__location-text">{userLocation?.city || 'Hyderabad'}</span>
          </button>

          <button
            type="button"
            className="header__tools-btn"
            onClick={() => setIsToolsModalOpen(true)}
            title="Open Concierge Toolkit"
          >
            <span className="header__tools-icon">✨</span>
            <span className="header__tools-text">Toolkit</span>
          </button>

          <button
            className="header__menu-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <ChatThread messages={messages} isLoading={isLoading} />

      {/* Suggestion Chips */}
      {suggestions.length > 0 && !isLoading && (
        <SuggestionChips suggestions={suggestions} onSelect={sendMessage} />
      )}

      {/* Input Bar */}
      <ChatInput
        onSend={sendMessage}
        disabled={isLoading}
        onOpenTools={() => setIsToolsModalOpen(true)}
      />

      {/* Quick Links Drawer */}
      {isDrawerOpen && (
        <QuickLinksDrawer
          onClose={() => setIsDrawerOpen(false)}
          onReplayTutorial={handleReplayTutorial}
          onSend={sendMessage}
          onOpenTools={() => {
            setIsDrawerOpen(false);
            setIsToolsModalOpen(true);
          }}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {/* Concierge Toolkit Modal */}
      <ConciergeToolsModal
        isOpen={isToolsModalOpen}
        onClose={() => setIsToolsModalOpen(false)}
        onSelectAction={sendMessage}
        userLocation={userLocation}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={userLocation}
        onLocationChanged={(newLoc) => setUserLocation(newLoc)}
      />
    </div>
  );
}

