import React, { useState, useRef, useEffect } from 'react'
import {
  ArrowUp,
  Mic
} from 'lucide-react'

import Chat from './Chat'

export interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

export interface ChatWindowProps {
  className?: string
  initialMessages?: ChatMessage[]
}

const defaultInitialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      "Hello! I'm Nomad, your personal travel architect. Where are we heading next? Tell me your destination, dates, budget, or the kind of vibe you're looking for!",
  },
  {
    id: 'msg-2',
    role: 'user',
    content:
      "I'm planning a 7-day trip to Kyoto and Tokyo around late October. My budget is around $3,500.",
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content:
      "Wonderful choice! Late October is prime autumn foliage season. I've populated the timeline on the right with non-stop flights from JFK to Haneda, boutique ryokans in Gion, and curated temple walks.",
  },
]

export const ChatWindow: React.FC<ChatWindowProps> = ({
  className = '',
  initialMessages = defaultInitialMessages,
}) => {
  const [messages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Explicit no-op on submission per user instruction:
  // "nothing should happen when the user clicks enter and 'sends a chat' it shouldnt even be displayed for now"
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div
      className={`w-full h-full bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden relative ${className}`}
      style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
    >
      {/* 1. Clean Header */}
      <header className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-9 h-9 rounded-full bg-[#00652c] flex items-center justify-center text-white font-bold text-sm shadow-xs"
              style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
            >
              N
            </div>
            {/* Live Status Indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="flex flex-col">
            <h3
              className="text-base font-semibold text-slate-900 leading-tight"
              style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
            >
              Nomad
            </h3>
          </div>
        </div>
      </header>

      {/* 2. Conversation Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 timeline-scrollbar flex flex-col justify-start">
        <div className="space-y-4 flex flex-col">
          {messages.map((msg) => (
            <Chat
              key={msg.id}
              content={msg.content}
              user={msg.role === 'user'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. Input Bar */}
      <div className="p-4 border-t border-slate-100 bg-white/95 backdrop-blur-xs">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 bg-[#F8F9FA] border border-slate-200/90 rounded-2xl p-1.5 pl-3 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/15 transition-all shadow-2xs"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Nomad anything about your trip..."
            className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-slate-800 placeholder:text-slate-400 px-1 py-1"
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-red-50 text-red-600 animate-pulse ring-1 ring-red-200'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
            }`}
            title={isListening ? 'Stop listening' : 'Speak to Nomad'}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            className="w-8 h-8 rounded-full bg-[#00652c] text-white hover:bg-[#005323] flex items-center justify-center transition-all shadow-xs cursor-pointer flex-shrink-0"
            title="Send message"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
