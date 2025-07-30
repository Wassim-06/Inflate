/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { defaultCommentForRating } from "@/lib/default-comment-for-rating";
import { Spinner } from "./spinner";
import { StarRating } from "./star-rating";
import { Send } from "lucide-react";
import { ChatBubble } from "./chat-bubble";
import { totalSteps } from "@/lib/total-steps";
import type {  ProductSchema, ProductsQuestionSchema, QuestionSchema } from "@/lib/schema";
import type { ProductReviewAnswer } from "@/lib/type";

const brandIconUrl = "/logo.svg";



async function postAnswer(questionId: string, answer: any) {
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

const ChatStyleFeedbackForm: React.FC<{ questions: QuestionSchema[] | undefined, firstQuestionValue: number | undefined }> = ({ questions, firstQuestionValue }) => {
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
  const arr: { role: 'bot' | 'user'; content: React.ReactNode; key: string }[] = []

  questions?.forEach((q, qIdx) => {
    const isPast = qIdx < currentIndex
    const isCurrent = qIdx === currentIndex

    // 🚫 Ne rien afficher pour les questions futures
    if (!isPast && !isCurrent) return

    // ---------------- PRODUCTS ----------------
    if (q.type === 'products') {
      // On ne montre les produits que quand on est à cette étape ou après
      const prodQ = q as ProductsQuestionSchema;
      if (isPast || isCurrent) {
        // Intro bubble
        arr.push({ role: 'bot', content: q.prompt + ' ⭐', key: `bot-q-${q.id}` })
      }

      const until = isPast ? prodQ.products.length : productCursor.idx + 1

      for (let i = 0; i < until; i++) {
        const p = prodQ.products[i]

        // Rating bubble
        arr.push({
          role: 'bot',
          key: `bot-q-${q.id}-r-${p.id}`,
          content: (
            <div className="flex items-center gap-2">
              {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />}
              <span>Rate <strong>{p.name}</strong>:</span>
            </div>
          ),
        })

        if (productsAnswer.ratings[p.id]) {
          arr.push({
            role: 'user',
            content: `${productsAnswer.ratings[p.id]}/5 stars`,
            key: `user-a-${q.id}-r-${p.id}`,
          })
        }

        // Comment bubble
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
          })
          if (productsAnswer.comments[p.id] !== '') {
            arr.push({
              role: 'user',
              content: productsAnswer.comments[p.id],
              key: `user-a-${q.id}-c-${p.id}`,
            })
          }
        }
      }
      return
    }

    if (isPast) {
      arr.push({ role: 'bot', content: q.prompt, key: `bot-q-${q.id}` })
      if (submitted[q.id]) {
        arr.push({ role: 'user', content: String(answers[q.id]), key: `user-a-${q.id}` })
      }
    }
  })

  const cq = questions?.[currentIndex]
  if (cq && cq.type !== 'products') {
    arr.push({ role: 'bot', content: cq.prompt, key: `bot-q-${cq.id}-current` })
  }

  return arr
}, [questions, currentIndex, productCursor.idx, productsAnswer.ratings, productsAnswer.comments, submitted, answers])


  // Progress
  const answeredCount = useMemo(() => {
    let count = 0;
    if (answers["nps"]) count++;
    const prodQ = questions?.find((q) => q.id === "products") as
      |   ProductsQuestionSchema
      | undefined;
    if (prodQ) {
      prodQ.products.forEach((p) => {
        if (productsAnswer.ratings[p.id]) count++;
        if (productsAnswer.comments[p.id] !== undefined) count++;
      });
    }
    if (answers["delivery"]) count++;
    if (answers["overall"]) count++;
    if (answers["source"]) count++;
    return count;
  }, [answers, productsAnswer.comments, productsAnswer.ratings, questions]);

  const progress = (answeredCount / totalSteps) * 100;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, currentIndex, productCursor, answers, productsAnswer]);

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages.length]);

  // New effect: auto-answer first (nps) question if firstQuestionValue is provided
  useEffect(() => {
    async function autoAnswerNPS() {
      if (
        currentIndex === 0 &&
        firstQuestionValue !== undefined &&
        questions && questions.length > 0 &&
        questions[0].type === "nps" &&
        answers.nps === undefined
      ) {
        await handleNps(firstQuestionValue);
        setSubmitted(prev => ({ ...prev, nps: true }));
        setCurrentIndex(1);
      }
    }
    autoAnswerNPS();
  }, [firstQuestionValue, questions, currentIndex, answers.nps]);

  if (!questions) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  const handleNps = async (value: number) => {
    setSending(true);
    await postAnswer("nps", value);
    setAnswers((prev) => ({ ...prev, nps: value }));
    setSending(false);
  };

  const handleRateAll = async (val: number, products: ProductSchema[]) => {
    const ratings: Record<string, number> = {};
    const comments: Record<string, string> = {};
    products.forEach((p) => {
      ratings[p.id] = val;
      comments[p.id] = defaultCommentForRating(val);
    });
    setProductsAnswer({ ratings, comments });
  };

  const handleProductRating = async (p: ProductSchema, value: number) => {
    const updated = { ...productsAnswer.ratings, [p.id]: value };
    const updatedComments = { ...productsAnswer.comments };
    if (updatedComments[p.id] === undefined) {
      updatedComments[p.id] = defaultCommentForRating(value);
    }
    setProductsAnswer({ ratings: updated, comments: updatedComments });
    // Move to comment phase
    setProductCursor((cur) => ({ idx: cur.idx, phase: "comment" }));
  };

  const handleProductComment = async (p: ProductSchema, text: string) => {
    setProductsAnswer((prev) => ({
      ...prev,
      comments: { ...prev.comments, [p.id]: text },
    }));
  };

  const confirmProductComment = async (p: ProductSchema) => {
    setSending(true);
    // POST both rating+comment of this product
    await postAnswer(`product:${p.id}`, {
      rating: productsAnswer.ratings[p.id],
      comment: productsAnswer.comments[p.id] || "",
    });
    setSending(false);

    const prodQ = questions.find(
      (q) => q.id === "products"
    ) as ProductsQuestionSchema;
    if (productCursor.idx < prodQ.products.length - 1) {
      setProductCursor({ idx: productCursor.idx + 1, phase: "rating" });
    } else {
      // finished products
      setCurrentIndex(2);
    }
  };

  const handleTextarea = async (id: string, val: string) => {
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
    await postAnswer(id, choice);
    setAnswers((prev) => ({ ...prev, [id]: choice }));
    setSending(false);
    setCurrentIndex((prev) => prev + 1);
  };


  const renderInputArea = () => {
    const q: QuestionSchema = questions[currentIndex];
    if (!q) return null;

    if (q.type === "nps") {
      const scale = q.scale ?? 10;
      return (
        <div className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: scale }).map((_, i) => {
              const n = i + 1;
              return (
                <Button
                  key={n}
                  variant={answers["nps"] === n ? "default" : "outline"}
                  onClick={() => handleNps(n)}
                  disabled={sending}
                  className="w-10 h-10 rounded-full p-0"
                >
                  {sending && answers["nps"] === n ? <Spinner /> : n}
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

    if (q.type === "products") {
      const prodQ = q;
      const currentProduct = prodQ.products[productCursor.idx];

      if (productCursor.phase === "rating") {
        return (
          <div className="space-y-4 w-full">
            {/* Rate all quick action */}
            {productCursor.idx === 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRateAll(5, prodQ.products)}
                className="self-start"
              >
                Rate all 5 ⭐
              </Button>
            )}

            <div className="flex items-center gap-3">
              {currentProduct.image && (
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-12 h-12 rounded object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{currentProduct.name}</p>
                <StarRating
                  value={productsAnswer.ratings[currentProduct.id] || 0}
                  onChange={(val) => handleProductRating(currentProduct, val)}
                />
              </div>
            </div>
          </div>
        );
      }

      // Comment phase
      return (
        <div className="space-y-3 w-full">
          <Textarea
            value={productsAnswer.comments[currentProduct.id] || ""}
            onChange={(e) =>
              handleProductComment(currentProduct, e.target.value)
            }
            placeholder="Write a short review of your experience with our product..."
            rows={3}
          />
          <div className="flex justify-end">
            <Button
              onClick={() => confirmProductComment(currentProduct)}
              disabled={sending}
            >
              {sending ? (
                <Spinner />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    if (q.type === "textarea") {
      const val = answers[q.id] || "";
      return (
        <div className="w-full space-y-3">
          <Textarea
            rows={4}
            placeholder={q.placeholder}
            value={val}
            onChange={(e) => handleTextarea(q.id, e.target.value)}
          />
          <div className="flex justify-end">
            <Button
              disabled={sending || !val.trim()}
              onClick={() => confirmTextarea(q.id)}
            >
              {sending ? (
                <Spinner />
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit
                </>
              )}
            </Button>
          </div>
        </div>
      );
    }

    if (q.type === "multi-choice") {
      return (
        <div className="grid grid-cols-2 gap-3 w-full">
          {q.options.map((opt) => (
            <Button
              key={opt}
              variant="secondary"
              className="justify-center"
              disabled={sending}
              onClick={() => handleMultiChoice(q.id, opt)}
            >
              {sending && answers[q.id] === opt ? <Spinner /> : opt}
            </Button>
          ))}
        </div>
      );
    }

    return null;
  };


  const isDone = currentIndex >= questions.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Brand & progress */}
      <div className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-xl w-full px-4 pt-4 pb-2 flex items-center gap-3">
          {brandIconUrl && (
            <img src={brandIconUrl} alt="brand" className="h-6 w-6" />
          )}
          <Progress value={progress} className="h-2 flex-1" />
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 pt-4 pb-44 max-w-xl w-full mx-auto space-y-3"
      >
        {messages.map((m) => (
          <ChatBubble key={m.key} role={m.role}>
            {m.content}
          </ChatBubble>
        ))}
        {isDone && (
          <ChatBubble role="bot">
            <div className="space-y-2">
              <p>🎉 Thanks a lot! Your feedback helps us improve.</p>
              {/* Example CTA: paste review on Trustpilot */}
              <Button asChild variant="default" className="mt-2">
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Paste my review on Trustpilot ⭐
                </a>
              </Button>
              <p className="text-[10px] text-muted-foreground mt-4">
                powered by Inflate
              </p>
            </div>
          </ChatBubble>
        )}
      </div>

      {/* Input zone */}
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
