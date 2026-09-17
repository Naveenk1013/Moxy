import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

export default function ChatThread({ messages, isLoading }) {
  const containerRef = useRef(null);

  // Smoothly scroll the container to bottom without scrolling window / parent containers
  useEffect(() => {
    if (containerRef.current) {
      // Use requestAnimationFrame so DOM has finished updating heights
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      });
    }
  }, [messages, isLoading]);

  return (
    <div
      className="chat-thread"
      ref={containerRef}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      tabIndex={0}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && <TypingIndicator />}
    </div>
  );
}

