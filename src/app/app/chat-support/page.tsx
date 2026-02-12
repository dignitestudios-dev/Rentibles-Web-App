"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatUser, Message } from "@/src/types/index.type";
import { mockMessages } from "./chatMockData";
const currentUser: ChatUser = {
  id: "user-1",
  name: "You",
  avatar: "",
  initials: "YU",
};

const adminUser: ChatUser = {
  id: "admin-1",
  name: "Admin",
  avatar: "",
  initials: "AD",
};

const ChatSupport = () => {
  const router = useRouter();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.initials,
      content: messageInput.trim(),
      timestamp: "12:05 AM",
      isCurrentUser: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="bg-background min-h-screen">
      <div className="sticky top-22.75 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-4 md:px-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-lg font-semibold">Chat Support</h1>
          <div></div>
        </div>
      </div>
      <div className="mt-8">
        <div className="h-[600px] flex bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                {adminUser.initials}
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {adminUser.name}
              </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                  Today
                </span>
              </div>

              {/* Chat Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar for received messages */}
                  {!message.isCurrentUser && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                      {message.senderAvatar}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] sm:max-w-md rounded-xl px-3 py-2 sm:px-4 sm:py-2 ${
                      message.isCurrentUser
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-white text-gray-900 rounded-tl-none border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {message.content}
                    </p>
                    <span
                      className={`block text-xs mt-1 ${
                        message.isCurrentUser
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp}
                    </span>
                  </div>

                  {/* Avatar for sent messages */}
                  {message.isCurrentUser && (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm flex-shrink-0">
                      {message.senderAvatar}
                    </div>
                  )}
                </div>
              ))}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 bg-gray-100 p-1 rounded-xl">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f78843] transition-all"
                  aria-label="Message input"
                />

                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="w-9 h-9 sm:w-10 sm:h-10 cursor-pointer bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-[#ff721a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
