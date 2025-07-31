// src/components/QuestionForm.tsx
import React, { useState } from 'react';
import QuestionInput from './QuestionInput';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface Question {

  question: string;
  type: string;
}

export interface Product {
  name: string;
  image: string;
}

interface QuestionFormProps {
  questions: Question[];
  firstQuestionValue: string;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentStep: number;
  products?: Product[];
}

const QuestionForm: React.FC<QuestionFormProps> = ({ questions, firstQuestionValue, setCurrentStep, currentStep, products }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({ 0: firstQuestionValue });

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChange = (value: string) => {
    setAnswers({ ...answers, [currentStep]: value });
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Question {currentStep + 1}</h2>
      <p className="mb-4">{questions[currentStep].question}</p>
      {questions[currentStep].type === 'product-review' && products ? (
        <div>
          {products.map((product, index) => (
            <div key={index} className="flex items-start mb-4">
              <img src={product.image} alt={product.name} className="w-16 h-16 mr-4" />
              <div className="flex-1">
                <p className="font-bold mb-2">{product.name}</p>
                <div className="mb-2">
                  {[...Array(5)].map((_, starIndex) => (
                    <label key={starIndex} className="mr-2">
                      <input
                        type="radio"
                        value={(starIndex + 1).toString()}
                        onChange={() => handleChange((starIndex + 1).toString())}
                      />
                      {starIndex + 1} Star
                    </label>
                  ))}
                </div>
                <Textarea placeholder="Add your comment" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <QuestionInput
          type={questions[currentStep].type}
          value={answers[currentStep] || ''}
          onChange={handleChange}
        />
      )}
      <div className="flex justify-between mt-6">
        {currentStep > 0 ? (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <div /> // Pour garder le bouton "Next" à droite
        )}
        {currentStep < questions.length - 1 && (
          <Button onClick={handleNext}>
            Next
          </Button>
        )}
      </div>

    </div>
  );
};

export default QuestionForm;
