// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import ChatStyleFeedbackForm from './components/chat-feedback-form';
import { Spinner } from './components/spinner';
import { fetchQuestions } from './api/question';
import { BrandingSchema, QuestionSchema } from './lib/schema';

// On importe les données mockées
import { QUESTIONS } from './data/mock';

type Branding = z.infer<typeof BrandingSchema>;
type Question = z.infer<typeof QuestionSchema>;


const MOCK_BRANDING: Branding = {
  logo: 'https://placehold.co/100x40/000000/FFFFFF?text=Logo',
  brandColor: '#000000',
  font: 'Inter, sans-serif',
};

const App: React.FC = () => {
  const { orderId, firstQuestionValue } = useParams<{ orderId?: string; firstQuestionValue?: string }>();

  const [questions, setQuestions] = useState<Question[] | undefined>(undefined);
  const [branding, setBranding] = useState<Branding | undefined>(undefined);
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
            setQuestions(QUESTIONS as Question[]);
            setBranding(MOCK_BRANDING as Branding);
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
          setQuestions(data?.questions as Question[]);
          // L'API renvoie un tableau, on prend le premier élément
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
        trustpilotLink="https://www.trustpilot.com/review/yourwebsite.com"
      />
    </div>
  );
};

export default App;