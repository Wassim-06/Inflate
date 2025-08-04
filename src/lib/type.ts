// src/lib/type.ts
export type QuestionType = 'nps' | 'products' | 'textarea' | 'multi-choice' | 'scale' | 'yes-no';

export interface BaseQuestion<T = unknown> {
 id: string
 type: QuestionType
 prompt: string
 required?: boolean
}

export interface NpsQuestion extends BaseQuestion<number> {
  type: 'nps'
  scale?: number
  leftLabel?: string
  rightLabel?: string
}

export interface ProductsQuestion extends BaseQuestion<ProductReviewAnswer> {
  type: 'products'
  products: { id: string; name: string; image?: string; }[]
}

export interface ProductReviewAnswer {
  ratings: Record<string, number>
  comments: Record<string, string>
}

interface TextareaQuestion extends BaseQuestion<string> {
  type: 'textarea'
  placeholder?: string
}

interface MultiChoiceQuestion extends BaseQuestion<string> {
  type: 'multi-choice'
  options: string[]
}

interface ScaleQuestion extends BaseQuestion<number> {
  type: 'scale';
  scale: number;
  leftLabel?: string;
  rightLabel?: string;
}

interface YesNoQuestion extends BaseQuestion<string> {
  type: 'yes-no';
}

export type Question = NpsQuestion | ProductsQuestion | TextareaQuestion | MultiChoiceQuestion | ScaleQuestion | YesNoQuestion;

export interface Branding {
  "logo": string
  "brandColor": string
  "font": string
}

export interface ProductReview {
  rating: number;
  comment: string;
}

export type AnswerValue = string | number | string[];

export interface AllAnswers {
  productReviews: Record<string, ProductReview>;
  additionalQuestions: Record<string, AnswerValue>;
}
