import { cn } from "@/lib/utils";

export const ChatBubble: React.FC<{ role: 'bot' | 'user'; children: React.ReactNode }> = ({ role, children }) => {
  return (
    <div className={cn('w-full flex', role === 'bot' ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
          role === 'bot' ? 'bg-muted text-foreground' : 'bg-black text-white'
        )}
      >
        {children}
      </div>
    </div>
  )
}