import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, SendHorizonal, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useChatbot } from "../context/ChatbotContext"; //  Chatbot context

const CHAT_HISTORY_PREFIX = "chatbot_messages_";

export default function Chatbot() {
  const { user } = useAuth();
  const { isChatbotOpen, openChatbot, closeChatbot } = useChatbot(); //  chatbot global state

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;


  const getUserChatKey = useCallback(() => {
    return user ? `${CHAT_HISTORY_PREFIX}${user.uid}` : null;
  }, [user]);

  const addMessage = useCallback((type, text, isTyping = false) => {
    setMessages((prev) => [
      ...prev,
      { type, text, timestamp: new Date(), isTyping },
    ]);
  }, []);

  const formatTimestamp = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const resetConversation = useCallback(() => {
    setMessages([]);
    const userKey = getUserChatKey();
    if (userKey) localStorage.removeItem(userKey);
    addMessage(
      "bot",
      "👋 Welcome to our store! How can I help you today?\n\nYou can ask things like:\n• 'Show me men's clothing'\n• 'Do you have headphones in stock?'\n• 'What's the return policy for electronics?'\n• 'Tell me about the brand StrideFlow'"
    );
  }, [addMessage, getUserChatKey]);

  useEffect(() => {
    const userKey = getUserChatKey();
    if (userKey) {
      try {
        const savedMessages = localStorage.getItem(userKey);
        if (savedMessages) {
          const parsed = JSON.parse(savedMessages).map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(parsed);
        } else resetConversation();
      } catch (e) {
        console.error("localStorage error:", e);
        resetConversation();
      }
    } else {
      setMessages([]);
      addMessage("bot", "👋 Welcome! Log in to save your chat history.");
    }
  }, [user, getUserChatKey, resetConversation, addMessage]);

  useEffect(() => {
    const userKey = getUserChatKey();
    if (messages.length > 0 && userKey) {
      try {
        localStorage.setItem(userKey, JSON.stringify(messages));
      } catch (error) {
        console.error("Failed to save messages:", error);
      }
    }
  }, [messages, getUserChatKey]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessageText = input.trim();
    addMessage("user", userMessageText);
    setInput("");
    addMessage("bot", "Typing...", true);

    try {
      const token = user ? await user.getIdToken() : null;

      const res = await fetch(`${API_URL}/chat_with_gemini`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ message: userMessageText }),
      });

      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      const data = await res.json();
      const botReply =
        data.response ||
        "Sorry, I didn’t get that. Try asking about products, compatibility or returns.";

      addMessage("bot", botReply);
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));
      addMessage("bot", "🚫 Oops! Something went wrong. Please try again later.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {!isChatbotOpen && (
        <button
          onClick={openChatbot}
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 w-96 max-w-[90vw] h-[500px] bg-white shadow-2xl rounded-xl flex flex-col z-50"
          >
            <div className="bg-black text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="font-semibold">Carti</h2>
              <button
                onClick={resetConversation}
                className="ml-auto mr-2 p-1 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700"
                aria-label="Reset conversation"
                title="Reset Conversation"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <X onClick={closeChatbot} className="cursor-pointer" />
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      msg.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg whitespace-pre-wrap max-w-[80%] ${
                        msg.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.isTyping ? (
                        <div className="flex items-center space-x-1">
                          <span className="dot animate-bounce1"></span>
                          <span className="dot animate-bounce2"></span>
                          <span className="dot animate-bounce3"></span>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    {msg.timestamp && (
                      <div
                        className={`text-xs mt-1 ${
                          msg.type === "user"
                            ? "text-right text-gray-500"
                            : "text-left text-gray-600"
                        }`}
                      >
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center border-t p-3 gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2 border rounded-lg text-sm focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="text-blue-600 hover:text-blue-800"
              >
                <SendHorizonal className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        .dot {
          width: 8px;
          height: 8px;
          background-color: #888;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .animate-bounce1 {
          animation-delay: -0.32s;
        }
        .animate-bounce2 {
          animation-delay: -0.16s;
        }
        .animate-bounce3 {
          animation-delay: 0s;
        }
      `}</style>
    </>
  );
}
