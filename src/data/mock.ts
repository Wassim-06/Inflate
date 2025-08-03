// src/data/mock.ts
import type { Question, Branding, Product } from "@/lib/schema";

export const MOCK_BRANDING: Branding = {
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Louis_Vuitton_logo_and_wordmark.svg/246px-Louis_Vuitton_logo_and_wordmark.svg.png?20220207052202',
  brandColor: '#000000',
  font: 'Inter, sans-serif',
};

export const MOCK_PRODUCTS: Product[] = [
    { id: "p1", name: "T-shirt en Coton Bio", image: "https://placehold.co/120x120/3498db/ffffff?text=P1" },
    { id: "p2", name: "Jean Slim-Fit Recyclé", image: "https://placehold.co/120x120/2ecc71/ffffff?text=P2" },
    { id: "p3", name: "Baskets Véganes Blanches", image: "https://placehold.co/120x120/9b59b6/ffffff?text=P3" },
    { id: "p4", name: "Gourde Inox Isotherme", image: "https://placehold.co/120x120/e74c3c/ffffff?text=P4" },
];

export const QUESTIONS: Question[] = [
  {
    id: "delivery",
    type: "textarea",
    prompt: "Que pensez-vous de notre service de livraison ?",
    placeholder: "Rapide, lent, emballage...",
  },
  {
    id: "source",
    type: "multi-choice",
    prompt: "Comment avez-vous entendu parler de nous ?",
    options: ["Instagram", "Publicité", "Bouche à oreille", "Google"],
  }
];