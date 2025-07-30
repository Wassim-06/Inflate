import { z } from "zod";

// Schema for product objects
const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().nullable(),
});

// Schema for NPS questions
const NPSSchema = z.object({
  id: z.literal("nps"),
  type: z.literal("nps"),
  prompt: z.string(),
  scale: z.number(),
  leftLabel: z.string(),
  rightLabel: z.string(),
});

// Schema for questions with products
const ProductsQuestionSchema = z.object({
  id: z.literal("products"),
  type: z.literal("products"),
  prompt: z.string(),
  products: z.array(ProductSchema),
});

// Schema for textarea questions (used for 'delivery' and 'overall')
const TextareaQuestionSchema = z.object({
  id: z.string(),
  type: z.literal("textarea"),
  prompt: z.string(),
  placeholder: z.string(),
});

// Schema for multi-choice questions
const MultiChoiceQuestionSchema = z.object({
  id: z.literal("source"),
  type: z.literal("multi-choice"),
  prompt: z.string(),
  options: z.array(z.string()),
});

// Discriminated union for all question types
const QuestionSchema = z.discriminatedUnion("type", [
  NPSSchema,
  ProductsQuestionSchema,
  TextareaQuestionSchema,
  MultiChoiceQuestionSchema,
]);

const BrandingSchema = z.object({
  logo: z.string(),
  color: z.string(),
  background: z.string(),
  font: z.string(),
});

// Schema for the overall response
const QuestionsDataSchema = z.object({
  questions: z.array(QuestionSchema),
  products: z.array(ProductSchema),
  branding: z.array(BrandingSchema),
}).optional();


export { ProductSchema, NPSSchema, ProductsQuestionSchema, TextareaQuestionSchema, MultiChoiceQuestionSchema, QuestionSchema, QuestionsDataSchema };

export type QuestionData = z.infer<typeof QuestionsDataSchema>;
export type QuestionSchema = z.infer<typeof QuestionSchema>;
export type ProductsQuestionSchema = z.infer<typeof ProductsQuestionSchema>;
export type NPSSchema = z.infer<typeof NPSSchema>;
export type TextareaQuestionSchema = z.infer<typeof TextareaQuestionSchema>;
export type MultiChoiceQuestionSchema = z.infer<typeof MultiChoiceQuestionSchema>;
export type BrandingSchema = z.infer<typeof BrandingSchema>;
export type ProductSchema = z.infer<typeof ProductSchema>;