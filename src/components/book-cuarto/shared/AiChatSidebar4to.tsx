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

export default function AiChatSidebar4to({
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
            '¡Hola! Soy tu asistente Fedor para 4° Grado 🚀🤖. ¿En qué te puedo ayudar hoy? Pregúntame sobre valor posicional en millones, fracciones y decimales, múltiplos y divisores, geometría, problemas SABER o cualquier duda matemática.',
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
    setInput('');
    setIsLoading(true);

    try {
      const serviceMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }));

      const res = await chatService.sendChatMessages(serviceMessages, token, 'Grado4');

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content:
          res.response ||
          res.reply ||
          res.message ||
          '¡Entendido! Recuerda descomponer el problema paso a paso para hallar la respuesta.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            error?.message ||
            'Lo siento, hubo un error de conexión con el centro de control. Intenta de nuevo más tarde.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99995] flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="w-full max-w-md bg-[#110D27] border-l border-amber-400/30 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#170E38] via-[#2A155C] to-[#170E38] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow-md">
              🤖
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Tutor Fedor IA 4°</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-bold">En línea para 4° Grado</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-white/5 border-b border-white/5 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => handleSend('¿Cómo calculo el mínimo común múltiplo?')}
            className="px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 whitespace-nowrap hover:bg-amber-400/25 transition-colors cursor-pointer"
          >
            🔢 Mínimo común múltiplo
          </button>
          <button
            type="button"
            onClick={() => handleSend('Explícame cómo sumar fracciones con diferente denominador')}
            className="px-2.5 py-1 rounded-full bg-purple-400/15 border border-purple-400/30 text-purple-300 whitespace-nowrap hover:bg-purple-400/25 transition-colors cursor-pointer"
          >
            🍕 Fracciones heterogéneas
          </button>
          <button
            type="button"
            onClick={() => handleSend('¿Cuál es la diferencia entre perímetro y área?')}
            className="px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 whitespace-nowrap hover:bg-emerald-400/25 transition-colors cursor-pointer"
          >
            📐 Perímetro vs Área
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-tr-none'
                    : 'bg-[#1C163D] border border-white/10 text-white rounded-tl-none shadow-md'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1C163D] border border-white/10 text-amber-400 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Fedor está pensando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-[#0A071A] border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Pregúntale a Fedor sobre 4°..."
            className="flex-1 px-3.5 py-2 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
