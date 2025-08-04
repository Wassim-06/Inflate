// src/components/ProductReviewFlow.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ProductReviewStep } from "./steps/ProductReviewStep"
import { TrustpilotStep } from "./steps/TrustpilotStep"
import { GeneralQuestionsStep } from "./steps/GeneralQuestionsStep"
import type { Product, Branding, Question } from "@/lib/schema"
import type { ProductReview, AnswerValue } from "@/lib/type"
import { Progress } from "./ui/progress"
import { Spinner } from "./spinner"
import { Card } from "./ui/card"
// L'import du Button n'est plus nécessaire ici si non utilisé ailleurs dans ce composant
// import { Button } from "./ui/button" 

// Payload combiné pour l'envoi
interface ReviewPayload {
  productReviews: Record<string, ProductReview>
  additionalQuestions: Record<string, AnswerValue>
}

// Simulation d'envoi des avis avec feedback amélioré
async function postReviews(payload: ReviewPayload) {
  console.log("🚀 Envoi des avis vers l'API...", payload)
  // Simulation d'un délai réaliste
  return new Promise((resolve) => setTimeout(resolve, 1200))
}

interface ProductReviewFlowProps {
  products: Product[]
  branding: Branding
  trustpilotLink: string
  questions: Question[]
}

export const ProductReviewFlow: React.FC<ProductReviewFlowProps> = ({
  products,
  branding,
  trustpilotLink,
  questions,
}) => {
  const initialReviews: Record<string, ProductReview> = Object.fromEntries(
    products.map((p: Product) => [p.id, { rating: 0, comment: "" }]),
  )

  const [step, setStep] = useState<"review" | "general" | "trustpilot">("review")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [generalAnswers, setGeneralAnswers] = useState<Record<string, AnswerValue>>({})
  const [productReviews, setProductReviews] = useState<Record<string, ProductReview>>(initialReviews)

  // scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  // Étape 1 : l'utilisateur soumet les avis produits, on les garde et on passe au formulaire général
  const handleReviewNext = (reviews: Record<string, ProductReview>) => {
    setProductReviews(reviews)
    setStep("general")
  }

  // Étape 2 : on reçoit les réponses générales, on envoie tout et on passe à Trustpilot
  const handleGeneralSubmit = async (answers: Record<string, AnswerValue>) => {
    setGeneralAnswers(answers)
    setIsLoading(true)
    setLoadingProgress(0)

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 120)

    try {
      await postReviews({
        productReviews,
        additionalQuestions: answers,
      })
      setLoadingProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setStep("trustpilot")
      }, 500)
    } catch (error) {
      console.error("Erreur lors de l'envoi des avis:", error)
      setIsLoading(false)
      clearInterval(progressInterval)
    }
  }

  const handlePublishToTrustpilot = () => {
    if (trustpilotLink) {
      window.open(trustpilotLink, "_blank", "noopener,noreferrer")
    }
  }

  // ## CHANGEMENT 1: La progression est maintenant sur 2 étapes ##
  const progressMap: Record<typeof step, number> = {
    review: 50,
    general: 100,
    trustpilot: 100, // Le processus est considéré comme terminé
  }
  const progressValue = progressMap[step]

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header avec progress */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
            {/* Le bouton Recommencer a été retiré */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="w-full h-2" />
            </div>
          </Card>
        </motion.div>

        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {step === "review" ? (
              <ProductReviewStep products={products} branding={branding} onNext={handleReviewNext} />
            ) : step === "general" ? (
              <GeneralQuestionsStep questions={questions} branding={branding} onNext={handleGeneralSubmit} />
            ) : (
              <TrustpilotStep onPublish={handlePublishToTrustpilot} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Loading Overlay amélioré */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center z-50"
            >
              <Card className="p-8 max-w-sm w-full mx-4 text-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Spinner className="mx-auto" />
                </motion.div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Enregistrement en cours...</h3>
                  <p className="text-sm text-muted-foreground">Nous sauvegardons vos précieux avis</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">{loadingProgress}%</span>
                  </div>
                  <Progress value={loadingProgress} className="w-full" />
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}