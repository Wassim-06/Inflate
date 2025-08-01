// src/components/steps/AdditionalQuestionsStep.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check } from 'lucide-react';

// ✅ FIX: Corrected imports. Only used types are imported.
import type { Question, RadioOption } from '@/lib/schema';
import type { AnswerValue } from '@/lib/type';
import { Button } from '@/components/ui/button';
import { ChatBubble } from '@/components/chat-bubble';
import { Spinner } from '@/components/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// MOCK API call
async function postAnswer(questionId: string, answer: AnswerValue) {
    console.log(`[MOCK POST] Question: ${questionId}, Answer:`, answer);
    return new Promise(resolve => setTimeout(resolve, 500));
}

// ✅ FIX: Defined the props interface to remove the error.
interface AdditionalQuestionsStepProps {
    questions: Question[];
    onNext: (answers: Record<string, AnswerValue>) => void;
}

const ChoiceButton: React.FC<{
    label: string;
    image?: string | null;
    disabled: boolean;
    onClick: () => void;
}> = ({ label, image, disabled, onClick }) => (
    <Button
        variant="outline"
        size="lg"
        disabled={disabled}
        onClick={onClick}
        className={cn(
            "h-auto w-full justify-start p-3 text-left transition-all duration-200 group hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10",
            image && "flex items-center gap-4"
        )}
    >
        {image && <img src={image} alt={label} className="h-14 w-14 rounded-md object-cover" />}
        <span className="flex-1 font-medium">{label}</span>
        <Check className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </Button>
);

export const AdditionalQuestionsStep: React.FC<AdditionalQuestionsStepProps> = ({ questions, onNext }) => {
    const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTextValue, setCurrentTextValue] = useState('');
    const [sending, setSending] = useState(false);
    const [selectedScale, setSelectedScale] = useState<number | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const currentQuestion = questions[currentIndex];
    const isDone = currentIndex >= questions.length;

    const messages = useMemo(() => {
        const arr: { role: 'bot' | 'user'; content: React.ReactNode; key: string }[] = [];
        questions.slice(0, currentIndex + 1).forEach((q: Question, index: number) => {
            if (index <= currentIndex) {
                arr.push({ role: 'bot', content: q.prompt, key: `bot-${q.id}` });
            }
            if (answers[q.id] !== undefined) {
                const answer = answers[q.id];
                const displayAnswer = Array.isArray(answer) ? answer.join(', ') : String(answer);
                arr.push({ role: 'user', content: displayAnswer, key: `user-${q.id}` });
            }
        });
        return arr;
    }, [currentIndex, questions, answers]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const advanceToNextQuestion = (id: string, value: AnswerValue) => {
        const newAnswers = { ...answers, [id]: value };
        setAnswers(newAnswers);
        setSending(false);
        setCurrentTextValue('');
        setSelectedScale(null);

        setTimeout(() => {
            if (currentIndex + 1 >= questions.length) {
                onNext(newAnswers);
            } else {
                setCurrentIndex(prev => prev + 1);
            }
        }, 400);
    };

    const handleAnswer = async (questionId: string, value: AnswerValue) => {
        setSending(true);
        if (typeof value === 'number') setSelectedScale(value);
        await postAnswer(questionId, value);
        advanceToNextQuestion(questionId, value);
    };

    const renderInputArea = () => {
        if (isDone || !currentQuestion) return null;

        const animationProps = {
            key: currentQuestion.id,
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: { duration: 0.3 }
        };

        switch (currentQuestion.type) {
            case 'nps':
            case 'scale': {
                const scale = currentQuestion.scale ?? 10;
                return (
                    <motion.div {...animationProps} className="flex w-full flex-col items-center gap-4 pt-2">
                        <div className="flex flex-wrap justify-center gap-2">
                            {Array.from({ length: scale }).map((_, i) => {
                                const n = i + 1;
                                const isSelected = selectedScale === n;
                                return (
                                    <Button
                                        key={n}
                                        variant={isSelected ? "default" : "outline"}
                                        onClick={() => handleAnswer(currentQuestion.id, n)}
                                        disabled={sending}
                                        className="h-11 w-11 rounded-full p-0 text-sm font-semibold transition-all duration-200 hover:scale-110 active:scale-95"
                                        aria-label={`Note ${n} sur ${scale}`}
                                    >
                                        {sending && isSelected ? <Spinner /> : n}
                                    </Button>
                                );
                            })}
                        </div>
                        <div className="flex w-full justify-between px-2 text-xs text-muted-foreground">
                            <span>{currentQuestion.leftLabel}</span>
                            <span>{currentQuestion.rightLabel}</span>
                        </div>
                    </motion.div>
                );
            }
            case 'textarea':
                return (
                    <motion.div {...animationProps} className="w-full flex items-center gap-2">
                        <Textarea
                            placeholder={currentQuestion.placeholder || "Écrivez votre réponse..."}
                            value={currentTextValue}
                            onChange={(e) => setCurrentTextValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && currentTextValue.trim()) {
                                    e.preventDefault();
                                    handleAnswer(currentQuestion.id, currentTextValue.trim());
                                }
                            }}
                            rows={1}
                            className="resize-none rounded-full px-4 py-3"
                            aria-label="Zone de saisie de la réponse"
                        />
                        <Button
                            disabled={sending || !currentTextValue.trim()}
                            onClick={() => handleAnswer(currentQuestion.id, currentTextValue.trim())}
                            size="icon"
                            className="rounded-full flex-shrink-0"
                            aria-label="Envoyer la réponse"
                        >
                            {sending ? <Spinner /> : <Send className="h-4 w-4" />}
                        </Button>
                    </motion.div>
                );
            case 'multi-choice':
            case 'radio': {
                return (
                    <motion.div {...animationProps} className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        {currentQuestion.options.map((opt: string | RadioOption) => {
                            const label = typeof opt === 'string' ? opt : opt.label;
                            const value = typeof opt === 'string' ? opt : opt.label;
                            const key = typeof opt === 'string' ? opt : opt.id;
                            const image = typeof opt !== 'string' ? opt.image : null;

                            return (
                                <ChoiceButton
                                    key={key}
                                    label={label}
                                    image={image}
                                    disabled={sending}
                                    onClick={() => handleAnswer(currentQuestion.id, value)}
                                />
                            );
                        })}
                    </motion.div>
                );
            }
            default:
                return <p className="text-sm text-destructive-foreground bg-destructive p-2 rounded-md">Type de question non supporté.</p>;
        }
    };

    return (
        // 🎨 UI/AX: Used theme-aware colors for dark mode support.
        <Card className="w-full max-w-2xl mx-auto shadow-2xl shadow-primary/10 border-border bg-background/80 backdrop-blur-sm">
            <CardContent ref={scrollAreaRef} className="p-4 h-[60vh] overflow-y-auto space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map(m => (
                        <motion.div
                            key={m.key}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
                        >
                            <ChatBubble role={m.role}>{m.content}</ChatBubble>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </CardContent>
            <CardFooter className="p-4 border-t border-border min-h-[90px]">
                <AnimatePresence mode="wait">
                    {renderInputArea()}
                </AnimatePresence>
            </CardFooter>
        </Card>
    );
};