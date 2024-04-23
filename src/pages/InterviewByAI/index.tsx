import React, { useEffect } from 'react';

import Step1 from './Step1';
import InterviewQuestion from './InterviewQuestion';
import { useInterviewStore } from '../../store/interviewStore';
import FinalResponse from './FinalResponse';

const InterviewByAI: React.FC = () => {
  const step = useInterviewStore((store) => store.step);
  const reset = useInterviewStore((store) => store.reset);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <div className="pb">
      {
        {
          1: <Step1 />,
          2: <Questions />,
          3: <FinalResponse />,
        }[step]
      }
    </div>
  );
};

const Questions = () => {
  const questions = useInterviewStore((store) => store.questions);
  const currentQuestion = useInterviewStore((store) => store.currentQuestion);

  return (
    <>
      {questions.map((m, index) =>
        index + 1 === currentQuestion ? (
          <InterviewQuestion key={index.toString()} title={`Question ${index + 1}`} question={m} />
        ) : null
      )}
    </>
  );
};

export default InterviewByAI;
