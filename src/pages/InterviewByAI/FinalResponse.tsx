import React from 'react';
import styled from 'styled-components';
import { useInterviewStore } from '../../store/interviewStore';
import Accordion from '../../components/Accordion';
import Stack from '@mui/material/Stack';

const FinalResponse = () => {
  const collections = useInterviewStore((store) => store.collections);

  return (
    <StyledFinalResponse>
      <h2>Feedback</h2>
      <Stack direction="column" spacing={1}>
        {collections.map((c, i) => (
          <Accordion
            key={i.toString()}
            title={c.question}
            description={
              <>
                <strong>Answer:</strong> {c.answer}
                <br />
                <br />
                <strong>Feedback:</strong> {c.feedback}
              </>
            }
            defaultExpanded
          />
        ))}
      </Stack>
    </StyledFinalResponse>
  );
};

const StyledFinalResponse = styled.div`
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

export default FinalResponse;
