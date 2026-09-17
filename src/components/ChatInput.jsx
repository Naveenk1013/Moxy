import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, disabled, onOpenTools }) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Check SpeechRecognition support
  const SpeechRecognition =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null;

  useEffect(() => {
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setText(transcript);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('SpeechRecognition setup error:', err);
      }
    }
  }, [SpeechRecognition]);

  const toggleListening = () => {
    if (!recognitionRef.current || disabled) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    }
  };

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    onSend(text);
    setText('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-bar">
      <div className="input-capsule">
        {onOpenTools && (
          <button
            type="button"
            className="input-capsule__tools-btn"
            onClick={onOpenTools}
            title="Open Concierge Toolkit (Flights, Trains, Itinerary, SOS)"
            aria-label="Open Concierge Toolkit"
          >
            <span className="input-capsule__tools-icon">✨</span>
          </button>
        )}

        <textarea
          ref={inputRef}
          className="input-capsule__field"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening to your voice...' : 'Ask Moxy anything (Admissions, Trains, Flights, SOS)...'}
          rows={1}
          disabled={disabled}
          aria-label="Type your message"
          id="chat-input"
        />

        {SpeechRecognition && (
          <button
            type="button"
            className={`input-capsule__mic-btn ${isListening ? 'input-capsule__mic-btn--active' : ''}`}
            onClick={toggleListening}
            title={isListening ? 'Listening... click to stop' : 'Speak to Moxy (Voice Search)'}
            aria-label={isListening ? 'Listening...' : 'Voice Search'}
          >
            <span className="input-capsule__mic-icon">{isListening ? '🔴' : '🎙️'}</span>
          </button>
        )}

        <button
          className={`input-capsule__send ${text.trim() && !disabled ? 'input-capsule__send--ready' : ''}`}
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          aria-label="Send message"
          id="chat-send"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
