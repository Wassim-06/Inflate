// src/lib/type.ts
export type QuestionType = 'nps' | 'products' | 'textarea' | 'multi-choice'

export interface BaseQuestion<T = unknown> {
  id: string
  type: QuestionType
  prompt: string
  required?: boolean
  // Whether to POST after it's answered (default true)
  postImmediately?: boolean
  // Optional: transform answer before POST
  serialize?: (answer: T) => unknown
}

export interface NpsQuestion extends BaseQuestion<number> {
  type: 'nps'
  scale?: number // default 10
  leftLabel?: string
  rightLabel?: string
}

export interface ProductItem {
  id: string
  name: string
  image?: string
}

export interface ProductsQuestion extends BaseQuestion<ProductReviewAnswer> {
  type: 'products'
  products: ProductItem[]
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

export type Question = NpsQuestion | ProductsQuestion | TextareaQuestion | MultiChoiceQuestion


export interface Branding {
  "logo": string
  "color": string
  "background": string
  "font": string
}