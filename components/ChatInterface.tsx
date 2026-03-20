"use client"

import React, { useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { ArrowUp, Send, Loader2 } from 'lucide-react'
import Message from '@/components/Message'
import { cn } from '@/lib/utils'

const ChatInterface = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-[#FCFCFD]">
      {/* Header */}
      <div className="h-14 flex items-center px-8 border-b border-black/5 bg-white/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-mars-accent animate-pulse" />
          <span className="text-sm font-semibold tracking-tight text-black opacity-80 uppercase">Primary Command Channel</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-10 space-y-8 scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-apple-gray flex items-center justify-center mb-4">
               <ArrowUp className="w-8 h-8 text-black opacity-20" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-black italic">Ares One Ready</h2>
            <p className="text-sm text-black/50 font-medium">
              Awaiting colonist commands. You can ask about life support, geology, or habitat status.
            </p>
          </div>
        )}

        {messages.map((m: any) => (
          <Message key={m.id} role={m.role} content={m.content} />
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 animate-fade-in p-4 px-6 rounded-3xl bg-black/[0.02] border border-black/5 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-mars-accent" />
            <span className="text-xs font-medium text-black/40 uppercase tracking-[0.05em]">Analyzing Tharsis Surface...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-8 pt-0">
        <form 
          onSubmit={handleSubmit}
          className="relative max-w-3xl mx-auto flex items-end gap-2"
        >
          <div className="relative flex-1 group">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              placeholder="Transmit command to Ares One..."
              rows={1}
              className={cn(
                "w-full bg-white ring-1 ring-black/10 rounded-3xl px-6 py-4 pr-16 text-[15px] font-medium transition-all duration-300 resize-none",
                "focus:outline-none focus:ring-2 focus:ring-black/20 focus:shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
                "placeholder:text-black/30"
              )}
              style={{ minHeight: '56px', maxHeight: '200px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2.5 bottom-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                input.trim() ? "bg-black text-white scale-100" : "bg-black/5 text-black/20 scale-90"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center text-black/30 mt-4 uppercase tracking-[0.1em] font-medium">
          Secure Link: Tharsis Base - Ares One Satellite Network 
        </p>
      </div>
    </div>
  )
}

export default ChatInterface
