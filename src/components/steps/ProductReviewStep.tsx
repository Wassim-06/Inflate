// src/components/steps/ProductReviewStep.tsx
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
import { CheckCircle2, Info, Sparkles, AlertCircle } from "lucide-react"

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
          border-none focus:outline-none focus-visible:ring-0
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

        {/* Layout ajusté avec padding réduit */}
        <div className="flex flex-row items-start gap-3 sm:gap-4 px-3 py-1.5">
          {/* Image */}
          <div className="relative flex-shrink-0">
            {product.image ? (
              <motion.div
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-16 md:w-16 rounded-lg object-cover shadow-lg"
                  loading="lazy"
                />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-lg bg-muted text-muted-foreground text-center text-xs border-2 border-dashed">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 mb-1" />
                <span>Photo indisponible</span>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className="flex w-full flex-1 flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="font-semibold tracking-tight text-base sm:text-lg">{product.name}</h3>
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
                  size={24}
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <label htmlFor={commentId} className="text-sm font-medium text-muted-foreground">
                Votre commentaire (optionnel)
              </label>
              <Textarea
                id={commentId}
                placeholder="Qu'avez-vous pensé ?"
                value={review.comment}
                onChange={(e) => onUpdate("comment", e.target.value)}
                rows={2}
                className={`
                  transition-all duration-200 text-sm resize-none
                  focus:ring-2 focus:ring-primary/20 focus:border-primary
                  ${review.comment ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}
                `}
              />
            </div>
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
  const [globalComment, setGlobalComment] = useState<string>("")
  const [globalCommentError, setGlobalCommentError] = useState<boolean>(false)

  const handleUpdateReview = (productId: string, field: keyof ProductReview, value: string | number) => {
    if (useGlobalRating && field === "rating") {
      setUseGlobalRating(false)
    }
    setReviews((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }))
  }

  useEffect(() => {
    if (useGlobalRating && globalRating > 0) {
      setReviews((prevReviews) => {
        const newReviews = { ...prevReviews }
        for (const productId in newReviews) {
          newReviews[productId].rating = globalRating
        }
        return newReviews
      })
    }
  }, [globalRating, useGlobalRating])

  useEffect(() => {
    if (useGlobalRating) {
      setReviews((prevReviews) => {
        const newReviews = { ...prevReviews }
        for (const productId in newReviews) {
          newReviews[productId].comment = globalComment
        }
        return newReviews
      })
    }
  }, [globalComment, useGlobalRating])

  const allProductsRated = !Object.values(reviews).some((review) => review.rating === 0)
  const globalCommentMissing = useGlobalRating && globalComment.trim() === ""
  const isSubmitDisabled = !allProductsRated || globalCommentMissing

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const handleSubmit = () => {
    if (useGlobalRating && globalComment.trim() === "") {
      setGlobalCommentError(true)
      return
    }
    onNext(reviews)
  }

  let submitHelperText = "Veuillez noter tous les produits pour continuer."
  if (allProductsRated && globalCommentMissing) {
    submitHelperText = "N'oubliez pas votre avis général pour finaliser."
  }

  return (
    <TooltipProvider>
      <motion.div
        className="space-y-3 max-w-4xl mx-auto"
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
              className="mx-auto h-16 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Évaluez vos produits
          </h1>
        </motion.div>

        {/* Global Rating Section */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2 flex-grow">
                {/* Mobile layout */}
                <div className="flex items-center gap-4 md:hidden">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-lg">Évaluation rapide</h3>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    {useGlobalRating && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                    <Switch id="global-rating-switch" checked={useGlobalRating} onCheckedChange={setUseGlobalRating} />
                  </div>
                </div>
                {/* Desktop layout */}
                <div className="hidden md:flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">Évaluation rapide</h3>
                  {useGlobalRating && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                  <div className="ml-3">
                    <Switch id="global-rating-switch" checked={useGlobalRating} onCheckedChange={setUseGlobalRating} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Attribuez la même note et le même commentaire à tous les produits.
                </p>
              </div>
              <motion.div
                animate={{
                  opacity: useGlobalRating ? 1 : 0.4,
                  scale: useGlobalRating ? 1 : 0.95,
                  pointerEvents: useGlobalRating ? "auto" : "none",
                }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-2 md:pt-0"
              >
                <StarRating value={globalRating} onChange={setGlobalRating} size={32} />
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Section "Avis Général" */}
        <AnimatePresence>
          {useGlobalRating && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Card
                className={`p-4 md:p-6 transition-all border ${
                  globalCommentError ? "ring-2 ring-offset-2 ring-red-500 border-red-500" : "border-border"
                }`}
              >
                <div className="space-y-3">
                  <label htmlFor="global-comment" className="text-lg font-semibold tracking-tight">
                    Votre avis général *
                  </label>
                  <Textarea
                    id="global-comment"
                    placeholder="Comment s'est passée votre expérience globale ?"
                    value={globalComment}
                    onChange={(e) => {
                      setGlobalComment(e.target.value)
                      if (e.target.value.trim()) setGlobalCommentError(false)
                    }}
                    rows={3}
                    className="text-sm"
                    required
                  />
                  <AnimatePresence>
                    {globalCommentError && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm text-red-600 flex items-center gap-2"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Veuillez laisser un avis général pour continuer.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <ProductReviewCard
              key={product.id}
              product={product}
              review={reviews[product.id]}
              onUpdate={(field, value) => handleUpdateReview(product.id, field, value)}
              isCompleted={reviews[product.id].rating > 0}
              index={index}
            />
          ))}
        </div>

        {/* Submit Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-6 border-t border-border">
          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className={`
                w-full max-w-sm text-base py-3 font-semibold transition-all duration-300
                ${!isSubmitDisabled ? "shadow-lg hover:shadow-xl hover:scale-[1.02]" : ""}
              `}
              size="lg"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Valider et continuer
            </Button>
            {isSubmitDisabled && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-center text-muted-foreground flex items-center gap-2">
                <Info className="h-3 w-3" />
                {submitHelperText}
              </motion.p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </TooltipProvider>
  )
}
