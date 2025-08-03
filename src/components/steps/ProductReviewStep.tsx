import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/star-rating';
import { Card } from '@/components/ui/card';
import type { Product, Branding } from '@/lib/schema';
import type { ProductReview } from '@/lib/type';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface ProductReviewStepProps {
    products: Product[];
    branding: Branding;
    onNext: (reviews: Record<string, ProductReview>) => void;
}

const ProductReviewCard: React.FC<{
    product: Product;
    review: ProductReview;
    onUpdate: (field: keyof ProductReview, value: string | number) => void;
}> = ({ product, review, onUpdate }) => {
    const ratingId = `rating-${product.id}`;
    const commentId = `comment-${product.id}`;

    return (
        <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="flex flex-col gap-4 p-4 md:col-span-2">
                    <h3 className="font-semibold tracking-tight">{product.name}</h3>
                    <div>
                        <label id={ratingId} className="text-xs font-medium text-muted-foreground mb-1 block">Votre note *</label>
                        <StarRating
                            aria-labelledby={ratingId}
                            value={review.rating}
                            onChange={(rating) => onUpdate('rating', rating)}
                            size={24}
                        />
                    </div>
                    <div>
                        <label htmlFor={commentId} className="text-xs font-medium text-muted-foreground mb-1 block">Votre commentaire (optionnel)</label>
                        <Textarea
                            id={commentId}
                            placeholder="Qu'avez-vous pensé de ce produit ?"
                            value={review.comment}
                            onChange={(e) => onUpdate('comment', e.target.value)}
                            rows={2}
                            className="transition-colors focus:border-primary text-sm"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 p-2 md:order-last">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="h-24 w-24 rounded-md object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-24 w-24 rounded-md bg-muted text-muted-foreground text-xs">
                            Photo indisponible
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export const ProductReviewStep: React.FC<ProductReviewStepProps> = ({ products, branding, onNext }) => {
    const [reviews, setReviews] = useState<Record<string, ProductReview>>(() =>
        Object.fromEntries(products.map((p: Product) => [p.id, { rating: 0, comment: '' }]))
    );
    const [globalRating, setGlobalRating] = useState<number>(0);
    const [useGlobalRating, setUseGlobalRating] = useState<boolean>(false);
    
    const handleUpdateReview = (productId: string, field: keyof ProductReview, value: string | number) => {
        setReviews(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    useEffect(() => {
        if (useGlobalRating && globalRating > 0) {
            const newReviews = { ...reviews };
            for (const productId in newReviews) {
                newReviews[productId].rating = globalRating;
            }
            setReviews(newReviews);
        }
    }, [globalRating, useGlobalRating]);

    const isSubmitDisabled = Object.values(reviews).some(review => review.rating === 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            className="space-y-6 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="text-center space-y-3">
                {branding.logo && <img src={branding.logo} alt="Logo de la marque" className="mx-auto h-10 mb-4" />}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">Évaluez nos produits</h1>
                <p className="text-muted-foreground max-w-xl mx-auto">Donnez une note à chaque produit ou évaluez-les tous d'un coup pour nous aider à nous améliorer.</p>
            </div>
            
            <motion.div variants={itemVariants}>
                <Card className="p-4 bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1.5">
                             <h3 className="font-semibold">Évaluer tous les produits d'un coup</h3>
                             <div className="flex items-center space-x-2">
                                <Switch id="global-rating-switch" checked={useGlobalRating} onCheckedChange={setUseGlobalRating} />
                                <Label htmlFor="global-rating-switch" className="text-sm text-muted-foreground cursor-pointer">Activer la notation globale</Label>
                            </div>
                        </div>
                        <motion.div animate={{ opacity: useGlobalRating ? 1 : 0.4, pointerEvents: useGlobalRating ? 'auto' : 'none' }}>
                            <StarRating value={globalRating} onChange={setGlobalRating} size={32}/>
                        </motion.div>
                    </div>
                </Card>
            </motion.div>

            <motion.div className="space-y-4" variants={containerVariants}>
                {products.map((product: Product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                        <ProductReviewCard
                            product={product}
                            review={reviews[product.id]}
                            onUpdate={(field, value) => {
                                if (useGlobalRating && field === 'rating') {
                                    setUseGlobalRating(false);
                                }
                                handleUpdateReview(product.id, field, value)
                            }}
                        />
                    </motion.div>
                ))}
            </motion.div>
            
            <div className="pt-4 border-t border-border">
                <Button 
                    onClick={() => onNext(reviews)} 
                    disabled={isSubmitDisabled} 
                    className="w-full text-lg py-6"
                    size="lg"
                >
                    Valider et continuer
                </Button>
            </div>
        </motion.div>
    );
};