// src/components/steps/ProductReviewStep.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/star-rating';
import { Card } from '@/components/ui/card';
import type { Product } from '@/lib/schema';
import type { ProductReview } from '@/lib/type';
import { motion } from 'framer-motion';

// ✅ FIX: Defined the component's props interface to resolve the 'Cannot find name' error.
interface ProductReviewStepProps {
    products: Product[];
    onNext: (reviews: Record<string, ProductReview>) => void;
    reviewScope: 'single' | 'bulk' | null;
}

const ProductReviewCard: React.FC<{
    product: Product;
    review: ProductReview;
    onUpdate: (field: keyof ProductReview, value: string | number) => void;
}> = ({ product, review, onUpdate }) => {
    // 🎨 UI/AX: Use unique IDs for associating labels with inputs for accessibility.
    const ratingId = `rating-${product.id}`;
    const commentId = `comment-${product.id}`;

    return (
        <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl dark:hover:shadow-primary/10 hover:border-primary/50">
            <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="flex items-center justify-center bg-muted/30 p-4 md:col-span-1">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-28 w-28 rounded-lg object-cover"
                            loading="lazy" // ✅ Perf: Lazy load images
                        />
                    ) : (
                        <div className="flex items-center justify-center h-28 w-28 rounded-lg bg-muted text-muted-foreground">
                            Photo
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 p-6 md:col-span-3">
                    <h3 className="text-lg font-semibold tracking-tight">{product.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            {/* 🎨 UI/AX: The label provides a visual title for the control. */}
                            <label id={ratingId} className="text-sm font-medium text-muted-foreground mb-2 block">Votre note *</label>
                            <StarRating
                                // ✅ FIX: The <StarRating> component doesn't accept an 'id' prop. It has been removed.
                                // The component should be controlled by its own 'aria-labelledby' pointing to the label's id.
                                aria-labelledby={ratingId}
                                value={review.rating}
                                onChange={(rating) => onUpdate('rating', rating)}
                                size={28}
                            />
                        </div>
                        <div>
                            {/* 🎨 UI/AX: Added a label for accessibility */}
                            <label htmlFor={commentId} className="text-sm font-medium text-muted-foreground mb-2 block">Votre commentaire</label>
                            <Textarea
                                id={commentId}
                                placeholder="Qu'avez-vous pensé de ce produit ?"
                                value={review.comment}
                                onChange={(e) => onUpdate('comment', e.target.value)}
                                rows={2}
                                className="transition-colors focus:border-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export const ProductReviewStep: React.FC<ProductReviewStepProps> = ({ products, onNext, reviewScope }) => {
    const [reviews, setReviews] = useState<Record<string, ProductReview>>(() =>
        Object.fromEntries(products.map((p: Product) => [p.id, { rating: 0, comment: '' }]))
    );

    const handleUpdateReview = (productId: string, field: keyof ProductReview, value: string | number) => {
        setReviews(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    const isSubmitDisabled = Object.values(reviews).some(review => review.rating === 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (reviewScope === 'single' && products.length === 1) {
        const singleProduct = products[0];
        return (
            <motion.div
                className="max-w-xl mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <ProductReviewCard
                    product={singleProduct}
                    review={reviews[singleProduct.id]}
                    onUpdate={(field, value) => handleUpdateReview(singleProduct.id, field, value)}
                />
                <Button
                    onClick={() => onNext(reviews)}
                    disabled={isSubmitDisabled}
                    className="w-full mt-6 py-3 text-base"
                    size="lg"
                >
                    Valider et continuer
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Évaluez vos produits</h1>
                <p className="text-muted-foreground mt-2">Donnez une note à chaque produit pour continuer.</p>
            </div>

            <motion.div className="space-y-4" variants={containerVariants}>
                {products.map((product: Product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                        <ProductReviewCard
                            product={product}
                            review={reviews[product.id]}
                            onUpdate={(field, value) => handleUpdateReview(product.id, field, value)}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <div className="flex justify-center sm:justify-end pt-4">
                <Button
                    size="lg"
                    onClick={() => onNext(reviews)}
                    disabled={isSubmitDisabled}
                    className="w-full sm:w-auto px-12 py-6 text-lg"
                >
                    Valider tous les avis
                </Button>
            </div>
        </motion.div>
    );
};