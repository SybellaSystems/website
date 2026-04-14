"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWidgetProps {
  onMessageSent?: (msg: { role: string; content: string }) => void;
}

export default function ChatWidget({ onMessageSent }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! 👋 I'm here to help answer any questions about this article or our services. What would you like to know?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    onMessageSent?.(userMessage);
    setInputValue("");
    setIsLoading(true);

    // Simulate API response
    setTimeout(() => {
      const responses = [
        "That's a great question! Based on our experience at Sybella Systems, I'd recommend...",
        "Absolutely! This is something we specialize in. Let me explain...",
        "Great point! Many of our clients have similar questions. The key is...",
        "Interesting! I think the best approach would be to...",
        "Thanks for asking! This is crucial for success. We typically advise..."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const assistantMessage: Message = { role: "assistant", content: randomResponse };
      setMessages(prev => [...prev, assistantMessage]);
      onMessageSent?.(assistantMessage);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "clamp(400px, 60vh, 600px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
      {/* Messages Container */}
      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 24px)", display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 16px)" }}>
        {messages.map((message, index) => (
          <div key={index} style={{ display: "flex", justifyContent: message.role === "user" ? "flex-end" : "flex-start" }}>
            <div
              style={{
                maxWidth: "80%",
                padding: "clamp(12px, 2vw, 16px)",
                borderRadius: 8,
                background: message.role === "user" ? "var(--blue)" : "var(--surface-2)",
                color: message.role === "user" ? "var(--black)" : "var(--text-primary)",
                fontSize: "clamp(12px, 1.8vw, 14px)",
                lineHeight: 1.5,
                wordBreak: "break-word"
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "clamp(12px, 2vw, 16px)", borderRadius: 8, background: "var(--surface-2)" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--blue)",
                      animation: `pulse 1.4s infinite`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div style={{ padding: "clamp(12px, 2vw, 16px)", borderTop: "1px solid var(--border)", display: "flex", gap: "clamp(8px, 1.5vw, 12px)" }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          style={{
            flex: 1,
            padding: "clamp(10px, 1.5vw, 12px) clamp(12px, 2vw, 16px)",
            background: "var(--charcoal)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            fontSize: "clamp(12px, 1.8vw, 14px)",
            outline: "none",
            transition: "border-color 0.3s"
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--blue)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          style={{
            padding: "clamp(10px, 1.5vw, 12px) clamp(16px, 3vw, 20px)",
            background: isLoading ? "var(--border)" : "var(--blue)",
            color: "var(--black)",
            border: "none",
            borderRadius: 4,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(11px, 1.5vw, 12px)",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            minHeight: 44,
            opacity: isLoading ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}