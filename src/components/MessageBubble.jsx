import { useState } from 'react';
import HandoffCard from './HandoffCard';
import LiveTrainCard from './widgets/LiveTrainCard';
import SeatAvailabilityCard from './widgets/SeatAvailabilityCard';
import TrainFareCard from './widgets/TrainFareCard';
import FlightCard from './widgets/FlightCard';
import ItineraryCard from './widgets/ItineraryCard';
import PlaceGuideCard from './widgets/PlaceGuideCard';
import PNRStatusCard from './widgets/PNRStatusCard';
import LiveStationCard from './widgets/LiveStationCard';
import RouteDistanceCard from './widgets/RouteDistanceCard';
import WeatherCard from './widgets/WeatherCard';
import EmergencySOSCard from './widgets/EmergencySOSCard';
import MetroTransitCard from './widgets/MetroTransitCard';
import StationFoodCard from './widgets/StationFoodCard';
import CurrencyCalculatorCard from './widgets/CurrencyCalculatorCard';
import {
  openWhatsApp,
  formatGeneralMessage,
  formatPnrShare,
  formatItineraryShare,
  formatSosShare,
  formatMetroShare,
  formatFoodShare,
} from '../utils/whatsapp';

/**
 * Robust markdown-to-JSX renderer.
 * Handles: **bold**, *italic*, `code`, [link](url), tables, headers (h1-h4),
 * bullet lists, numbered lists, hr dividers, and paragraph breaks.
 */
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  let listType = 'bullet'; // 'bullet' | 'number'
  let listKey = 0;
  let tableRows = [];
  let tableKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'number') {
        elements.push(
          <ol key={`ol-${listKey++}`} className="md-list md-list--numbered">
            {listItems.map((item, i) => (
              <li key={i}>{processInline(item)}</li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${listKey++}`} className="md-list md-list--bullet">
            {listItems.map((item, i) => (
              <li key={i}>{processInline(item)}</li>
            ))}
          </ul>
        );
      }
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      // Find header and body
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(1).filter(r => !r.every(cell => /^[-:]+$/.test(cell.trim())));

      elements.push(
        <div key={`table-wrap-${tableKey++}`} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx}>{processInline(cell.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{processInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  const processInline = (str) => {
    const parts = [];
    let remaining = str;
    let key = 0;

    while (remaining.length > 0) {
      const codeMatch = remaining.match(/`([^`]+)`/);
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      const matches = [
        codeMatch && { type: 'code', match: codeMatch },
        boldMatch && { type: 'bold', match: boldMatch },
        italicMatch && { type: 'italic', match: italicMatch },
        linkMatch && { type: 'link', match: linkMatch },
      ].filter(Boolean);

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const earliest = matches.reduce((a, b) =>
        a.match.index < b.match.index ? a : b
      );

      const { type, match } = earliest;

      if (match.index > 0) {
        parts.push(remaining.slice(0, match.index));
      }

      if (type === 'code') {
        parts.push(<code key={key++} className="md-inline-code">{match[1]}</code>);
      } else if (type === 'bold') {
        parts.push(<strong key={key++}>{match[1]}</strong>);
      } else if (type === 'italic') {
        parts.push(<em key={key++}>{match[1]}</em>);
      } else if (type === 'link') {
        parts.push(
          <a key={key++} href={match[2]} target="_blank" rel="noopener noreferrer">
            {match[1]}
          </a>
        );
      }

      remaining = remaining.slice(match.index + match[0].length);
    }

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Table line: starts and ends with '|'
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      flushList();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      tableRows.push(cells);
      continue;
    } else {
      flushTable();
    }

    // Horizontal Divider
    if (/^(\*\*\*|---|___)$/.test(trimmed)) {
      flushList();
      elements.push(<hr key={`hr-${i}`} className="md-hr" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      flushList();
      elements.push(<h5 key={`h5-${i}`} className="md-h5">{processInline(trimmed.slice(5))}</h5>);
      continue;
    }
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={`h4-${i}`} className="md-h4">{processInline(trimmed.slice(4))}</h4>);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={`h3-${i}`} className="md-h3">{processInline(trimmed.slice(3))}</h3>);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h2 key={`h2-${i}`} className="md-h2">{processInline(trimmed.slice(2))}</h2>);
      continue;
    }

    // Bullet list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
      listType = 'bullet';
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Numbered list item
    if (/^\d+[\.\)]\s/.test(trimmed)) {
      listType = 'number';
      listItems.push(trimmed.replace(/^\d+[\.\)]\s/, ''));
      continue;
    }

    flushList();

    if (trimmed === '') continue;

    elements.push(
      <p key={`p-${i}`} className="md-p">{processInline(trimmed)}</p>
    );
  }

  flushList();
  flushTable();
  return elements;
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function renderWidget(widget, index) {
  if (!widget || !widget.type) return null;

  switch (widget.type) {
    case 'live_train':
      return <LiveTrainCard key={`widget-train-${index}`} data={widget.data} />;
    case 'seat_availability':
      return <SeatAvailabilityCard key={`widget-seat-${index}`} data={widget.data} />;
    case 'train_fare':
      return <TrainFareCard key={`widget-fare-${index}`} data={widget.data} />;
    case 'flight_card':
      return <FlightCard key={`widget-flight-${index}`} data={widget.data} />;
    case 'itinerary':
      return <ItineraryCard key={`widget-itin-${index}`} data={widget.data} />;
    case 'place_guide':
      return <PlaceGuideCard key={`widget-guide-${index}`} data={widget.data} />;
    case 'pnr_status':
      return <PNRStatusCard key={`widget-pnr-${index}`} data={widget.data} />;
    case 'live_station':
      return <LiveStationCard key={`widget-station-${index}`} data={widget.data} />;
    case 'route_distance':
      return <RouteDistanceCard key={`widget-route-${index}`} data={widget.data} />;
    case 'weather':
      return <WeatherCard key={`widget-weather-${index}`} data={widget.data} />;
    case 'emergency_sos':
      return <EmergencySOSCard key={`widget-sos-${index}`} data={widget.data} />;
    case 'metro_route':
      return <MetroTransitCard key={`widget-metro-${index}`} data={widget.data} />;
    case 'station_food':
      return <StationFoodCard key={`widget-food-${index}`} data={widget.data} />;
    case 'currency_calc':
      return <CurrencyCalculatorCard key={`widget-curr-${index}`} data={widget.data} />;
    default:
      return null;
  }
}

