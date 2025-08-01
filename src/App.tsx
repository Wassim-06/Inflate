// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { Spinner } from './components/spinner';
import { fetchQuestions } from './api/question';
import { BrandingSchema, QuestionSchema, ProductSchema, ProductsQuestionSchema } from './lib/schema'; // Importez tous les schémas nécessaires
import { ProductReviewFlow } from './components/ProductReviewFlow'; // Le nouveau composant principal
import { ThemeProvider } from './components/theme-provider';


// On importe les données mockées complètes
import { QUESTIONS, MOCK_BRANDING } from './data/mock'; // Assurez-vous que MOCK_BRANDING est aussi exporté de votre mock.ts

type Branding = z.infer<typeof BrandingSchema>;
type Question = z.infer<typeof QuestionSchema>;
type Product = z.infer<typeof ProductSchema>;

const App: React.FC = () => {
  const { orderId } = useParams<{ orderId?: string }>();

  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);
  const [branding, setBranding] = useState<Branding | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (import.meta.env.DEV) {
          console.log("🛠️ DEV MODE: Using mock data.");
          setTimeout(() => {
            // UTILISEZ LES CONSTANTES IMPORTÉES DIRECTEMENT
            setQuestions(QUESTIONS as Question[]);
            setBranding(MOCK_BRANDING as Branding);
            setLoading(false);
          }, 500);
        } else {

          if (!orderId) {
            console.error("PRODUCTION MODE: Order ID is required.");
            setLoading(false);
            return;
          }
          const data = await fetchQuestions(orderId);
          setQuestions(data?.questions as Question[]);
          if (data?.branding && data.branding.length > 0) {
            setBranding(data.branding[0] as Branding);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Spinner />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-destructive">
        Erreur: Impossible de charger les questions.
      </div>
    );
  }

  // Séparez la question de type "products" des autres questions
  const productsQuestion = questions.find(q => q.type === 'products');
  const additionalQuestions = questions.filter(q => q.type !== 'products');

  // Extraire la liste des produits de la question "products"
  // Utilise le parsing Zod pour garantir que la structure est correcte
  const productsParseResult = ProductsQuestionSchema.safeParse(productsQuestion);
  const products: Product[] = productsParseResult.success ? productsParseResult.data.products : [];

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div style={{ '--brand-color': branding?.brandColor } as React.CSSProperties}>
        <ProductReviewFlow
          products={products}
          additionalQuestions={additionalQuestions}
          trustpilotLink="https://www.trustpilot.com/review/votre-site.com"
        // Vous pouvez aussi passer le branding si nécessaire dans les étapes
        />
      </div>
    </ThemeProvider>
  );
};

export default App;