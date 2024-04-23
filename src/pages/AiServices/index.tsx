import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AiServices = () => {
  return (
    <StyledContainer>
      <div className="mx pad">
        <StyledH3>AI Services</StyledH3>
        <StyledCardWrapper>
          <Link to="/ai-services/interview">
            <StyledCard>
              <h4>Interview with AI</h4>
              <ul>
                <li>
                  <p>
                    <strong>Customized Interview Questions:</strong> Receive questions that are
                    specifically tailored to the job role you are applying for, ensuring you are
                    well-prepared for relevant scenarios.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Instant AI Feedback:</strong> After submitting your responses, get
                    immediate feedback from an AI. The feedback includes constructive suggestions on
                    how to improve your answers for a real interview.
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Enhanced Interview Readiness:</strong> The tool helps you refine your
                    interview technique, boosting your confidence and improving your chances of
                    making a positive impression on potential employers.
                  </p>
                </li>
              </ul>
            </StyledCard>
          </Link>
        </StyledCardWrapper>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding: 30px 0;
`;

const StyledH3 = styled.h3`
  margin-bottom: 2rem;
`;

const StyledCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  a {
    color: var(--text-primary);
  }
`;

const StyledCard = styled.div`
  border-radius: 12px;
  border: 2px solid rgba(248, 145, 32, 0.25);
  background: rgba(217, 217, 217, 0.11);
  box-shadow: rgba(0, 0, 0, 0.18) 0px 1px 1px 0px;
  padding: 25px;
  cursor: pointer;

  h4 {
    font-size: 22px;
    margin-bottom: 15px;
  }

  ul {
    list-style-position: outside;
    margin-left: 15px;
  }

  li {
    margin-bottom: 5px;
  }
`;

export default AiServices;
