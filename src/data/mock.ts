// src/data/mock.ts
import type { Question, Branding } from "@/lib/schema"; // Assurez-vous d'importer le type Branding


export const MOCK_BRANDING: Branding = {
  logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Logo',
  brandColor: '#000000',
  font: 'Inter, sans-serif',
};

// On type notre tableau avec le type Zodinféré `Question`
export const QUESTIONS: Question[] = [
  {
    id: "nps",
    type: "nps",
    prompt: "How likely are you to recommend us to a friend?",
    scale: 10,
    leftLabel: "1 – Not likely",
    rightLabel: "10 – Very likely",
  },
  {
    id: "products",
    type: "products",
    prompt: "Please rate the following products:",
    products: [
      { id: "p1", name: "Product 1", image: "https://placehold.co/120x120/E0E0E0/000000?text=P1" },
      { id: "p2", name: "Product 2", image: "https://placehold.co/120x120/E0E0E0/000000?text=P2" },
    ],
  },
  // Conforme au ScaleQuestionSchema
  {
    id: "satisfaction",
    type: "scale",
    prompt: "How satisfied are you with the product quality?",
    scale: 5,
    leftLabel: "Very unsatisfied",
    rightLabel: "Very satisfied",
  },
  // Conforme au RadioQuestionSchema
  {
    id: "packaging",
    type: "radio",
    prompt: "Which packaging design do you prefer?",
    options: [
      { id: "a", label: "Design A", image: "https://placehold.co/150x150/ff0000/FFFFFF?text=A" },
      { id: "b", label: "Design B", image: "https://placehold.co/150x150/0000FF/FFFFFF?text=B" },
    ],
  },
  {
    id: "delivery",
    type: "textarea",
    prompt: "What do you think about our delivery method?",
    placeholder: "Your thoughts…",
  },
  // Exemple de multi-choice pour la complétude
  {
    id: "source",
    type: "multi-choice",
    prompt: "How did you hear about our product?",
    options: ["Instagram", "Publicity", "Word of mouth", "Google"],
  }
];
