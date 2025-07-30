import { QUESTIONS } from "@/data/mock";

export const totalSteps = QUESTIONS.reduce((acc, q) => {
  if (q.type === "products") return acc + q.products.length + 1;
  return acc + 1;
}, 0);