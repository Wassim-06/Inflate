import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ChatStyleFeedbackForm from './components/chat-feedback-form';
import { Spinner } from './components/spinner';
import { fetchQuestions } from './api/question';
// ✅ On importe les bons types depuis schema.ts
import type { BrandingSchema, QuestionSchema } from './lib/schema';

// ✅ On importe les données mockées
import { QUESTIONS } from './data/mock';

// ✅ On crée un mock qui correspond au BrandingSchema (objet unique)
const MOCK_BRANDING: BrandingSchema = {
  logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Logo',
  brandColor: '#000000',
  font: 'Inter, sans-serif',
};

const App: React.FC = () => {
  const { orderId, firstQuestionValue } = useParams<{ orderId?: string; firstQuestionValue?: string }>();

  // Les états sont maintenant typés avec les types de Zod
  const [questions, setQuestions] = useState<QuestionSchema[] | undefined>(undefined);
  // Le branding est un objet unique dans notre UI, pas un tableau.
  // On prendra le premier élément du tableau de l'API ou notre mock.
  const [branding, setBranding] = useState<BrandingSchema | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const firstQuestionValueNumber = firstQuestionValue ? parseInt(firstQuestionValue, 10) : undefined;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Condition pour le mode développement
        if (import.meta.env.DEV) {
          console.log("🛠️ DEV MODE: Using mock data.");
          // Simule un petit délai réseau
          setTimeout(() => {
            setQuestions(QUESTIONS);
            setBranding(MOCK_BRANDING);
            setLoading(false);
          }, 500);
        } else {
          // Mode production : on exige un orderId
          if (!orderId) {
            console.error("PRODUCTION MODE: Order ID is required.");
            setLoading(false);
            return;
          }
          const data = await fetchQuestions(orderId);
          setQuestions(data?.questions);
          // L'API renvoie un tableau, on prend le premier élément
          if (data?.branding && data.branding.length > 0) {
            setBranding(data.branding[0]);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
      // Le `finally` est redondant si tous les chemins font setLoading(false)
    };

    fetchData();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-600">
        Error: Could not load questions. Check the console or ensure the Order ID is correct.
      </div>
    );
  }

  return (
    // On peut passer le branding au composant de chat pour qu'il l'utilise
    <div style={{ '--brand-color': branding?.brandColor } as React.CSSProperties}>
      <ChatStyleFeedbackForm
        questions={questions}
        firstQuestionValue={firstQuestionValueNumber}
        branding={branding}
      />
    </div>
  );
};

export default App;
