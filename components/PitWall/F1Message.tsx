"use client";

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface F1MessageProps {
  role: string;
  content: string;
  time: string;
}

export default function F1Message({ role, content = '', time }: F1MessageProps) {
  const isDriver = role === 'user';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className={`flex items-start gap-4 max-w-2xl ${isDriver ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
    >
      {/* Avatar Badge */}
      <div className={`shrink-0 w-10 h-10 border flex items-center justify-center font-bold font-mono text-xs tracking-tighter ${
        isDriver 
          ? 'border-[#FFB4AA] bg-[#FFB4AA]/10 text-[#FFB4AA]' 
          : 'border-[#B9D164] bg-[#B9D164]/10 text-[#B9D164]'
      }`}>
        {isDriver ? 'DRV' : 'STR'}
      </div>

      {/* Message Body */}
      <div className={`flex-1 ${isDriver ? 'text-left' : 'text-right'}`}>
        <div className="text-[10px] text-[#A88A85] mb-2 font-mono uppercase tracking-widest">
          TIME: {time} | {isDriver ? 'CHANNEL: ONBOARD-1' : 'PITWALL AI CORE'}
        </div>
        
        <div className={`p-4 bg-[#2A1C1E]/60 backdrop-blur-md text-[#F5DDDE] text-[13px] leading-relaxed font-mono text-left ${
          isDriver ? 'border-l-2 border-[#FFB4AA]' : 'border-r-2 border-[#B9D164]'
        }`}>
          <ReactMarkdown 
            components={{
              p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed text-[#E1BFBA]">{children}</p>,
              strong: ({children}) => <strong className="text-[#B9D164] font-bold">{children}</strong>,
              ul: ({children}) => <ul className="list-disc pl-5 mb-3 space-y-1 text-[#E1BFBA]">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-[#E1BFBA]">{children}</ol>,
              li: ({children}) => <li className="text-[#E1BFBA]">{children}</li>,
              code: ({children}) => <code className="bg-[#170B0C] text-[#FFB4AA] px-1.5 py-0.5 border border-[#59413E] text-[11px]">{children}</code>,
              h1: ({children}) => <h1 className="text-[#FFB4AA] font-bold text-base mb-2">{children}</h1>,
              h2: ({children}) => <h2 className="text-[#FFB4AA] font-bold text-sm mb-2">{children}</h2>,
              h3: ({children}) => <h3 className="text-[#FFB4AA] font-bold text-xs mb-1 uppercase tracking-wider">{children}</h3>,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}
