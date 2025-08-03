"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Star, CheckCircle2, ArrowRight } from "lucide-react"

interface TrustpilotStepProps {
  onPublish: () => void
}

export const TrustpilotStep: React.FC<TrustpilotStepProps> = ({ onPublish }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-6 max-w-2xl"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
        </motion.div>

        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Merci ! ✨
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed"
          >
            Vos avis ont été enregistrés avec succès.
            <br />
            <span className="font-medium text-foreground">Un dernier geste pour nous aider...</span>
          </motion.p>
        </div>
      </motion.div>

      {/* Trustpilot Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 text-center space-y-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 300 }}
                >
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">Partagez sur Trustpilot</h3>
            <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
              Aidez notre communauté en partageant votre expérience sur Trustpilot. Votre avis authentique est précieux
              pour les futurs clients.
            </p>
          </div>

          <motion.div
            animate={{
              scale: isHovered ? 1.05 : 1,
              y: isHovered ? -2 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <Button
              size="lg"
              onClick={onPublish}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 text-lg shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/35 group"
            >
              Publier sur Trustpilot
            </Button>
          </motion.div>
        </Card>
      </motion.div>

      {/* Skip Option */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.location.reload()}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Peut-être plus tard
        </Button>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 10,
              opacity: 0,
            }}
            animate={{
              y: -10,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}
