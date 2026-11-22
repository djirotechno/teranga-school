'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Paperclip,
  Mic,
  Check,
  CheckCheck,
} from 'lucide-react';
import { INITIAL_CONVERSATIONS, Conversation } from '@/lib/constants/messages';

export default function EnseignantMessagesPage() {
  const [conversations] = useState([
    {
      id: 'c-awa',
      studentName: 'Awa Diop',
      studentClass: 'Terminale L',
      initials: 'AD',
      unread: true,
      lastMessage: 'Bonjour Monsieur, est-ce que le devoir portera sur la poésie ?',
      time: '10:14',
      messages: [
        {
          id: 'm1',
          sender: 'student',
          text: 'Bonjour Monsieur Diop, j’espère que vous allez bien.',
          time: '10:10',
        },
        {
          id: 'm2',
          sender: 'student',
          text: 'Est-ce que le devoir sur table de vendredi portera uniquement sur le théâtre ou également sur la poésie engagée ?',
          time: '10:14',
        },
      ],
    },
    {
      id: 'c-moussa',
      studentName: 'Moussa Sall',
      studentClass: 'Terminale L',
      initials: 'MS',
      unread: false,
      lastMessage: 'Merci pour vos conseils sur le commentaire.',
      time: 'Hier',
      messages: [
        {
          id: 'm3',
          sender: 'student',
          text: 'Merci pour vos conseils sur le commentaire composé Monsieur.',
          time: 'Hier',
        },
        {
          id: 'm4',
          sender: 'teacher',
          text: 'De rien Moussa, applique bien la règle Procédé -> Sens -> Effet !',
          time: 'Hier',
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState('c-awa');
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    activeConv.messages.push({
      id: `m-${Date.now()}`,
      sender: 'teacher',
      text: inputText.trim(),
      time: 'À l’instant',
    });
    setInputText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3833] tracking-tight">
          Messagerie pédagogique
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1">
          Échangez en direct avec vos élèves pour les guider individuellement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden min-h-[580px]">
        {/* Conversations List */}
        <div className="md:col-span-5 border-r border-stone-200 p-4 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 px-2 py-1">
            Conversations en cours
          </h3>

          {conversations.map((c) => {
            const isSelected = c.id === activeConvId;
            return (
              <div
                key={c.id}
                onClick={() => setActiveConvId(c.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#E8F1EE] text-stone-900'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#0F3833] text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-stone-900 truncate">
                      {c.studentName}
                    </span>
                    <span className="text-[11px] text-stone-400">{c.time}</span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {c.studentClass}
                  </span>
                  <p className="text-xs text-stone-600 truncate mt-1">
                    {c.lastMessage}
                  </p>
                </div>
                {c.unread && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E75A24] shrink-0 mt-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Chat window */}
        <div className="md:col-span-7 flex flex-col justify-between p-4 sm:p-6 bg-[#FAF7F2]/40">
          {activeConv ? (
            <>
              {/* Top active user bar */}
              <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
                <div className="w-10 h-10 rounded-full bg-[#0F3833] text-white font-bold text-sm flex items-center justify-center">
                  {activeConv.initials}
                </div>
                <div>
                  <h2 className="font-bold text-stone-900 text-sm sm:text-base">
                    {activeConv.studentName}
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    {activeConv.studentClass} · En ligne
                  </p>
                </div>
              </div>

              {/* Messages list */}
              <div className="flex-1 py-6 space-y-4 overflow-y-auto">
                {activeConv.messages.map((msg) => {
                  const isTeacher = msg.sender === 'teacher';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isTeacher ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-sm leading-relaxed ${
                          isTeacher
                            ? 'bg-[#0F3833] text-white rounded-br-xs'
                            : 'bg-white border border-stone-200 text-stone-900 rounded-bl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSend} className="flex items-center gap-2 pt-3 border-t border-stone-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Répondre à ${activeConv.studentName}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-[#E75A24]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-[#E75A24] hover:bg-[#D04D1B] disabled:opacity-50 text-white transition-colors cursor-pointer"
                  aria-label="Envoyer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-stone-500 text-sm">
              Sélectionnez une conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
