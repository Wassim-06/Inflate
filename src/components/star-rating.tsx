"use client"

import type React from "react"
import { useState } from "react"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  size?: number
  "aria-labelledby"?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 24,
  "aria-labelledby": ariaLabelledBy,
}) => {
  const [hoverValue, setHoverValue] = useState<number>(0)

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-labelledby={ariaLabelledBy}
      onMouseLeave={() => setHoverValue(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverValue || value)
        return (
          <motion.button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === value}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onMouseEnter={() => setHoverValue(star)}
            onClick={() => onChange(star)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Star
              size={size}
              className={`transition-all duration-200 ${
                isActive ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" : "text-gray-300 hover:text-yellow-300"
              }`}
            />
          </motion.button>
        )
      })}
    </div>
  )
}
