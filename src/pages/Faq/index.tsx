import React from 'react';
import styled from 'styled-components';
import ReactPlayer from 'react-player/youtube';

import FaqCard from './FaqCard';
import { faqs } from '../../constants/data';

const Faq = () => {
  return (
    <div className="pad">
      <StyledContainer>
        <StyledFaqSection>
          <h3 style={{ marginBottom: 20 }}>Faq</h3>
          <div className="faq-card-wrapper">
            {faqs.map((q, index) => (
              <FaqCard key={index.toString()} {...q} />
            ))}
          </div>
        </StyledFaqSection>
        <StyledHelpFullSection>
          <h3 style={{ marginBottom: 20 }}>Helpful Videos</h3>
          <StyledVideoWrapper>
            <div className="video-card">
              <ReactPlayer
                url="https://youtu.be/XORBrgA3PDc"
                width="100%"
                height="100%"
                controls={true}
              />
            </div>
          </StyledVideoWrapper>
        </StyledHelpFullSection>
      </StyledContainer>
    </div>
  );
};

const StyledContainer = styled.div`
  padding: 20px 0;
  min-height: calc(100vh - 64px);
`;

const StyledHelpFullSection = styled.div`
  margin-bottom: 30px;
`;

const StyledFaqSection = styled.div`
  margin-bottom: 30px;

  .faq-card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-bottom: 30px;

    .faq-card {
      border: 1px solid var(--primary);
      border-radius: 8px;
      padding: 0 15px;

      &-title {
        padding: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
      }
    }
  }
`;

const StyledVideoWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  .video-card {
    width: 100%;
    aspect-ratio: 16/9;
  }
`;

export default Faq;
