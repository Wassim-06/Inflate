// src/data/mock.ts
import type { Question, Branding, Product } from "@/lib/schema";

export const MOCK_BRANDING: Branding = {
  logo: 'https://placehold.co/100x40/000000/FFFFFF?text=MA+MARQUE',
  brandColor: '#000000',
  font: 'Inter, sans-serif',
};

// ✅ NOUVEAU: Export direct des produits pour la démo
export const MOCK_PRODUCTS: Product[] = [
    { id: "p1", name: "T-shirt en Coton Bio", image: "https://placehold.co/120x120/3498db/ffffff?text=P1" },
    { id: "p2", name: "Jean Slim-Fit Recyclé", image: "https://placehold.co/120x120/2ecc71/ffffff?text=P2" },
    { id: "p3", name: "Baskets Véganes Blanches", image: "https://placehold.co/120x120/9b59b6/ffffff?text=P3" },
    { id: "p4", name: "Gourde Inox Isotherme", image: "https://placehold.co/120x120/e74c3c/ffffff?text=P4" },
];

// 🔄 MODIFIÉ: Structure de questions simplifiée, NPS retiré.
export const QUESTIONS: Question[] = [
  // 🗑️ SUPPRIMÉ: La question NPS a été retirée.
  {
    id: "products",
    type: "products",
    prompt: "Veuillez évaluer les produits suivants :",
    products: MOCK_PRODUCTS,
  },
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