'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Mic, Paperclip, Download, FileText, Check, CheckCheck } from 'lucide-react';
import { AudioPlayer } from '@/components/media/AudioPlayer';
import { AudioRecorder } from '@/components/media/AudioRecorder';
import { Conversation, ChatMessage } from '@/lib/constants/messages';

interface ChatConversationViewProps {
  conversation: Conversation;
  onBack: () => void;
  onSendMessage: (conversationId: string, message: Partial<ChatMessage>) => void;
}

export function ChatConversationView({
  conversation,
  onBack,
  onSendMessage,
}: ChatConversationViewProps) {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    onSendMessage(conversation.id, {
      sender: 'student',
      text: trimmed,
      time: timeStr,
    });

    setInputText('');
  };

  const handleSendAudio = (duration: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    onSendMessage(conversation.id, {
      sender: 'student',
      text: 'Note vocale',
      audioDuration: duration,
      time: timeStr,
    });

    setIsRecording(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const sizeInKo = Math.round(file.size / 1024);

    onSendMessage(conversation.id, {
      sender: 'student',
      attachment: {
        title: file.name,
        format: file.name.split('.').pop()?.toUpperCase() || 'DOC',
        size: `${sizeInKo} Ko`,
      },
      time: timeStr,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadAttachment = (title: string) => {
    // Simulate downloading/viewing the attached file
    const blob = new Blob([`Contenu du document: ${title}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[560px]">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />

      {/* Conversation Top Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-stone-200/60 mb-4 shrink-0">
        <button
          onClick={onBack}
          type="button"
          aria-label="Retour à la liste des messages"
          className="p-2 -ml-1 rounded-xl bg-white text-stone-600 hover:text-stone-900 shadow-xs border border-stone-200/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D6EADB] text-[#0F3833] font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs">
            {conversation.initials}
          </div>
          <div>
            <h2 className="font-bold text-base text-stone-900 leading-snug">
              {conversation.teacher}
            </h2>
            <p className="text-xs text-stone-500">
              {conversation.role}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 pb-4">
        {conversation.messages.map((msg) => {
          const isStudent = msg.sender === 'student';

          if (isStudent) {
            return (
              <div key={msg.id} className="flex flex-col items-end">
                <div className="bg-[#D6EADB] text-stone-900 px-4 py-3 rounded-2xl rounded-tr-xs max-w-lg shadow-xs space-y-2">
                  {msg.text && (
                    <p className="text-sm sm:text-base leading-relaxed select-text font-normal">
                      {msg.text}
                    </p>
                  )}

                  {msg.audioDuration && (
                    <div className="pt-1">
                      <AudioPlayer duration={msg.audioDuration} />
                    </div>
                  )}

                  {msg.attachment && (
                    <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/70 border border-[#CEEFD8] mt-1">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#E75A24]/10 text-[#E75A24] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-stone-900 truncate">
                            {msg.attachment.title}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {msg.attachment.format} · {msg.attachment.size}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDownloadAttachment(msg.attachment!.title)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-white"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 pt-0.5">
                    <span className="text-[11px] text-[#1B4332]/70 font-medium">
                      {msg.time}
                    </span>
                    <CheckCheck className="w-3.5 h-3.5 text-[#1B4332]/70" />
                  </div>
                </div>
              </div>
            );
          }

          // Teacher message (Left aligned card matching the screenshot)
          return (
            <div key={msg.id} className="flex flex-col items-start">
              <div className="bg-white rounded-2xl rounded-tl-xs p-4 sm:p-5 max-w-md sm:max-w-lg border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
                {msg.text && (
                  <p className="text-sm sm:text-base text-stone-900 leading-relaxed font-normal">
                    {msg.text}
                  </p>
                )}

                {/* Voice note component */}
                {msg.audioDuration && (
                  <div className="pt-0.5">
                    <AudioPlayer duration={msg.audioDuration} />
                  </div>
                )}

                {/* Attachment Card */}
                {msg.attachment && (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-stone-100 hover:border-stone-200 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#FDF0EB] text-[#E75A24] flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate">
                          {msg.attachment.title}
                        </p>
                        <p className="text-xs text-stone-400 font-medium">
                          {msg.attachment.format} · {msg.attachment.size}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadAttachment(msg.attachment!.title)}
                      className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors shrink-0"
                      title="Télécharger la pièce jointe"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="border-t border-stone-100/80 pt-2 flex items-center justify-end">
                  <span className="text-[11px] text-stone-400 font-medium">
                    {msg.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="pt-3 shrink-0">
        {isRecording ? (
          <AudioRecorder
            onSendAudio={handleSendAudio}
            onCancel={() => setIsRecording(false)}
          />
        ) : (
          <form onSubmit={handleSendText} className="flex items-center gap-2.5">
            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Ajouter une pièce jointe"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-stone-200/80 text-stone-600 hover:text-stone-900 hover:bg-stone-50 shadow-2xs flex items-center justify-center shrink-0 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Input pill */}
            <div className="flex-1 bg-white border border-stone-200/80 rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2 shadow-2xs focus-within:border-[#E75A24]/60 focus-within:ring-2 focus-within:ring-[#E75A24]/10 transition-all">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Écrire un message..."
                className="w-full bg-transparent outline-none text-sm sm:text-base text-stone-900 placeholder:text-stone-400"
              />

              {/* Mic Icon */}
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                aria-label="Enregistrer une note vocale"
                className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition-colors shrink-0"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Envoyer le message"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E75A24] text-white flex items-center justify-center shrink-0 hover:bg-[#D04D1B] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all active:scale-95"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ChatConversationView;
