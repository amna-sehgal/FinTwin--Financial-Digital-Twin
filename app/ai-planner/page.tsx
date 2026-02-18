"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function AIPlannerPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("ai-chat") : null;
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* -------------------- LOAD CHAT -------------------- */
  // moved into lazy initializer above

  /* -------------------- SAVE CHAT -------------------- */
  useEffect(() => {
    localStorage.setItem("ai-chat", JSON.stringify(messages));
  }, [messages]);

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* -------------------- SIMPLE MARKDOWN PARSER -------------------- */
  const formatMessage = (text: string) => {
    return text
      .replace(/### (.*)/g, "<h3 class='font-semibold text-base mb-2'>$1</h3>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  /* -------------------- AI LOGIC -------------------- */
  const generateAIReply = (question: string) => {
    const lower = question.toLowerCase();

    if (lower.includes("car")) {
      return `### 🚗 Car Decision

Buying a car increases fixed monthly expenses.

**Recommendation:**
- Keep EMI under 40% of income  
- Maintain 30% savings rate  
- Avoid reducing emergency fund`;
    }

    if (lower.includes("loan")) {
      return `### 💳 Loan Analysis

Taking a loan adds long-term liability.

**Recommendation:**
- Maintain 6 months emergency savings  
- Avoid multiple EMIs  
- Compare interest rates carefully`;
    }

    if (lower.includes("job")) {
      return `### 💼 Job Switch Advice

Switching jobs may increase income but also lifestyle costs.

**Recommendation:**
- Compare net savings difference  
- Consider relocation expenses  
- Evaluate long-term growth`;
    }

    return `### 📊 Financial Guidance

This decision affects long-term stability.

**Recommendation:**
Run a simulation before making a major financial move.`;
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        role: "ai",
        content: generateAIReply(userMessage.content),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  /* -------------------- ENTER TO SEND -------------------- */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  /* -------------------- CLEAR CHAT -------------------- */
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("ai-chat");
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--main-bg)]">

      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <span className="font-semibold">AI Financial Planner</span>
        <button
          onClick={clearChat}
          className="text-sm px-3 py-1 rounded border"
        >
          Clear Chat
        </button>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {messages.length === 0 && (
            <div className="text-center mt-24 opacity-60">
              <p className="text-lg font-medium">
                How can I help you today?
              </p>
              <p className="text-sm mt-2">
                Ask about cars, loans, jobs or investments.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                  AI
                </div>
              )}

              <div
                className={`px-5 py-3 rounded-2xl max-w-xl text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-[var(--accent-blue)] text-white"
                    : "bg-white text-black"
                }`}
                dangerouslySetInnerHTML={{
                  __html: formatMessage(msg.content),
                }}
              />

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-bold">
                  U
                </div>
              )}
            </div>
          ))}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl flex gap-1 shadow-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Planner..."
            className="flex-1 p-3 rounded-full border outline-none focus:ring-2 focus:ring-[var(--accent-blue)]"
          />

          <button
            onClick={sendMessage}
            className="px-6 py-3 rounded-full font-semibold bg-[var(--accent-blue)] text-white hover:opacity-90 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
