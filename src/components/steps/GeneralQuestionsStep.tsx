// src/components/steps/GeneralQuestionsStep.tsx
"use client"

import type React from "react"
import { useState } from "react"
import type { Branding, Question as QuestionType } from "@/lib/schema"
import type { AnswerValue } from "@/lib/type"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2, Info } from "lucide-react"

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
            rows={4}
          />
        )
      case "multi-choice":
        return (
          <RadioGroup
            value={(value as string) || ""}
            onValueChange={onChange}
            className="mt-3 space-y-2"
          >
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <Label htmlFor={`${question.id}-${option}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      default:
        return <p>Type de question non supporté.</p>
    }
  }

  return (
    <Card className="p-6 transition-all hover:shadow-lg hover:border-primary/20">
      <Label htmlFor={question.id} className="text-base font-semibold">
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
  
  // Pour l'instant, nous considérons toutes les questions comme répondues si une valeur existe.
  const isSubmitDisabled = Object.keys(answers).length !== questions.length

  return (
    <motion.div
      className="space-y-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="text-center space-y-4">
          {branding.logo && (
              <img src={branding.logo} alt="Logo" className="mx-auto h-22 mb-6" />
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Quelques questions de plus
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Vos réponses nous aident à mieux vous servir.
          </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(value) => handleAnswerChange(q.id, value)}
          />
        ))}
      </div>

      <div className="pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-4">
              {isSubmitDisabled && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Veuillez répondre à toutes les questions pour continuer
                  </p>
              )}
              <Button
                  onClick={() => onNext(answers)}
                  disabled={isSubmitDisabled}
                  className="w-full max-w-md text-lg py-6 font-semibold"
                  size="lg"
              >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Terminer et voir la suite
              </Button>
          </div>
      </div>
    </motion.div>
  )
}