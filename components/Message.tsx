"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { User, Cpu } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MessageProps {
  role: string | 'user' | 'assistant'
  content: string
}

const Message = ({ role, content }: MessageProps) => {
  const isUser = role === 'user'

  return (
    <div className={cn(
      "flex flex-col animate-fade-in group",
      isUser ? "items-end pl-12" : "items-start pr-12"
    )}>
      {/* Label and Badge */}
      <div className={cn(
        "flex items-center gap-2 mb-2 px-1",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "w-6 h-6 rounded-lg flex items-center justify-center border border-black/5",
          isUser ? "bg-black text-white shadow-sm" : "bg-white text-mars-accent shadow-sm border-mars-accent/10"
        )}>
           {isUser ? <User className="w-3" strokeWidth={2.5}/> : <Cpu className="w-3" strokeWidth={2.5}/>}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-black/40">
           {isUser ? "L2 Colonist" : "ARES ONE SAT LINK"}
        </span>
      </div>

      {/* Bubble */}
      <div className={cn(
        "relative rounded-[1.6rem] px-6 py-4 max-w-full lg:max-w-2xl shadow-sm transition-all duration-300",
        isUser 
          ? "bg-[#1D1D1F] text-white rounded-tr-none hover:shadow-black/[0.08]" 
          : "bg-white border border-black/5 text-[#1D1D1F] rounded-tl-none stitch-bg hover:border-black/10 hover:shadow-md"
      )}>
        <div className={cn(
          "prose prose-sm max-w-none",
          isUser ? "prose-invert" : "text-[#424245]"
        )}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({children}) => <p className="leading-relaxed font-medium mb-3 last:mb-0">{children}</p>,
              table: ({children}) => (
                <div className="overflow-x-auto my-4 rounded-xl border border-black/5 bg-black/[0.02]">
                  <table className="min-w-full text-xs text-left">
                    {children}
                  </table>
                </div>
              ),
              th: ({children}) => <th className="px-3 py-2 bg-black/5 font-bold uppercase tracking-wider">{children}</th>,
              td: ({children}) => <td className="px-3 py-2 border-t border-black/5 font-mono">{children}</td>,
              strong: ({children}) => <strong className="text-mars-accent font-bold">{children}</strong>,
              hr: () => <hr className="my-4 border-black/5" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default Message
