import React from "react";
import styled from "styled-components";
import { ReactComponent as SingleQuotes } from "../../assets/icons/singleQuotes.svg";

interface ICards {
  title: string;
  description: string;
}

const Cards: React.FC<ICards> = ({ title, description }) => {
  return (
    <CardsContainer>
      <BackgroundSingleQuotes>
        <SingleQuotes />
      </BackgroundSingleQuotes>
      <h5>{title}</h5>
      <DescriptionText>{description}</DescriptionText>
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  background: #f6f6f6;
  width: 100%;
  padding: 30px;
  position: relative;

  h5 {
    color: #df7e0b;
    font-size: 18px;
    letter-spacing: 0.606px;
    margin-bottom: 20px;
  }
  p {
    letter-spacing: 0.4px;
    font-size: 14px;
    color: #423f4e;
    z-index: 100;
  }
`;

const BackgroundSingleQuotes = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  height: 80px;

  svg {
    z-index: -1;
    height: 100%;
  }
`;

const DescriptionText = styled.div`
  position: relative;
  z-index: 1000;
`;

export default Cards;
