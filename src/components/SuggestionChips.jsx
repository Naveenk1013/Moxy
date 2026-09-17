export default function SuggestionChips({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  const getChipDetails = (item) => {
    // Check if string starts with an emoji
    const emojiMatch = item.match(
      /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF])\s*/u
    );

    if (emojiMatch) {
      const emoji = emojiMatch[0].trim();
      const text = item.slice(emojiMatch[0].length).trim();
      return { emoji, text };
    }

    const lower = item.toLowerCase();
    let emoji = '✨';
    if (lower.includes('course') || lower.includes('admission') || lower.includes('echat') || lower.includes('iihm')) {
      emoji = '🎓';
    } else if (lower.includes('pnr')) {
      emoji = '🎟️';
    } else if (lower.includes('train') || lower.includes('station') || lower.includes('fare') || lower.includes('seat')) {
      emoji = '🚆';
    } else if (lower.includes('flight') || lower.includes('airline') || lower.includes('airport')) {
      emoji = '✈️';
    } else if (lower.includes('route') || lower.includes('distance') || lower.includes('reach') || lower.includes('direction')) {
      emoji = '🚗';
    } else if (lower.includes('weather') || lower.includes('forecast') || lower.includes('temperature') || lower.includes('rain')) {
      emoji = '☀️';
    } else if (lower.includes('itinerary') || lower.includes('trip') || lower.includes('tour') || lower.includes('visit') || lower.includes('place') || lower.includes('guide')) {
      emoji = '🗺️';
    }

    return { emoji, text: item };
  };

  return (
    <div className="chips-container" role="region" aria-label="Suggested Concierge Prompts">
      <div className="chips-scroll">
        {suggestions.map((item, idx) => {
          const { emoji, text } = getChipDetails(item);
          return (
            <button
              key={`${item}-${idx}`}
              type="button"
              className="chips__pill"
              onClick={() => onSelect(item)}
            >
              <span className="chips__pill-icon">{emoji}</span>
              <span className="chips__pill-text">{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
