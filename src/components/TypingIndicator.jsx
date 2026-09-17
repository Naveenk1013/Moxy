export default function TypingIndicator() {
  return (
    <div className="typing" aria-label="Moxy is typing" role="status">
      <img src="/logo.svg" alt="" className="typing__avatar" aria-hidden="true" />
      <div className="typing__bubble">
        <div className="typing__dot" />
        <div className="typing__dot" />
        <div className="typing__dot" />
      </div>
    </div>
  );
}
