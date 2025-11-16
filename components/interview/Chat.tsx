'use client';

import { InterviewMessage } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface ChatProps {
  messages: InterviewMessage[];
  onSendMessage: (message: string) => void;
  isInterviewerTyping?: boolean;
  disabled?: boolean;
}

export default function Chat({
  messages,
  onSendMessage,
  isInterviewerTyping = false,
  disabled = false,
}: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isInterviewerTyping]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 border border-gray-700 rounded-lg">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-700 bg-gray-900">
        <h3 className="font-semibold text-white">Interview Chat</h3>
        <p className="text-xs text-gray-400">Communicate with your interviewer</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            The interviewer will greet you shortly...
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'candidate' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'candidate'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold">
                  {message.role === 'candidate' ? 'You' : 'Interviewer'}
                </span>
                <span className="text-xs opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isInterviewerTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-300">Interviewer</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={2}
            disabled={disabled}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
