import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import interviewIcon from '../../assets/icons/interview.png';

const AiServices = () => {
  return (
    <StyledContainer>
      <div className="mx pad">
        <StyledH3>AI Services</StyledH3>
        <StyledCardWrapper>
          <Link to="/ai-services/interview">
            <StyledCard>
              <div className="card-image">
                <img src={interviewIcon} alt="Interview with AI" />
              </div>
              <h4>Interview with AI</h4>
              <ul>
                <li>
                  <p>
                    <strong>Customized Interview Questions</strong>
                    {/* Receive questions that are
                    specifically tailored to the job role you are applying for, ensuring you are
                    well-prepared for relevant scenarios. */}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Instant AI Feedback</strong>
                    {/* After submitting your responses, get
                    immediate feedback from an AI. The feedback includes constructive suggestions on
                    how to improve your answers for a real interview. */}
                  </p>
                </li>
                <li>
                  <p>
                    <strong>Enhanced Interview Readiness</strong>
                    {/* The tool helps you refine your
                    interview technique, boosting your confidence and improving your chances of
                    making a positive impression on potential employers. */}
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

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }

  a {
    color: var(--text-primary);
  }
`;

const StyledCard = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  // background: rgba(217, 217, 217, 0.11);
  background: rgba(255, 255, 255, 1);
  // box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
  cursor: pointer;
  transition: background-color 200ms linear;

  &:hover {
    background-color: rgba(248, 145, 32, 0.09);
  }

  .card-image {
    width: 70px;
    height: 70px;
    background-color: #fff;
    border-radius: 50%;
    margin-bottom: 15px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
    display: grid;
    place-items: center;

    img {
      width: 60%;
      height: 60%;
      object-fit: contain;
    }
  }

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
