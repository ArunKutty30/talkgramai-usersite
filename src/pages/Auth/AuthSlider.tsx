import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authSliderImages, testimonials } from "../../utils/data";

const StyledSliderDiv = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  bottom: 20px;
  width: calc(50% - 50px);
  background: rgba(189, 177, 185, 0.1);
  border-radius: 10px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledSectionOne = styled.div`
  display: flex;
  flex: 0 0 150px;
  align-items: flex-end;

  .section-one {
    padding: 0 50px 0;

    .section-one-card {
      p {
        font-size: 16px;
        line-height: 140%;
        color: var(--text-primary);
        margin-bottom: 8px;
      }

      span {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: var(--text-secondary);

        &::before {
          content: "- ";
        }
      }
    }
  }
`;

const StyledSectionTwo = styled.div`
  display: flex;
  flex: 1;

  .section-two {
    padding: 50px 0 0 50px;
  }
`;

const AuthSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((c) => (c === 0 ? c + 1 : c === testimonials.length - 1 ? 0 : c + 1));
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <StyledSliderDiv>
      <StyledSection>
        <StyledSectionOne>
          <div className="section-one">
            {testimonials.map((t, index) => {
              return index === currentSlide ? (
                <div key={index.toString()} className="section-one-card">
                  <p>{t.description}</p>
                  <span>{t.author}</span>
                </div>
              ) : null;
            })}
          </div>
        </StyledSectionOne>
        <StyledSectionTwo>
          <div className="section-two">
            {authSliderImages.map((t, index) => {
              return index === currentSlide ? (
                <div key={index.toString()}>
                  <img src={t} alt="" />
                </div>
              ) : null;
            })}
          </div>
        </StyledSectionTwo>
      </StyledSection>
    </StyledSliderDiv>
  );
};

export default AuthSlider;
