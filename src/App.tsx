import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Spinner } from './components/spinner';
import { ThemeProvider } from './components/theme-provider';
import { ProductReviewFlow } from './components/ProductReviewFlow';
import { BrandingSchema, ProductSchema } from './lib/schema';
import { MOCK_BRANDING, MOCK_PRODUCTS } from './data/mock';

type Branding = z.infer<typeof BrandingSchema>;
type Product = z.infer<typeof ProductSchema>;

const App: React.FC = () => {
    const [branding] = useState<Branding>(MOCK_BRANDING);
    const [products] = useState<Product[]>(MOCK_PRODUCTS);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background">
                <Spinner />
            </div>
        );
    }
    
    if (!products || products.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background text-destructive">
                Erreur : Impossible de charger les produits à évaluer.
            </div>
        );
    }

    return (
        <ThemeProvider defaultTheme="system" storageKey="ui-theme">
            <div style={{ '--brand-color': branding?.brandColor } as React.CSSProperties}>
                <ProductReviewFlow
                    products={products}
                    branding={branding}
                    trustpilotLink="https://www.trustpilot.com/review/exemple.com"
                />
            </div>
        </ThemeProvider>
    );
};

export default App;