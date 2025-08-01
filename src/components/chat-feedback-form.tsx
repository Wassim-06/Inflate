// src/components/chat-feedback-form.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { defaultCommentForRating } from "@/lib/default-comment-for-rating";
import { totalSteps } from "@/lib/total-steps";
import type { ProductReviewAnswer } from "@/lib/type";
import type { Branding, Product, ProductsQuestion, Question } from "@/lib/schema";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "./theme-toggle";
import { Spinner } from "./spinner";
import { StarRating } from "./star-rating";
import { ChatBubble } from "./chat-bubble";

type AnswerValue = string | number | ProductReviewAnswer | { rating: number; comment: string };

interface RadioOption {
  id: string;
  label: string;
  image?: string;
}

// Fonction API mockée avec typage
async function postAnswer(questionId: string, answer: AnswerValue) {
  if (import.meta.env.DEV) {
    console.log(`[MOCK POST] /api/feedback`, { questionId, answer });
    return new Promise(resolve => setTimeout(resolve, 400));
  }
  try {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer }),
    });
  } catch (e) {
    console.error("POST failed", e);
  }
}

interface ChatFormProps {
  questions: Question[];
  firstQuestionValue?: number;
  branding?: Branding;
  trustpilotLink?: string;
}

const ChatStyleFeedbackForm: React.FC<ChatFormProps> = ({ questions, firstQuestionValue, branding, trustpilotLink }) => {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [productCursor, setProductCursor] = useState<{ idx: number; phase: "rating" | "comment"; }>({ idx: 0, phase: "rating" });
  const [productsAnswer, setProductsAnswer] = useState<ProductReviewAnswer>({ ratings: {}, comments: {} });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const [currentTextValue, setCurrentTextValue] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLDivElement>(null);

  // Génération des bulles de chat
  const messages = useMemo(() => {
    const arr: { role: 'bot' | 'user'; content: React.ReactNode; key: string }[] = [];
    questions.forEach((q, qIdx) => {
      const isPast = qIdx < currentIndex;
      const isCurrent = qIdx === currentIndex;
      if (!isPast && !isCurrent) return;

      if (q.type === 'products') {
        const prodQ = q as ProductsQuestion;
        if (isPast || isCurrent) {
          arr.push({ role: 'bot', content: q.prompt, key: `bot-q-${q.id}` });
        }
        const until = isPast ? prodQ.products.length : productCursor.idx + 1;
        for (let i = 0; i < until; i++) {
          const p = prodQ.products[i];
          arr.push({ role: 'bot', key: `bot-q-${q.id}-r-${p.id}`, content: `Votre note pour **${p.name}** ?` });

          if (productsAnswer.ratings[p.id]) {
            arr.push({ role: 'user', content: <StarRating value={productsAnswer.ratings[p.id]} readOnly variant="inverted" />, key: `user-a-${q.id}-r-${p.id}` });
            arr.push({ role: 'bot', key: `bot-q-${q.id}-c-${p.id}`, content: `Un commentaire sur **${p.name}** ?` });
          }
          if (productsAnswer.comments[p.id]) {
            arr.push({ role: 'user', content: productsAnswer.comments[p.id], key: `user-a-${q.id}-c-${p.id}` });
          }
        }
        return;
      }

      if (isPast) {
        arr.push({ role: 'bot', content: q.prompt, key: `bot-q-${q.id}` });
        if (submitted[q.id] && answers[q.id] !== undefined) { // MODIFIÉ: S'assurer que la réponse existe
          let userContent: React.ReactNode = null;

          if ((q.type === 'nps' || q.type === 'scale') && typeof answers[q.id] === 'number') {
            userContent = (
              <div className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm">
                {typeof answers[q.id] === "object" ? JSON.stringify(answers[q.id]) : String(answers[q.id])}
              </div>
            );
          } else {
            // Affichage par défaut pour les autres types (textarea, multi-choice...)
            userContent = String(answers[q.id]);
          }

          arr.push({ role: 'user', content: userContent, key: `user-a-${q.id}` });
        }
      }

    });

    const cq = questions?.[currentIndex];
    if (cq && cq.type !== 'products') {
      arr.push({ role: 'bot', content: cq.prompt, key: `bot-q-${cq.id}-current` });
    }
    return arr;
  }, [questions, currentIndex, productCursor.idx, productsAnswer, submitted, answers]);

  const answeredCount = useMemo(() => {
    const prodQ = questions?.find((q) => q.type === "products") as ProductsQuestion | undefined;
    let productAnswersCount = 0;
    if (prodQ) {
      productAnswersCount = Object.keys(productsAnswer.ratings).length + Object.keys(productsAnswer.comments).length;
    }
    const otherAnswersCount = Object.keys(submitted).filter(id => id !== 'products').length;
    return productAnswersCount + otherAnswersCount;
  }, [submitted, productsAnswer, questions]);

  const progress = (answeredCount / totalSteps) * 100;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  useEffect(() => {
    setTimeout(() => {
      const interactiveElement = inputAreaRef.current?.querySelector('button, textarea, input') as HTMLElement | null;
      interactiveElement?.focus();
    }, 400);
  }, [currentIndex, productCursor]);

  useEffect(() => {
    const q = questions[currentIndex];
    if (!q) return;

    if (q.type === 'products' && productCursor.phase === 'comment') {
      const prodQ = q as ProductsQuestion;
      const p = prodQ.products[productCursor.idx];
      // Pré-remplir avec le commentaire par défaut ou un commentaire existant
      setCurrentTextValue(productsAnswer.comments[p.id] || defaultCommentForRating(productsAnswer.ratings[p.id]!));
    } else if (q.type === 'textarea') {
      // Pré-remplir avec la réponse existante ou une chaîne vide
      setCurrentTextValue((answers[q.id] as string) || "");
    } else {
      // Vider pour les autres types de questions
      setCurrentTextValue("");
    }
  }, [currentIndex, productCursor, questions, answers, productsAnswer]);

  useEffect(() => {
    const autoAnswerFirstQuestion = async () => {
      const firstQuestion = questions?.[0];
      if (currentIndex === 0 && firstQuestionValue !== undefined && firstQuestion && (firstQuestion.type === "nps" || firstQuestion.type === "scale") && answers[firstQuestion.id] === undefined) {
        // On passe l'ID de la première question à la fonction
        await handleScaleSelect(firstQuestion.id, firstQuestionValue);
      }
    };
    autoAnswerFirstQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstQuestionValue, questions]);


  const advanceToNextQuestion = (id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setSubmitted((s) => ({ ...s, [id]: true }));
    setCurrentIndex((prev) => prev + 1);
    setSending(false);
  };

  const handleScaleSelect = async (questionId: string, value: number) => {
    setSending(true);
    // On met à jour la réponse sur le bon ID pour le spinner
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    await postAnswer(questionId, value);
    advanceToNextQuestion(questionId, value);
  };

  const handleProductRating = (p: Product, value: number) => {
    const updatedRatings = { ...productsAnswer.ratings, [p.id]: value };
    setProductsAnswer(prev => ({ ...prev, ratings: updatedRatings }));
    setProductCursor((cur) => ({ ...cur, phase: "comment" }));
  };

  const confirmProductComment = async (p: Product) => {
    setSending(true);
    const comment = currentTextValue.trim();
    setProductsAnswer(prev => ({
      ...prev,
      comments: { ...prev.comments, [p.id]: comment }
    }));

    const answerPayload = { rating: productsAnswer.ratings[p.id]!, comment: comment };
    await postAnswer(`product:${p.id}`, answerPayload);

    setSending(false);
    const prodQ = questions.find((q) => q.type === "products") as ProductsQuestion;
    if (productCursor.idx < prodQ.products.length - 1) {
      setProductCursor({ idx: productCursor.idx + 1, phase: "rating" });
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const confirmTextarea = async (id: string) => {
    setSending(true);
    const value = currentTextValue.trim();
    await postAnswer(id, value);
    advanceToNextQuestion(id, value);
  };

  const handleMultiChoice = async (id: string, choice: string) => {
    setSending(true);
    await postAnswer(id, choice);
    advanceToNextQuestion(id, choice);
  };

  const renderInputArea = () => {
    const q = questions[currentIndex];
    if (!q) return null;

    const animationProps = {
      key: `${currentIndex}-${productCursor.idx}-${productCursor.phase}`,
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: "easeInOut" } as const,
    };

    switch (q.type) {
      case "nps":
      case "scale": {
        const scale = q.scale ?? 10;
        return (
          <motion.div {...animationProps} className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: scale }).map((_, i) => {
                const n = i + 1;
                return (
                  <Button
                    key={n}
                    variant={answers[q.id] === n ? "default" : "outline"}
                    onClick={() => handleScaleSelect(q.id, n)}
                    disabled={sending}
                    className={cn(
                      "w-10 h-10 rounded-full p-0 transition-all duration-200 hover:scale-110 active:scale-95",
                      answers[q.id] === n && "shadow-lg shadow-primary/50" // Ajout de l'ombre pour la sélection
                    )}
                    aria-label={`Note de ${n} sur ${scale}`}
                  >
                    {sending && answers[q.id] === n ? <Spinner /> : n}
                  </Button>
                );
              })}
            </div>
            <div className="flex justify-between w-full text-xs text-muted-foreground px-1">
              <span>{q.leftLabel}</span>
              <span>{q.rightLabel}</span>
            </div>
          </motion.div>
        );
      }

      case "products": {
        const prodQ = q as ProductsQuestion;
        const p = prodQ.products[productCursor.idx];
        if (productCursor.phase === "rating") {
          return (
            <motion.div {...animationProps} className="w-full flex flex-col items-center gap-4">
              {p.image && <img src={p.image} alt={p.name} className="w-24 h-24 rounded-lg object-cover shadow-md" />}
              <StarRating value={productsAnswer.ratings[p.id] || 0} onChange={(val) => handleProductRating(p, val)} size={32} />
            </motion.div>
          );
        }
        return (
          <motion.div {...animationProps} className="w-full flex items-start gap-2">
            <Textarea value={currentTextValue} onChange={(e) => setCurrentTextValue(e.target.value)} placeholder={`Facultatif : laissez un commentaire...`} rows={1} className="resize-none" />
            <Button onClick={() => confirmProductComment(p)} disabled={sending} size="icon">
              {sending ? <Spinner /> : <Send className="h-4 w-4" />}
            </Button>
          </motion.div>
        );
      }

      case "textarea": {
        return (
          <motion.div {...animationProps} className="w-full flex items-center gap-2">
            <Textarea placeholder={q.placeholder} value={currentTextValue} onChange={(e) => setCurrentTextValue(e.target.value)} rows={1} className="resize-none" />
            <Button disabled={sending || !currentTextValue.trim()} onClick={() => confirmTextarea(q.id)} size="icon">
              {sending ? <Spinner /> : <Send className="h-4 w-4" />}
            </Button>
          </motion.div>
        )
      }

      case "multi-choice": {
        return (
          <motion.div {...animationProps} className="grid grid-cols-2 gap-3 w-full">
            {q.options.map((opt: string) => ( // Assuming options is string[] for multi-choice
              <Button key={opt} variant="secondary" size="lg" className="h-auto py-3 justify-center text-center" disabled={sending} onClick={() => handleMultiChoice(q.id, opt)}>
                {sending && answers[q.id] === opt ? <Spinner /> : opt}
              </Button>
            ))}
          </motion.div>
        )
      }

      case "radio": {
        return (
          <motion.div {...animationProps} className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {(q.options as RadioOption[]).map((opt: RadioOption) => (
              <button key={opt.id} disabled={sending} onClick={() => handleMultiChoice(q.id, opt.label)} className={cn(
                "group relative border bg-white/5 dark:bg-black/10 border-white/10 rounded-xl p-4 text-center transition-all duration-300 ease-in-out",
                "hover:bg-white/10 dark:hover:bg-black/20 hover:border-primary/50",
                { "ring-2 ring-primary ring-offset-2 ring-offset-background": answers[q.id] === opt.label }
              )}
              ><div className="absolute -inset-px rounded-xl border border-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{
                background: 'radial-gradient(400px circle at 50% 50%, hsl(var(--primary) / 0.2), transparent 80%)'
              }}></div>
                {opt.image && <img src={opt.image} alt={opt.label} className="w-full h-32 object-cover rounded-md mb-3 transition-transform duration-300 group-hover:scale-105" />}
                <p className="font-medium text-foreground relative z-10">{opt.label}</p>
                <AnimatePresence>
                  {answers[q.id] === opt.label && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </motion.div>
        )
      }

      default: return null;
    }
  };

  const isDone = currentIndex >= questions.length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-neutral-100 dark:bg-neutral-900">
      {/* On ajoute un fond animé qui restera fixe derrière le contenu */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-black dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      <div className="fixed inset-0 -z-20 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-primary/10 blur-3xl"></div>
      <header className="sticky top-0 z-20 w-full bg-background/50 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-2xl w-full px-4 py-3 flex items-center gap-4">
          {branding?.logo && <img src={branding.logo} alt="Logo" className="h-8 w-auto" />}
          <Progress value={progress} className="h-2 flex-1" />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 max-w-2xl w-full mx-auto space-y-4">
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.key} layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ChatBubble role={m.role}>{m.content}</ChatBubble>
            </motion.div>
          ))}
        </AnimatePresence>
        {isDone && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <ChatBubble role="bot">
              <div className="space-y-2 text-center">
                <p className="text-2xl">🎉</p>
                <p className="font-semibold">Merci beaucoup !</p>
                <p className="text-sm text-foreground/80">Vos réponses ont bien été enregistrées. Elles nous sont précieuses pour nous améliorer.</p>
                {trustpilotLink && (
                  <p className="text-sm">
                    <a
                      href={trustpilotLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-medium"
                    >
                      Donnez votre avis sur Trustpilot !
                    </a>
                  </p>
                )}
              </div>
            </ChatBubble>
          </motion.div>
        )}
        <div ref={bottomRef} className="h-44" />
      </main>

      {!isDone && (
        <footer className="fixed bottom-0 left-0 right-0 bg-background/50 backdrop-blur-xl border-t border-white/10">
          <div ref={inputAreaRef} className="max-w-2xl mx-auto px-4 py-4 md:py-6">
            <AnimatePresence mode="wait">
              {renderInputArea()}
            </AnimatePresence>
          </div>
        </footer>
      )}
    </div>
  );
};

export default ChatStyleFeedbackForm;