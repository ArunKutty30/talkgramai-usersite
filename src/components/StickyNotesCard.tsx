import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface IStickyNotesCard {
  title: string;
  description: string;
  image: string;
  backgroundColor: string;
  to?: string;
  openOnNextpage?: boolean;
}

const StickyNotesCard: React.FC<IStickyNotesCard> = ({
  title,
  description,
  image,
  backgroundColor,
  to,
  openOnNextpage,
}) => {
  if (to) {
    return (
      <Link
        to={to}
        target={openOnNextpage ? "_blank" : undefined}
        rel={openOnNextpage ? "noopener noreferrer" : undefined}
        style={{ color: "inherit" }}
      >
        <StyledStickyCard style={{ backgroundColor }}>
          <StyledBlockOne>
            <h4>{title}</h4>
            <p className="s-14">{description}</p>
          </StyledBlockOne>
          <img src={image} alt="" />
        </StyledStickyCard>
      </Link>
    );
  }

  return (
    <StyledStickyCard style={{ backgroundColor }}>
      <StyledBlockOne>
        <h4>{title}</h4>
        <p className="s-14">{description}</p>
      </StyledBlockOne>
      <img src={image} alt="" />
    </StyledStickyCard>
  );
};

const StyledStickyCard = styled.div`
  border-radius: 8px;
  border: 0.7px solid #dfdfdf;
  background: #fdb3b3;

  > img {
    width: 100%;
  }
`;

const StyledBlockOne = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 40px 40px 0;
`;

export default StickyNotesCard;
