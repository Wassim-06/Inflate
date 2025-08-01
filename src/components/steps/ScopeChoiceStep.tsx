// src/components/steps/ScopeChoiceStep.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, CheckSquare } from 'lucide-react';

interface ScopeChoiceStepProps {
    products: Product[];
    onNext: (scope: 'single' | 'bulk', selectedProduct?: Product) => void;
}

export const ScopeChoiceStep: React.FC<ScopeChoiceStepProps> = ({ products, onNext }) => {
    const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

    const handleSingleSubmit = () => {
        if (selectedProductId) {
            const product = products.find(p => p.id === selectedProductId);
            if (product) onNext('single', product);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex min-h-[70vh] flex-col items-center justify-center gap-8 md:flex-row"
        >
            <motion.div variants={cardVariants} className="w-full md:w-1/2">
                <Card className="h-full transform-gpu text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10">
                    <CardHeader>
                        <FileText className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <CardTitle>Juste un produit</CardTitle>
                        <CardDescription>Choisissez un produit spécifique à évaluer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select onValueChange={setSelectedProductId}>
                            <SelectTrigger><SelectValue placeholder="Choisissez un produit..." /></SelectTrigger>
                            <SelectContent>
                                {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSingleSubmit} disabled={!selectedProductId} className="w-full">Évaluer ce produit</Button>
                    </CardFooter>
                </Card>
            </motion.div>

            <motion.div variants={cardVariants} className="w-full md:w-1/2">
                <Card className="h-full transform-gpu text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-secondary/10">
                    <CardHeader>
                        {/* CORRECTION ICI: text-secondary au lieu de text-primary */}
                        <CheckSquare className="mx-auto mb-4 h-12 w-12 text-primary" />
                        <CardTitle>Toute la commande</CardTitle>
                        <CardDescription>Donnez votre avis sur tous les produits reçus.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow" />
                    <CardFooter>
                        <Button onClick={() => onNext('bulk')} variant="secondary" className="w-full">Tout évaluer</Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </motion.div>
    );
};