export default function MessageBubble({ message }) {
  const { role, content, isHandoff, widgets = [], timestamp } = message;
  const isUser = role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleShareWhatsApp = () => {
    if (widgets && widgets.length > 0) {
      const firstWidget = widgets[0];
      if (firstWidget.type === 'pnr_status' && firstWidget.data) {
        openWhatsApp(formatPnrShare(firstWidget.data));
        return;
      }
      if (firstWidget.type === 'itinerary' && firstWidget.data) {
        openWhatsApp(formatItineraryShare(firstWidget.data));
        return;
      }
      if (firstWidget.type === 'emergency_sos' && firstWidget.data) {
        openWhatsApp(formatSosShare(firstWidget.data));
        return;
      }
      if (firstWidget.type === 'metro_transit' && firstWidget.data) {
        openWhatsApp(formatMetroShare(firstWidget.data));
        return;
      }
      if (firstWidget.type === 'station_food' && firstWidget.data) {
        openWhatsApp(formatFoodShare(firstWidget.data));
        return;
      }
    }
    if (content) {
      const formatted = formatGeneralMessage(content);
      openWhatsApp(formatted);
    }
  };

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = (content || '')
      .replace(/[*_#`~[\]()<>]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`message message--${isUser ? 'user' : 'moxy'}`}>
      {!isUser && (
        <img src="/logo.svg" alt="" className="message__avatar" aria-hidden="true" />
      )}

      <div className="message__content-wrap">
        {content && (
          <div className="message__bubble">
            {renderMarkdown(content)}
          </div>
        )}

        {!isUser && widgets.length > 0 && (
          <div className="message__widgets-container">
            {widgets.map((w, idx) => renderWidget(w, idx))}
          </div>
        )}

        {isHandoff && !isUser && <HandoffCard />}

        <div className="message__footer-row">
          {timestamp && (
            <div className="message__time">{formatTime(timestamp)}</div>
          )}

          {!isUser && content && typeof window !== 'undefined' && 'speechSynthesis' in window && (
            <button
              type="button"
              className={`message__speak-btn ${isSpeaking ? 'message__speak-btn--active' : ''}`}
              onClick={toggleSpeech}
              title={isSpeaking ? 'Stop listening' : 'Listen to concierge briefing'}
              aria-label={isSpeaking ? 'Stop speech' : 'Read aloud'}
            >
              <span>{isSpeaking ? '⏹️ Stop' : '🔊 Listen'}</span>
            </button>
          )}

          {!isUser && (content || widgets.length > 0) && (
            <button
              type="button"
              className="message__whatsapp-btn"
              onClick={handleShareWhatsApp}
              title="Share this info directly on WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <span>💬 WhatsApp</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
