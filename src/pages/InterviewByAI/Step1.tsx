import React, { useState } from 'react';
import { interviewData } from '../../constants/interviewData';
import styled from 'styled-components';
import axios from 'axios';

import { Button } from '../../components';
import { useInterviewStore } from '../../store/interviewStore';
import { config } from '../../constants/config';

interface IQuestionResponse {
  questions: string[];
}

const Step1 = () => {
  const [selectedJobDescription, setSelectedJobDescription] = useState<{
    role: string;
    jobDescription: string;
  }>(interviewData[0]);
  const [loading, setLoading] = useState(false);
  const setStep = useInterviewStore((store) => store.setStep);
  const setQuestion = useInterviewStore((store) => store.setQuestion);

  const handleGenerateQuestions = async () => {
    try {
      if (!selectedJobDescription.jobDescription) return;

      console.log(selectedJobDescription);
      setLoading(true);

      const { data } = await axios.post<IQuestionResponse>(`${config.BACKEND_URL}/ai/questions`, {
        jobDescription: selectedJobDescription.jobDescription,
        noOfQuestions: config.NO_OF_QUESTIONS,
      });

      setQuestion(data.questions);
      setStep(2);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledInterviewPageStep1>
      <h2>Select a job description</h2>
      <StyledTagWrapper>
        {interviewData.map((interview, index) => (
          <button
            key={index}
            className={interview.role === selectedJobDescription.role ? 'active' : ''}
            onClick={() =>
              setSelectedJobDescription({
                role: interview.role,
                jobDescription: interview.jobDescription,
              })
            }
          >
            {interview.role}
          </button>
        ))}
      </StyledTagWrapper>
      <StyledForm onSubmit={(e) => e.preventDefault()}>
        <StyledTextAreaDiv>
          <textarea
            required
            placeholder="Select a job role above or type your own job description"
            onChange={(e) =>
              setSelectedJobDescription((s) => ({ role: s.role, jobDescription: e.target.value }))
            }
            value={selectedJobDescription?.jobDescription || ''}
          ></textarea>
        </StyledTextAreaDiv>
        <Button type="submit" onClick={handleGenerateQuestions} disabled={loading}>
          {loading ? 'Generating Questions...' : 'Start Interview'}
        </Button>
      </StyledForm>
    </StyledInterviewPageStep1>
  );
};

const StyledInterviewPageStep1 = styled.div`
  max-width: 720px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  gap: 20px;
  padding: 50px 0;

  h2 {
    margin-bottom: 15px;
  }
`;

const StyledTagWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;

  button {
    font-size: 0.875em;
    padding: 8px 16px;
    border-radius: 24px;
    color: #6a6c70;
    background-color: transparent;
    transition: 0.3s ease;
    cursor: pointer;
    outline: none;
    border: 1px solid #c6c9cf;

    &.active {
      color: var(--primary);
      border: 1px solid var(--primary);
    }
  }
`;

const StyledTextAreaDiv = styled.div`
  width: 100%;

  textarea {
    border-radius: 8px;
    border: 1px solid #c6c9cf;
    height: 336px;
    width: 100%;
    resize: none;
    overflow-y: auto;
    font-size: 16px;
    font-weight: 300;
    padding: 16px;
    box-sizing: border-box;
    font-family: inherit;
    color: #6a6c70;
    outline-color: var(--primary);
  }
`;

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export default Step1;
