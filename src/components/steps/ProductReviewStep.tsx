"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Product, Branding } from "@/lib/schema"
import type { ProductReview } from "@/lib/type"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Info, Sparkles } from "lucide-react"

interface ProductReviewStepProps {
  products: Product[]
  branding: Branding
  onNext: (reviews: Record<string, ProductReview>) => void
}

const ProductReviewCard: React.FC<{
  product: Product
  review: ProductReview
  onUpdate: (field: keyof ProductReview, value: string | number) => void
  isCompleted: boolean
  index: number
}> = ({ product, review, onUpdate, isCompleted, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const ratingId = `rating-${product.id}`
  const commentId = `comment-${product.id}`

  useEffect(() => {
    if (isCompleted && review.rating > 0) {
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCompleted, review.rating])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`
                overflow-hidden transition-all duration-300 ease-out relative
                ${isHovered ? "shadow-xl scale-[1.02] dark:shadow-primary/20" : "shadow-md hover:shadow-lg"}
                ${isCompleted ? "ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/20" : ""}
                border-l-4 ${isCompleted ? "border-l-green-500" : "border-l-transparent"}
            `}
      >
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-2 right-2 z-10"
            >
              <div className="bg-green-500 text-white rounded-full p-1">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 p-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold tracking-tight text-lg">{product.name}</h3>
              {isCompleted && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Évalué
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label id={ratingId} className="text-sm font-medium text-muted-foreground">
                  Votre note *
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Cliquez sur les étoiles pour noter ce produit</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <StarRating
                  aria-labelledby={ratingId}
                  value={review.rating}
                  onChange={(rating) => onUpdate("rating", rating)}
                  size={28}
                />
              </motion.div>
              {review.rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-muted-foreground"
                >
                  {review.rating === 5
                    ? "Excellent !"
                    : review.rating === 4
                      ? "Très bien"
                      : review.rating === 3
                        ? "Bien"
                        : review.rating === 2
                          ? "Moyen"
                          : "À améliorer"}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor={commentId} className="text-sm font-medium text-muted-foreground">
                Votre commentaire (optionnel)
              </label>
              <Textarea
                id={commentId}
                placeholder="Qu'avez-vous pensé de ce produit ? Partagez votre expérience..."
                value={review.comment}
                onChange={(e) => onUpdate("comment", e.target.value)}
                rows={3}
                className={`
                                    transition-all duration-200 text-sm resize-none
                                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                                    ${review.comment ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}
                                `}
              />
              {review.comment && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground">
                  {review.comment.length} caractères
                </motion.p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 p-4 lg:order-last">
            {product.image ? (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-28 w-28 rounded-xl object-cover shadow-lg"
                  loading="lazy"
                />
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-28 w-28 rounded-xl bg-muted text-muted-foreground text-xs border-2 border-dashed">
                <Sparkles className="h-6 w-6 mb-1" />
                Photo indisponible
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export const ProductReviewStep: React.FC<ProductReviewStepProps> = ({ products, branding, onNext }) => {
  const [reviews, setReviews] = useState<Record<string, ProductReview>>(() =>
    Object.fromEntries(products.map((p: Product) => [p.id, { rating: 0, comment: "" }])),
  )
  const [globalRating, setGlobalRating] = useState<number>(0)
  const [useGlobalRating, setUseGlobalRating] = useState<boolean>(false)
  const [completedCount, setCompletedCount] = useState(0)

  const handleUpdateReview = (productId: string, field: keyof ProductReview, value: string | number) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }))
  }

  useEffect(() => {
    if (useGlobalRating && globalRating > 0) {
      const newReviews = { ...reviews }
      for (const productId in newReviews) {
        newReviews[productId].rating = globalRating
      }
      setReviews(newReviews)
    }
  }, [globalRating, useGlobalRating])

  useEffect(() => {
    const completed = Object.values(reviews).filter((review) => review.rating > 0).length
    setCompletedCount(completed)
  }, [reviews])

  const isSubmitDisabled = Object.values(reviews).some((review) => review.rating === 0)
  const progressPercentage = (completedCount / products.length) * 100

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  return (
    <TooltipProvider>
      <motion.div
        className="space-y-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          {branding.logo && (
            <motion.img
              src={branding.logo}
              alt="Logo de la marque"
              className="mx-auto h-22 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          )}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Évaluez nos produits
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Votre avis compte ! Aidez-nous à améliorer nos produits en partageant votre expérience.
          </p>
        </motion.div>

        {/* Global Rating Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Évaluation rapide</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gagnez du temps en attribuant la même note à tous les produits
                </p>
                <div className="flex items-center space-x-3">
                  <Switch id="global-rating-switch" checked={useGlobalRating} onCheckedChange={setUseGlobalRating} />
                  <Label htmlFor="global-rating-switch" className="text-sm cursor-pointer">
                    Activer la notation globale
                  </Label>
                </div>
              </div>
              <motion.div
                animate={{
                  opacity: useGlobalRating ? 1 : 0.4,
                  scale: useGlobalRating ? 1 : 0.95,
                  pointerEvents: useGlobalRating ? "auto" : "none",
                }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-2"
              >
                <StarRating value={globalRating} onChange={setGlobalRating} size={36} />
                {useGlobalRating && globalRating > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    Note appliquée à tous les produits
                  </motion.p>
                )}
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Products List */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {products.map((product: Product, index) => (
            <ProductReviewCard
              key={product.id}
              product={product}
              review={reviews[product.id]}
              onUpdate={(field, value) => {
                if (useGlobalRating && field === "rating") {
                  setUseGlobalRating(false)
                }
                handleUpdateReview(product.id, field, value)
              }}
              isCompleted={reviews[product.id].rating > 0}
              index={index}
            />
          ))}
        </motion.div>

        {/* Submit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col items-center gap-4">
            {isSubmitDisabled && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                Veuillez noter tous les produits pour continuer
              </motion.p>
            )}
            <Button
              onClick={() => onNext(reviews)}
              disabled={isSubmitDisabled}
              className={`
                                w-full max-w-md text-lg py-6 font-semibold transition-all duration-300
                                ${!isSubmitDisabled ? "shadow-lg hover:shadow-xl hover:scale-[1.02]" : ""}
                            `}
              size="lg"
            >
              {isSubmitDisabled ? (
                <>Complétez toutes les évaluations</>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Valider et continuer
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
