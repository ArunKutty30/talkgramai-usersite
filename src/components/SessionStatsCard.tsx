import React from "react";
import styled from "styled-components";

interface ISessionStatsCardProps {
  title: string;
  descirption?: string;
  image: string;
  value: string;
}

const SessionStatsCard: React.FC<ISessionStatsCardProps> = ({
  title,
  image,
  descirption,
  value,
}) => {
  return (
    <StyledSessionStatsCard>
      <div className="flex-between">
        <div className="flex-column">
          <h6 className="s-16 mb-8">{title}</h6>
          {descirption && <p className="s-14 mb-12">{descirption}</p>}
          <h3>{value}</h3>
        </div>
        <div className="block-right">
          <img src={image} alt="" />
        </div>
      </div>
    </StyledSessionStatsCard>
  );
};

const StyledSessionStatsCard = styled.div`
  border-radius: 8px;
  border: 1px solid #ede7df;
  background: var(--white, #fff);
  padding: 25px;

  .block-right {
    height: 100px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    background: #fde9d2;
    border-radius: 50%;

    @media (max-width: 600px) {
      height: 50px;
    }

    img {
      width: 50px;
      height: 50px;
      object-fit: contain;

      @media (max-width: 600px) {
        width: 25px;
        height: 25px;
      }
    }
  }

  .flex-column {
    display: flex;
    flex-direction: column;

    p {
      @media (max-width: 600px) {
        display: none;
      }
    }
  }
`;

export default SessionStatsCard;
