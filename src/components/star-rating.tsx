import { cn } from "@/lib/utils";
import { Star } from 'lucide-react'

export const StarRating: React.FC<{ value: number; onChange: (val: number) => void; size?: number }> = ({ value, onChange, size = 22 }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1
        return (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n}`}
            onClick={() => onChange(n)}
            className="p-1"
          >
            <Star
              size={size}
              className={cn('transition-transform', n <= value ? 'fill-current' : 'fill-transparent', 'stroke-current')}
            />
          </button>
        )
      })}
    </div>
  )
}