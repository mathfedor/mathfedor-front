'use client';

import React, { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/auth.service';
import { chatService } from '@/services/chat.service';
import Swal from 'sweetalert2';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiChatSidebar3ro({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content:
            '¡Hola! Soy tu asistente de matemáticas Fedor para 3° Grado 🤖. ¿En qué te puedo ayudar hoy? Pregúntame sobre sumas con llevadas, multiplicaciones, divisiones, problemas SABER o fracciones. 🚀',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend ?? input;
    if (!text.trim() || isLoading) return;

    const token = authService.getToken();
    if (!token) {
      Swal.fire({
        title: 'Inicia sesión',
        text: 'Inicia sesión para conversar con el tutor de IA.',
        icon: 'warning',
        confirmButtonColor: '#7B2FBE',
      });
      return;
    }

    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const serviceMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));
      const response = await chatService.sendChatMessages(serviceMessages, token, 'Grado3');
      const botMsg: ChatMessage = {
        role: 'assistant',
        content: response.response || response.message || 'Lo siento, no pude procesar tu solicitud.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '¡Ups! Tuve un problema al responderte. Inténtalo de nuevo en unos segundos. 🚀',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[99999] w-full sm:w-96 bg-[#130B29] text-white border-l border-purple-500/30 shadow-2xl flex flex-col animate-slideLeft">
      {/* Header */}
      <div className="p-4 bg-[#1E0942] border-b border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-xl shadow-md">
            🤖
          </div>
          <div>
            <h2 className="text-sm font-black text-white">IA Fedor · Tutor 3°</h2>
            <p className="text-[10px] text-emerald-400 font-bold">En línea</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-xs font-bold leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-purple-950 rounded-br-none'
                  : 'bg-white/10 text-white border border-purple-400/20 rounded-bl-none'
              }`}
            >
              {m.content}
            </div>
            <span className="text-[9px] text-gray-500 mt-1 px-1">
              {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
            <span className="animate-spin">🌀</span> Pensando respuesta...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="p-2 border-t border-purple-800/30 flex gap-2 overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => handleSend('¿Cómo resuelvo una multiplicación de dos cifras?')}
          className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg shrink-0 border border-white/10 text-purple-200"
        >
          ✖️ Multiplicar 2 cifras
        </button>
        <button
          type="button"
          onClick={() => handleSend('¿Qué es una fracción equivalente?')}
          className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg shrink-0 border border-white/10 text-purple-200"
        >
          🍕 Fracciones
        </button>
        <button
          type="button"
          onClick={() => handleSend('Ponme un problema matemático de 3° grado')}
          className="text-[10px] font-bold bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg shrink-0 border border-white/10 text-purple-200"
        >
          🎯 Reto 3°
        </button>
      </div>

      {/* Input bar */}
      <div className="p-3 bg-[#1A0B36] border-t border-purple-500/30 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Escribe tu duda aquí..."
          className="flex-1 bg-white/10 border border-purple-400/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-none focus:border-amber-400"
        />
        <button
          type="button"
          disabled={!input.trim() || isLoading}
          onClick={() => handleSend()}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-purple-950 font-black flex items-center justify-center disabled:opacity-50 cursor-pointer shadow-md"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
