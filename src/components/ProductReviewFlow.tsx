// src/components/ProductReviewFlow.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, Question, Branding } from '@/lib/schema';
import type { AllAnswers, ProductReview } from '@/lib/type';
import { ScopeChoiceStep } from './steps/ScopeChoiceStep';
import { ProductReviewStep } from './steps/ProductReviewStep';
import { AdditionalQuestionsStep } from './steps/AdditionalQuestionsStep';
import { TrustpilotStep } from './steps/TrustpilotStep';
import { ThemeToggle } from './theme-toggle';

type ReviewStep = 'SCOPE_CHOICE' | 'PRODUCT_REVIEW' | 'ADDITIONAL_QUESTIONS' | 'TRUSTPILOT';

interface ProductReviewFlowProps {
    products: Product[];
    additionalQuestions: Question[];
    trustpilotLink?: string;
    branding?: Branding;
}

export const ProductReviewFlow: React.FC<ProductReviewFlowProps> = ({ products, additionalQuestions, trustpilotLink, branding }) => {
    const [currentStep, setCurrentStep] = useState<ReviewStep>('SCOPE_CHOICE');
    const [answers, setAnswers] = useState<Partial<AllAnswers>>({});
    const [reviewScope, setReviewScope] = useState<'single' | 'bulk' | null>(null);

    const handleScopeChosen = (scope: 'single' | 'bulk', selectedProduct?: Product) => {
        setReviewScope(scope);
        if (scope === 'single' && selectedProduct) {
            setAnswers(prev => ({ ...prev, productReviews: { [selectedProduct.id]: { rating: 0, comment: '' } } }));
        }
        setCurrentStep('PRODUCT_REVIEW');
    };

    const handleProductsReviewed = (productAnswers: Record<string, ProductReview>) => {
        setAnswers(prev => ({ ...prev, productReviews: productAnswers }));
        setCurrentStep('ADDITIONAL_QUESTIONS');
    };

    const handleQuestionsAnswered = (additionalAnswers: Record<string, any>) => {
        setAnswers(prev => ({ ...prev, additionalQuestions: additionalAnswers }));
        setCurrentStep('TRUSTPILOT');
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'SCOPE_CHOICE':
                return <ScopeChoiceStep products={products} onNext={handleScopeChosen} />;
            case 'PRODUCT_REVIEW':
                const productsToReview = reviewScope === 'single'
                    ? products.filter(p => answers.productReviews && p.id in answers.productReviews)
                    : products;
                return <ProductReviewStep products={productsToReview} onNext={handleProductsReviewed} reviewScope={reviewScope} />;
            case 'ADDITIONAL_QUESTIONS':
                return <AdditionalQuestionsStep questions={additionalQuestions} onNext={handleQuestionsAnswered} />;
            case 'TRUSTPILOT':
                return <TrustpilotStep trustpilotLink={trustpilotLink} />;
            default:
                return <div>Étape inconnue</div>;
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-background font-sans text-foreground">
            <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-zinc-950 dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
            <div className="fixed inset-0 -z-20 h-full w-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

            <header className="sticky top-0 z-10 backdrop-blur-md">
                <div className="container mx-auto flex max-w-5xl items-center justify-between p-4">
                    {branding?.logo ? <img src={branding.logo} alt="Logo" className="h-8" /> : <div />}
                    <ThemeToggle />
                </div>
            </header>

            <main className="container mx-auto max-w-3xl p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderCurrentStep()}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};