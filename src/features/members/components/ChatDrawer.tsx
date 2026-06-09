import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, X, Circle } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  memberInitial: string;
  avatarBg: string;
}

const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  memberName,
  memberInitial,
  avatarBg,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages when chatting with a new member
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 1,
          sender: 'them',
          text: `Hey! Any updates on the project access settings for ${memberName}? I noticed some changes this morning.`,
          time: '10:42 AM',
        },
        {
          id: 2,
          sender: 'me',
          text: `Working on it right now. I'm reviewing the role permissions for the new members in the project.`,
          time: '10:45 AM',
        },
        {
          id: 3,
          sender: 'them',
          text: `Perfect. Let me know if you need any input from my side on the developer or maintainer roles.`,
          time: '10:46 AM',
        },
      ]);
    }
  }, [isOpen, memberName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: 'me',
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');

    // Simulate response after a tiny delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'them',
          text: `Sounds great, thank you! Let's touch base during the daily sync.`,
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          }),
        },
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Chat Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${avatarBg}`}>
              {memberInitial}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm leading-none">Chatting with {memberName}</h3>
              <p className="text-emerald-600 font-semibold text-[11px] mt-1.5 flex items-center gap-1.5">
                <Circle size={8} className="fill-emerald-500 stroke-none" /> Online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-250/60 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'me' ? 'ml-auto justify-end' : ''
              }`}
            >
              {msg.sender === 'them' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-auto ${avatarBg}`}>
                  {memberInitial}
                </div>
              )}
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'me'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-100'
                    : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-sm'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[9px] mt-1.5 block ${
                    msg.sender === 'me' ? 'text-blue-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSend}
          className="p-6 border-t border-slate-100 bg-white"
        >
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-xs text-slate-700 placeholder:text-slate-400"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Smile size={18} />
              </button>
            </div>
            <button
              type="submit"
              className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatDrawer;
