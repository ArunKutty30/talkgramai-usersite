import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import StopIcon from '@mui/icons-material/Stop';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import { Button } from '../../components';
import Accordion from '../../components/Accordion';
import { config } from '../../constants/config';
import { useInterviewStore } from '../../store/interviewStore';

interface IInterviewQuestionProps {
  title: string;
  question: string;
}

interface ISampleResponse {
  sampleResponse: string;
}

interface IFeedbackResponse {
  feedback: string;
}

const InterviewQuestion: React.FC<IInterviewQuestionProps> = ({ title, question }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sampleResponse, setSampleResponse] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState('0:00 / 2:00');
  const setStep = useInterviewStore((store) => store.setStep);
  const currentQuestion = useInterviewStore((store) => store.currentQuestion);
  const setCurrentQuestion = useInterviewStore((store) => store.setCurrentQuestion);
  const collections = useInterviewStore((store) => store.collections);
  const setCollections = useInterviewStore((store) => store.setCollections);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (currentStep === 2) {
      let elapsedTime = 0; // Timer starts at 0 seconds
      intervalId = setInterval(() => {
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        setTimer(`${minutes}:${seconds.toString().padStart(2, '0')} / 2:00`);

        if (elapsedTime >= 120) {
          clearInterval(intervalId);
          setCurrentStep(3); // Automatically move to the next step after 2 minutes
        } else {
          elapsedTime++;
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentStep]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { data: sampleResponseData } = await axios.post<ISampleResponse>(
        `${config.BACKEND_URL}/ai/sample-response`,
        { question }
      );
      const { data: feedbackData } = await axios.post<IFeedbackResponse>(
        `${config.BACKEND_URL}/ai/feedback`,
        { question, answer: transcript }
      );

      setSampleResponse(sampleResponseData.sampleResponse);
      setFeedback(feedbackData.feedback);

      const responses = collections;
      responses.push({ question, answer: transcript, feedback: feedbackData.feedback });
      setCollections(responses);
      setCurrentStep((s) => s + 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const renderStep1 = (
    <IconButton
      sx={{
        backgroundColor: '#d32f2f',
        '&:hover': { backgroundColor: 'rgba(211, 47, 47,0.7)' },
      }}
      onClick={() => {
        setCurrentStep(2);
        SpeechRecognition.startListening({ continuous: true });
      }}
    >
      <MicIcon sx={{ color: '#fff' }} />
    </IconButton>
  );

  const renderStep2 = (
    <IconButton
      sx={{
        backgroundColor: '#d32f2f',
        '&:hover': { backgroundColor: 'rgba(211, 47, 47,0.7)' },
      }}
      onClick={() => {
        setCurrentStep(3);
        SpeechRecognition.stopListening();
      }}
    >
      <StopIcon sx={{ color: '#fff' }} />
    </IconButton>
  );

  const renderStep3 = (
    <Stack direction={'row'} spacing={2}>
      <Button disabled={loading} onClick={() => handleSubmit()}>
        {loading ? 'Please wait...' : 'Submit'}
      </Button>
      <Button
        variant="error"
        onClick={() => {
          setCurrentStep(1);
          resetTranscript();
          setTimer('0:00 / 2:00');
        }}
      >
        Retry
      </Button>
    </Stack>
  );

  const renderStep4 = (
    <Stack direction={'row'} spacing={2}>
      <Button
        onClick={() => {
          if (currentQuestion === 3) {
            setStep(3);
            return;
          }
          setCurrentQuestion(currentQuestion + 1);
        }}
      >
        {currentQuestion === 3 ? 'View Review' : 'Next Question'}
      </Button>
    </Stack>
  );

  return (
    <StyledInterviewQuestions>
      <StyledInterviewQuestionsHeader>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <p>{title}</p>
        <Button variant="secondary">End</Button>
      </StyledInterviewQuestionsHeader>
      <StyledCard>
        <StyledSection1>
          <h3>{question}</h3>
        </StyledSection1>
        <StyledRecorder>
          {currentStep === 4 && <StyledTranscript>"{transcript}"</StyledTranscript>}
          {currentStep !== 4 && <h3>{timer}</h3>}
          {
            {
              1: renderStep1,
              2: renderStep2,
              3: renderStep3,
              4: renderStep4,
            }[currentStep]
          }
        </StyledRecorder>
        <Accordion title="Feedback" description={feedback} disabled={!feedback} />
        <Accordion
          title="Sample Response"
          description={sampleResponse}
          disabled={!sampleResponse}
        />
      </StyledCard>
    </StyledInterviewQuestions>
  );
};

const StyledInterviewQuestions = styled.div`
  max-width: 720px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  gap: 20px;
  padding: 50px 0;
`;

const StyledInterviewQuestionsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const StyledCard = styled.div`
  width: 100%;
  margin: auto;
  border: 1px solid #c6c9cf;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 16px rgba(15, 24, 56, 0.1);
`;

const StyledSection1 = styled.div`
  padding: 30px;

  h3 {
    font-size: 22px;
    text-align: center;
  }
`;

const StyledRecorder = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  padding-bottom: 50px;
`;

const StyledTranscript = styled.p`
  padding: 0 30px;
  text-align: center;
  font-size: 16px;
`;

export default InterviewQuestion;
