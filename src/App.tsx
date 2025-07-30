import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ChatStyleFeedbackForm from './components/chat-feedback-form';
import { Spinner } from './components/spinner';
import { fetchQuestions } from './api/question';
import type { BrandingData,QuestionSchema } from './lib/schema';


const App: React.FC = () => {
  const { orderId, firstQuestionValue } = useParams<{ orderId: string; firstQuestionValue: string }>();
  const [questions, setQuestions] = useState<QuestionSchema[] | undefined>(undefined);
  const [branding, setBranding] = useState<BrandingData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const firstQuestionValueNumber = firstQuestionValue ? parseInt(firstQuestionValue, 10) : undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchQuestions(orderId);
        setQuestions(data?.questions);
        setBranding(data?.branding);

        console.log("Fetched questions:", data?.questions);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [orderId]);

    // Return error if orderId is missing
  if (!orderId || orderId.trim() === '') {
    return <div>Error: Missing or invalid order ID</div>;
  }


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <ChatStyleFeedbackForm questions={questions} firstQuestionValue={firstQuestionValueNumber}/>
    </div>
  );
};

export default App;
