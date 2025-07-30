/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

import { defaultCommentForRating } from "@/lib/default-comment-for-rating";
import { totalSteps } from "@/lib/total-steps";
import type { ProductReviewAnswer } from "@/lib/type";
// ✅ TYPES: On importe les nouveaux noms de types
import type { Branding, Product, ProductsQuestion, Question } from "@/lib/schema";

import { Spinner } from "./spinner";
import { StarRating } from "./star-rating";
import { ChatBubble } from "./chat-bubble";

// ✅ API: La fonction est maintenant consciente du mode de développement
async function postAnswer(questionId: string, answer: any) {
  // En mode développement, on simule l'envoi pour éviter les erreurs 404
  if (import.meta.env.DEV) {
    console.log(`[MOCK POST] /api/feedback`, { questionId, answer });
    // Simule une latence réseau pour le réalisme
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  // En mode production, la vraie requête est effectuée
  try {
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId, answer }),
    });
  } catch (e) {
    console.error("POST failed", e);
    // On pourrait vouloir gérer l'erreur dans l'UI ici
  }
}

// ✅ PROPS: Le composant accepte maintenant `branding`
interface ChatFormProps {
  questions: Question[];
  firstQuestionValue?: number;
  branding?: Branding;
}

const ChatStyleFeedbackForm: React.FC<ChatFormProps> = ({ questions, firstQuestionValue, branding }) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [productCursor, setProductCursor] = useState<{
    idx: number;
    phase: "rating" | "comment";
  }>({ idx: 0, phase: "rating" });
  const [productsAnswer, setProductsAnswer] = useState<ProductReviewAnswer>({
    ratings: {},
    comments: {},
  });
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const messages = useMemo(() => {
    const arr: { role: 'bot' | 'user'; content: React.ReactNode; key: string }[] = [];
    questions.forEach((q, qIdx) => {
      const isPast = qIdx < currentIndex;
      const isCurrent = qIdx === currentIndex;
      if (!isPast && !isCurrent) return;

      if (q.type === 'products') {
        const prodQ = q as ProductsQuestion;
        if (isPast || isCurrent) {
          arr.push({ role: 'bot', content: q.prompt + ' ⭐', key: `bot-q-${q.id}` });
        }
        const until = isPast ? prodQ.products.length : productCursor.idx + 1;
        for (let i = 0; i < until; i++) {
          const p = prodQ.products[i];
          arr.push({
            role: 'bot',
            key: `bot-q-${q.id}-r-${p.id}`,
            content: (
              <div className="flex items-center gap-2">
                {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />}
                <span>Rate <strong>{p.name}</strong>:</span>
              </div>
            ),
          });
          if (productsAnswer.ratings[p.id]) {
            arr.push({
              role: 'user',
              content: `${productsAnswer.ratings[p.id]}/5 stars`,
              key: `user-a-${q.id}-r-${p.id}`,
            });
          }
          if (productsAnswer.comments[p.id] !== undefined) {
            arr.push({
              role: 'bot',
              key: `bot-q-${q.id}-c-${p.id}`,
              content: (
                <div className="flex items-center gap-2">
                  {p.image && <img src={p.image} alt={p.name} className="w-8 h-8 rounded" />}
                  <span>Leave a short comment about <strong>{p.name}</strong>?</span>
                </div>
              ),
            });
            if (productsAnswer.comments[p.id] !== '') {
              arr.push({
                role: 'user',
                content: productsAnswer.comments[p.id],
                key: `user-a-${q.id}-c-${p.id}`,
              });
            }
          }
        }
        return;
      }

      if (isPast) {
        arr.push({ role: 'bot', content: q.prompt, key: `bot-q-${q.id}` });
        if (submitted[q.id]) {
          arr.push({ role: 'user', content: String(answers[q.id]), key: `user-a-${q.id}` });
        }
      }
    });

    const cq = questions?.[currentIndex];
    if (cq && cq.type !== 'products') {
      arr.push({ role: 'bot', content: cq.prompt, key: `bot-q-${cq.id}-current` });
    }
    return arr;
  }, [questions, currentIndex, productCursor.idx, productsAnswer.ratings, productsAnswer.comments, submitted, answers]);

  const answeredCount = useMemo(() => {
    let count = 0;
    if (answers["nps"]) count++;
    // ✅ TYPE: On utilise le nouveau nom de type
    const prodQ = questions?.find((q) => q.id === "products") as ProductsQuestion | undefined;
    if (prodQ) {
      prodQ.products.forEach((p) => {
        if (productsAnswer.ratings[p.id]) count++;
        if (productsAnswer.comments[p.id] !== undefined) count++;
      });
    }
    Object.keys(answers).forEach(key => {
      if (key !== 'nps' && answers[key] !== undefined) {
        count++;
      }
    });
    return count;
  }, [answers, productsAnswer.comments, productsAnswer.ratings, questions]);

  const progress = (answeredCount / totalSteps) * 100;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, currentIndex, productCursor, answers, productsAnswer]);

  useEffect(() => {
    const autoAnswerNPS = async () => {
      if (currentIndex === 0 && firstQuestionValue !== undefined && questions?.[0]?.type === "nps" && answers.nps === undefined) {
        await handleNps(firstQuestionValue);
      }
    };
    autoAnswerNPS();
  }, [firstQuestionValue, questions, currentIndex, answers.nps]);

  if (!questions) {
    return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
  }

  const handleNps = async (value: number) => {
    setSending(true);
    setAnswers((prev) => ({ ...prev, nps: value }));
    await postAnswer("nps", value);
    setSending(false);
    setSubmitted(prev => ({ ...prev, nps: true }));
    setCurrentIndex(1);
  };

  const handleRateAll = (val: number, products: Product[]) => {
    const ratings: Record<string, number> = {};
    const comments: Record<string, string> = {};
    products.forEach((p) => {
      ratings[p.id] = val;
      comments[p.id] = defaultCommentForRating(val);
    });
    setProductsAnswer({ ratings, comments });
    // On avance à la fin des produits
    setCurrentIndex(currentIndex + 1);
  };

  const handleProductRating = (p: Product, value: number) => {
    const updatedRatings = { ...productsAnswer.ratings, [p.id]: value };
    const updatedComments = { ...productsAnswer.comments };
    if (updatedComments[p.id] === undefined) {
      updatedComments[p.id] = defaultCommentForRating(value);
    }
    setProductsAnswer({ ratings: updatedRatings, comments: updatedComments });
    setProductCursor((cur) => ({ idx: cur.idx, phase: "comment" }));
  };

  const handleProductComment = (p: Product, text: string) => {
    setProductsAnswer((prev) => ({
      ...prev,
      comments: { ...prev.comments, [p.id]: text },
    }));
  };

  const confirmProductComment = async (p: Product) => {
    setSending(true);
    await postAnswer(`product:${p.id}`, {
      rating: productsAnswer.ratings[p.id],
      comment: productsAnswer.comments[p.id] || "",
    });
    setSending(false);

    const prodQ = questions.find((q) => q.id === "products") as ProductsQuestion;
    if (productCursor.idx < prodQ.products.length - 1) {
      setProductCursor({ idx: productCursor.idx + 1, phase: "rating" });
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleTextarea = (id: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const confirmTextarea = async (id: string) => {
    setSending(true);
    await postAnswer(id, answers[id]);
    setSending(false);
    setSubmitted((s) => ({ ...s, [id]: true }));
    setCurrentIndex((prev) => prev + 1);
  };

  const handleMultiChoice = async (id: string, choice: string) => {
    setSending(true);
    setAnswers((prev) => ({ ...prev, [id]: choice }));
    await postAnswer(id, choice);
    setSending(false);
    setSubmitted(s => ({ ...s, [id]: true }));
    setCurrentIndex((prev) => prev + 1);
  };

  const renderInputArea = () => {
    const q = questions[currentIndex];
    if (!q) return null;

    switch (q.type) {
      case "nps":
      case "scale": {
        const scale = q.scale ?? 10;
        return (
          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: scale }).map((_, i) => {
                const n = i + 1;
                return (
                  <Button key={n} variant={answers[q.id] === n ? "default" : "outline"} onClick={() => handleNps(n)} disabled={sending} className="w-10 h-10 rounded-full p-0">
                    {sending && answers[q.id] === n ? <Spinner /> : n}
                  </Button>
                );
              })}
            </div>
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <span>{q.leftLabel}</span>
              <span>{q.rightLabel}</span>
            </div>
          </div>
        );
      }

      case "products": {
        const prodQ = q;
        const currentProduct = prodQ.products[productCursor.idx];
        if (productCursor.phase === "rating") {
          return (
            <div className="space-y-4 w-full">
              <StarRating value={productsAnswer.ratings[currentProduct.id] || 0} onChange={(val) => handleProductRating(currentProduct, val)} />
            </div>
          );
        }
        return (
          <div className="space-y-3 w-full">
            <Textarea value={productsAnswer.comments[currentProduct.id] || ""} onChange={(e) => handleProductComment(currentProduct, e.target.value)} placeholder={`Votre avis sur ${currentProduct.name}...`} rows={3} />
            <div className="flex justify-end">
              <Button onClick={() => confirmProductComment(currentProduct)} disabled={sending}>
                {sending ? <Spinner /> : <><Send className="mr-2 h-4 w-4" /> Envoyer</>}
              </Button>
            </div>
          </div>
        );
      }

      case "textarea": {
        const val = answers[q.id] || "";
        return (
          <div className="w-full flex items-center gap-2">
            <Textarea placeholder={q.placeholder} value={val} onChange={(e) => handleTextarea(q.id, e.target.value)} rows={1} className="resize-none" />
            <Button disabled={sending || !val.trim()} onClick={() => confirmTextarea(q.id)} size="icon">
              {sending ? <Spinner /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        );
      }

      case "multi-choice": {
        return (
          <div className="grid grid-cols-2 gap-3 w-full">
            {q.options.map((opt) => (
              <Button key={opt} variant="secondary" className="justify-center" disabled={sending} onClick={() => handleMultiChoice(q.id, opt)}>
                {sending && answers[q.id] === opt ? <Spinner /> : opt}
              </Button>
            ))}
          </div>
        );
      }

      case "radio": {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {q.options.map((opt) => (
              <div key={opt.id} className="relative border rounded-lg p-4 cursor-pointer hover:border-primary" onClick={() => handleMultiChoice(q.id, opt.label)}>
                {opt.image && <img src={opt.image} alt={opt.label} className="w-full h-32 object-cover rounded-md mb-2" />}
                <p className="text-center font-medium">{opt.label}</p>
              </div>
            ))}
          </div>
        )
      }

      default:
        return null;
    }
  };

  const isDone = currentIndex >= questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-xl w-full px-4 pt-4 pb-2 flex items-center gap-3">
          {/* ✅ BRANDING: On utilise le logo de la prop branding */}
          {branding?.logo && (
            <img src={branding.logo} alt="brand logo" className="h-8 w-auto" />
          )}
          <Progress value={progress} className="h-2 flex-1" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4 pb-44 max-w-xl w-full mx-auto space-y-3">
        {messages.map((m) => (
          <ChatBubble key={m.key} role={m.role}>{m.content}</ChatBubble>
        ))}
        {isDone && (
          <ChatBubble role="bot">
            <div className="space-y-2">
              <p>🎉 Merci beaucoup ! Vos réponses nous aident à nous améliorer.</p>
            </div>
          </ChatBubble>
        )}
      </div>

      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t">
          <div className="max-w-xl mx-auto px-4 py-3">{renderInputArea()}</div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatStyleFeedbackForm;
