import React, { useState } from 'react';
import QuestionInput from './QuestionInput';

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
                <textarea
                  placeholder="Add your comment"
                  className="border border-gray-300 rounded p-2 w-full"
                />
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
      <div className="flex justify-between mt-4">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        )}
        {currentStep < questions.length - 1 && (
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;
