import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductReviewStep } from './steps/ProductReviewStep';
import { TrustpilotStep } from './steps/TrustpilotStep';
import type { Product, Branding } from '@/lib/schema';
import type { ProductReview } from '@/lib/type';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Spinner } from './spinner';

interface ProductReviewFlowProps {
    products: Product[];
    branding: Branding;
    trustpilotLink: string;
}

// Fausse fonction pour simuler un envoi des avis
async function postReviews(reviews: Record<string, ProductReview>) {
    console.log("🚀 Envoi des avis vers l'API...", reviews);
    return new Promise(resolve => setTimeout(resolve, 800));
}

export const ProductReviewFlow: React.FC<ProductReviewFlowProps> = ({ products, branding, trustpilotLink }) => {
    const [step, setStep] = useState<'review' | 'trustpilot'>('review');
    const [isLoading, setIsLoading] = useState(false);

    const handleReviewSubmit = async (reviews: Record<string, ProductReview>) => {
        setIsLoading(true);
        await postReviews(reviews);
        setIsLoading(false);
        setStep('trustpilot');
    };
    
    const handlePublishToTrustpilot = () => {
        if (trustpilotLink) {
            window.open(trustpilotLink, '_blank', 'noopener,noreferrer');
        }
    };
    
    const progressValue = step === 'review' ? 50 : 100;

    return (
        <main className="container mx-auto p-4 md:p-8">
            <div className="max-w-3xl mx-auto mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        Étape {step === 'review' ? '1' : '2'} sur 2
                    </span>
                     <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                        Recommencer
                    </Button>
                </div>
                <Progress value={progressValue} className="w-full" />
            </div>

            <AnimatePresence mode="wait">
                 <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                 >
                    {step === 'review' ? (
                        <ProductReviewStep 
                            products={products}
                            branding={branding}
                            onNext={handleReviewSubmit}
                        />
                    ) : (
                        <TrustpilotStep onPublish={handlePublishToTrustpilot} />
                    )}
                 </motion.div>
            </AnimatePresence>

            {isLoading && (
                 <div className="fixed inset-0 bg-background/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
                    <Spinner />
                    <p className="mt-4 text-sm text-muted-foreground">Enregistrement de vos avis...</p>
                 </div>
            )}
        </main>
    );
};