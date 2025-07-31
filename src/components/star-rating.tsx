// src/components/star-rating.tsx
import { cn } from "@/lib/utils";
import { Star } from 'lucide-react';
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  size?: number;
  readOnly?: boolean;
  // Ajout d'une prop 'variant' pour gérer les contextes de couleur
  variant?: 'default' | 'inverted';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 22,
  readOnly = false,
  // Valeur par défaut pour la nouvelle prop
  variant = 'default',
}) => {
  const [hoverValue, setHoverValue] = useState<number | undefined>(undefined);

  const handleMouseOver = (n: number) => {
    if (readOnly) return;
    setHoverValue(n);
  }

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(undefined);
  }

  const handleClick = (n: number) => {
    if (readOnly || !onChange) return;
    onChange(n);
  }

  // Logique pour choisir les bonnes couleurs en fonction de la variante
  const filledColorClass = variant === 'inverted'
    ? 'fill-primary-foreground text-primary-foreground'
    : 'fill-primary text-primary';

  const emptyColorClass = variant === 'inverted'
    ? 'fill-transparent text-primary-foreground/50'
    : 'fill-transparent text-muted-foreground/50';

  return (
    <div className={cn("flex items-center gap-1", { "cursor-pointer": !readOnly, "cursor-default": readOnly })}>
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const displayValue = hoverValue ?? value;
        const isFilled = n <= displayValue;

        return (
          <button
            key={n}
            type="button"
            aria-label={`Noter ${n} sur 5`}
            disabled={readOnly}
            onClick={() => handleClick(n)}
            onMouseOver={() => handleMouseOver(n)}
            onMouseLeave={handleMouseLeave}
            className="p-1 transition-transform duration-150 ease-in-out hover:scale-125 active:scale-100 disabled:cursor-default disabled:transform-none"
          >
            <Star
              size={size}
              className={cn(
                'transition-colors duration-200',
                // Applique la bonne classe de couleur ici
                isFilled ? filledColorClass : emptyColorClass
              )}
            />
          </button>
        )
      })}
    </div>
  )
}