// src/lib/schema.ts
import { z } from "zod";

// Schema for product objects
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url().nullable(),
});

// Schema for NPS questions
export const NPSSchema = z.object({
  id: z.literal("nps"),
  type: z.literal("nps"),
  prompt: z.string(),
  scale: z.number(),
  leftLabel: z.string(),
  rightLabel: z.string(),
});

// Schema for Scale questions
export const ScaleQuestionSchema = z.object({
  id: z.string(),
  type: z.literal("scale"),
  prompt: z.string(),
  scale: z.number(),
  leftLabel: z.string(),
  rightLabel: z.string(),
});

// Schema for Radio questions (A/B test)
export const RadioOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  image: z.string().url().optional(),
});
// ✅ FIX: Export the inferred type for use in other components.
export type RadioOption = z.infer<typeof RadioOptionSchema>;

export const RadioQuestionSchema = z.object({
  id: z.string(),
  type: z.literal("radio"),
  prompt: z.string(),
  options: z.array(RadioOptionSchema),
});

// Schema for questions with products
export const ProductsQuestionSchema = z.object({
  id: z.literal("products"),
  type: z.literal("products"),
  prompt: z.string(),
  products: z.array(ProductSchema),
});

// Schema for textarea questions
export const TextareaQuestionSchema = z.object({
  id: z.string(),
  type: z.literal("textarea"),
  prompt: z.string(),
  placeholder: z.string().optional(),
});

// Schema for multi-choice questions
export const MultiChoiceQuestionSchema = z.object({
  id: z.string(),
  type: z.literal("multi-choice"),
  prompt: z.string(),
  options: z.array(z.string()),
});

// Discriminated union for all question types
export const QuestionSchema = z.discriminatedUnion("type", [
  NPSSchema,
  ProductsQuestionSchema,
  TextareaQuestionSchema,
  MultiChoiceQuestionSchema,
  ScaleQuestionSchema,
  RadioQuestionSchema,
]);

// Schema for branding data
export const BrandingSchema = z.object({
  logo: z.string().url(),
  brandColor: z.string(),
  background: z.string().optional(),
  font: z.string(),
});

// Schema for the overall response data from the API
export const QuestionsDataSchema = z.object({
  questions: z.array(QuestionSchema),
  products: z.array(ProductSchema).optional(),
  branding: z.array(BrandingSchema),
}).optional();


// ✅ TYPES: Export de types inférés avec des noms clairs et non-conflictuels
export type QuestionData = z.infer<typeof QuestionsDataSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type ProductsQuestion = z.infer<typeof ProductsQuestionSchema>;
export type NpsQuestion = z.infer<typeof NPSSchema>;
export type TextareaQuestion = z.infer<typeof TextareaQuestionSchema>;
export type MultiChoiceQuestion = z.infer<typeof MultiChoiceQuestionSchema>;
export type ScaleQuestion = z.infer<typeof ScaleQuestionSchema>;
export type RadioQuestion = z.infer<typeof RadioQuestionSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type Product = z.infer<typeof ProductSchema>;