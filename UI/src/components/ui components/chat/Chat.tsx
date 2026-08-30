import React from 'react'
import { User as UserIcon } from 'lucide-react'

export interface ChatProps {
  content: string
  user?: boolean
  role?: 'assistant' | 'user'
  className?: string
}

export const Chat: React.FC<ChatProps> = ({
  content,
  user,
  role,
  className = '',
}) => {
  const isUser = user ?? role === 'user'

  return (
    <div
      className={`flex items-start gap-2.5 max-w-[88%] ${
        isUser
          ? 'self-end ml-auto flex-row-reverse justify-start'
          : 'self-start mr-auto flex-row justify-start'
      } ${className}`}
      style={{ fontFamily: "var(--font-sans, 'Outfit', sans-serif)" }}
    >
      {/* Profile Avatar */}
      {isUser ? (
        <div
          className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs"
          title="You"
        >
          <UserIcon className="w-3.5 h-3.5 text-slate-600" />
        </div>
      ) : (
        <div
          className="w-7 h-7 rounded-full bg-[#00652c] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 shadow-2xs"
          style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)" }}
          title="Nomad"
        >
          N
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed ${
          isUser
            ? 'bg-[#00652c] text-white rounded-tr-xs shadow-2xs'
            : 'bg-[#F8F9FA] text-slate-800 border border-slate-200/70 rounded-tl-xs shadow-2xs'
        }`}
      >
        {content}
      </div>
    </div>
  )
}

export default Chat
