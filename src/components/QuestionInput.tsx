// QuestionInput.tsx
import React from 'react';

// ✅ Import des composants shadcn/ui nécessaires
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface QuestionInputProps {
  type: string;
  value: string;
  onChange: (value: string) => void;
  products?: { name: string; image: string }[];
}

const QuestionInput: React.FC<QuestionInputProps> = ({ type, value, onChange, products }) => {
  switch (type) {
    case 'yes/no':
      return (
        // ✅ Utilisation de RadioGroup pour la compatibilité des thèmes
        <RadioGroup value={value} onValueChange={onChange} className="flex items-center gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="r-yes" />
            <Label htmlFor="r-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="r-no" />
            <Label htmlFor="r-no">No</Label>
          </div>
        </RadioGroup>
      );
    case 'open':
      return (
        // ✅ Utilisation du composant Textarea qui gère les thèmes
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Votre réponse..."
        />
      );
    case 'rating':
      return (
        // ✅ Utilisation de RadioGroup pour un affichage propre et thématique
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-4">
          {[...Array(10)].map((_, index) => {
            const ratingValue = (index + 1).toString();
            return (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={ratingValue} id={`r-${ratingValue}`} />
                <Label htmlFor={`r-${ratingValue}`}>{ratingValue}</Label>
              </div>
            );
          })}
        </RadioGroup>
      );
    case 'product-review':

      return (
        <div>
          {products?.map((product, index) => (
            <div key={index} className="mb-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 mb-2" />
              <p>{product.name}</p>
              <div>
                {[...Array(5)].map((_, starIndex) => (
                  <label key={starIndex}>
                    <input
                      type="radio"
                      value={(starIndex + 1).toString()}
                      checked={value === (starIndex + 1).toString()}
                      onChange={() => onChange((starIndex + 1).toString())}
                    />
                    {starIndex + 1} Star
                  </label>
                ))}
              </div>
              <textarea
                placeholder="Add your comment"
                className="border border-gray-300 rounded p-2 w-full mt-2"
              />
            </div>
          ))}
          <Button>Fill All Ratings</Button>
        </div>
      );
    default:
      return <div>Unsupported question type</div>;
  }
};

export default QuestionInput;
