import type { Question } from "@/lib/type";

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
      { id: "p1", name: "Product 1", image: "https://via.placeholder.com/120" },
      { id: "p2", name: "Product 2", image: "https://via.placeholder.com/120" },
      { id: "p3", name: "Product 3", image: "https://via.placeholder.com/120" },
    ],
  },
  {
    id: "delivery",
    type: "textarea",
    prompt: "What do you think about our delivery method?",
    placeholder: "Your thoughts…",
  },
  {
    id: "overall",
    type: "textarea",
    prompt: "Please share your overall experience feedback.",
    placeholder: "Tell us everything…",
  },
  {
    id: "source",
    type: "multi-choice",
    prompt: "How did you hear about our product?",
    options: ["Instagram", "Publicly", "Word of mouth", "Google"],
  },
];