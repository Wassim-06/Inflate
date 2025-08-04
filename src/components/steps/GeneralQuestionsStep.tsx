// src/components/steps/GeneralQuestionsStep.tsx
"use client"

import type React from "react"
import { useState } from "react"
import type { Branding, Question as QuestionType, ScaleQuestion, MultiChoiceQuestion } from "@/lib/schema"
import type { AnswerValue } from "@/lib/type"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Info, ThumbsUp, ThumbsDown } from "lucide-react"

interface GeneralQuestionsStepProps {
  questions: QuestionType[]
  branding: Branding
  onNext: (answers: Record<string, AnswerValue>) => void
}

const QuestionCard: React.FC<{
  question: QuestionType
  value: AnswerValue
  onChange: (value: AnswerValue) => void
}> = ({ question, value, onChange }) => {
  const renderQuestionInput = () => {
    switch (question.type) {
      case "textarea":
        return (
          <Textarea
            id={question.id}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Votre réponse..."}
            className="mt-2 text-sm"
            rows={3} // Hauteur réduite
          />
        )
      case "multi-choice": {
        const q = question as MultiChoiceQuestion
        return (
          <div className="mt-3 flex flex-wrap gap-2">
            {q.options.map((option) => (
              <Button
                key={option}
                variant={(value as string) === option ? "default" : "outline"}
                onClick={() => onChange(option)}
                className="transition-all duration-200"
              >
                {option}
              </Button>
            ))}
          </div>
        )
      }
      case "yes-no":
        return (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant={(value as string) === "Oui" ? "default" : "outline"}
              onClick={() => onChange("Oui")}
              className="h-auto py-3 text-base transition-transform duration-200 ease-out hover:scale-105"
            >
              <ThumbsUp className="mr-2 h-5 w-5" /> Oui
            </Button>
            <Button
              variant={(value as string) === "Non" ? "default" : "outline"}
              onClick={() => onChange("Non")}
              className="h-auto py-3 text-base transition-transform duration-200 ease-out hover:scale-105"
            >
              <ThumbsDown className="mr-2 h-5 w-5" /> Non
            </Button>
          </div>
        )
      case "scale": {
        const q = question as ScaleQuestion
        return (
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex w-full items-center gap-2">
              {[...Array(q.scale)].map((_, i) => {
                const ratingValue = i + 1
                return (
                  <Button
                    key={ratingValue}
                    variant={(value as number) === ratingValue ? "default" : "outline"}
                    onClick={() => onChange(ratingValue)}
                    className="h-10 w-10 md:h-11 md:w-11 flex-1 rounded-md text-base font-semibold transition-transform duration-200 ease-out hover:scale-105"
                    size="icon"
                  >
                    {ratingValue}
                  </Button>
                )
              })}
            </div>
            {(q.leftLabel || q.rightLabel) && (
              <div className="flex justify-between w-full text-xs text-muted-foreground px-1">
                <span>{q.leftLabel}</span>
                <span>{q.rightLabel}</span>
              </div>
            )}
          </div>
        )
      }
      default:
        return <p className="text-red-500 mt-2">Type de question non supporté.</p>
    }
  }

  return (
    <Card className="p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/10">
      <Label className="text-base font-semibold tracking-tight">
        {question.prompt}
      </Label>
      {renderQuestionInput()}
    </Card>
  )
}

export const GeneralQuestionsStep: React.FC<GeneralQuestionsStepProps> = ({ questions, branding, onNext }) => {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})

  const handleAnswerChange = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const isSubmitDisabled = questions.some(q => answers[q.id] === undefined || answers[q.id] === '')

  return (
    <motion.div
      className="space-y-6 max-w-2xl mx-auto" // Largeur max réduite pour la densité
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="text-center space-y-3">
        {branding.logo && (
          <img src={branding.logo} alt="Logo" className="mx-auto h-16 mb-4" />
        )}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Quelques questions de plus
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-base">
          Vos réponses nous aident à mieux vous servir.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(value) => handleAnswerChange(q.id, value)}
          />
        ))}
      </div>

      <div className="pt-6 border-t border-border">
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={() => onNext(answers)}
            disabled={isSubmitDisabled}
            className={`
              w-full max-w-sm text-base font-semibold transition-all duration-300
              ${!isSubmitDisabled ? "shadow-lg hover:shadow-xl hover:scale-102" : ""}
            `}
            size="lg"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Terminer
          </Button>
          {isSubmitDisabled && (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Info className="h-3 w-3" />
              Veuillez répondre à toutes les questions pour continuer
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}