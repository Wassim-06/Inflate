"use client"

import type React from "react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ProductReviewStep } from "./steps/ProductReviewStep"
import { TrustpilotStep } from "./steps/TrustpilotStep"
import type { Product, Branding } from "@/lib/schema"
import type { ProductReview } from "@/lib/type"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import { Spinner } from "./spinner"
import { Card } from "./ui/card"
import { RotateCcw, CheckCircle2 } from "lucide-react"

interface ProductReviewFlowProps {
  products: Product[]
  branding: Branding
  trustpilotLink: string
}

// Simulation d'envoi des avis avec feedback amélioré
async function postReviews(reviews: Record<string, ProductReview>) {
  console.log("🚀 Envoi des avis vers l'API...", reviews)
  // Simulation d'un délai réaliste
  return new Promise((resolve) => setTimeout(resolve, 1200))
}

export const ProductReviewFlow: React.FC<ProductReviewFlowProps> = ({ products, branding, trustpilotLink }) => {
  const [step, setStep] = useState<"review" | "trustpilot">("review")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const handleReviewSubmit = async (reviews: Record<string, ProductReview>) => {
    setIsLoading(true)
    setLoadingProgress(0)

    // Animation du progress pendant le chargement
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
      await postReviews(reviews)
      setLoadingProgress(100)

      // Petit délai pour montrer le 100%
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

  const handleRestart = () => {
    setStep("review")
    setLoadingProgress(0)
  }

  const progressValue = step === "review" ? 50 : 100

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header avec progress */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto mb-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                                    ${step === "review" ? "bg-primary text-primary-foreground" : "bg-green-500 text-white"}
                                `}
                >
                  {step === "review" ? "1" : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Étape {step === "review" ? "1" : "2"} sur 2
                </span>
              </div>
            </div>

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
            initial={{ opacity: 0, x: step === "trustpilot" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === "trustpilot" ? -50 : 50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {step === "review" ? (
              <ProductReviewStep products={products} branding={branding} onNext={handleReviewSubmit} />
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
