import React from "react";
import styled from "styled-components";

interface ICard {
  title: string;
  questions: string[];
  image?: string;
}

const Card: React.FC<ICard> = ({ title, questions }) => {
  return (
    <CardWrapper>
      <CardContainer>
        <div>
          {/* <img src={image} alt="" /> */}
          <h5>{title}</h5>
          <ul>
            {questions.map((m, i) => (
              <li key={i.toString()}>{m}</li>
            ))}
          </ul>
        </div>
      </CardContainer>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  border: 1px solid #f7941f;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
`;

const CardContainer = styled.div`
  img {
    max-width: 660px;
    width: 100%;
    height: 100%;
    max-height: 290px;
    border-radius: 4px;
  }
  h5 {
    padding: 16px 0;
    color: #df7e0b;
    font-size: 18px;
    letter-spacing: 0.606px;
  }
  p {
    letter-spacing: 0.48px;
    font-size: 14px;
    color: #423f4e;
    max-width: 620px;
    width: 100%;
  }

  div {
    ul {
      list-style-position: inside;

      li {
        margin-bottom: 10px;

        @media (max-width: 600px) {
          font-size: 14px;
        }
      }
    }
  }
`;

export default Card;
