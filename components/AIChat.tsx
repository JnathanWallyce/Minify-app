import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, X } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { UserRole, ChatMessage } from '../types';

interface AIChatProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ userRole, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: `Olá! Sou seu assistente virtual. Como posso ajudar você em suas tarefas de ${userRole === UserRole.ADMIN ? 'administração' : userRole === UserRole.TEACHER ? 'ensino' : 'estudos'} hoje?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await sendMessageToGemini(userMsg.text, userRole, history);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed z-50 flex flex-col bg-white shadow-2xl border border-surface-200 
      w-full h-full inset-0 
      sm:w-96 sm:h-[500px] sm:inset-auto sm:bottom-4 sm:right-4 sm:rounded-xl 
      animate-in slide-in-from-bottom-10 fade-in duration-300`}>
      
      {/* Header */}
      <div className="p-4 bg-surface-900 text-white sm:rounded-t-xl flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-brand-500 p-1.5 rounded-full">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Assistente Ecclesia AI</h3>
            <p className="text-xs text-surface-300 capitalize">Modo: {userRole.toLowerCase()}</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-surface-700 p-1 rounded transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-white text-surface-800 border border-surface-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className={`text-[10px] block mt-1 ${msg.role === 'user' ? 'text-brand-200' : 'text-surface-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-surface-200 p-3 rounded-lg rounded-bl-none flex items-center gap-2">
              <Sparkles size={16} className="text-brand-500 animate-pulse" />
              <span className="text-xs text-surface-500">Pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-surface-200 sm:rounded-b-xl shrink-0 safe-area-bottom">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida..."
            className="flex-1 px-3 py-2 border border-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-surface-800 hover:bg-surface-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;