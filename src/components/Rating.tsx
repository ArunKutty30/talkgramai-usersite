import React from "react";
import styled from "styled-components";

import { ReactComponent as StarIcon } from "../assets/icons/star.svg";

const Rating: React.FC<{
  rating: number;
  onClick?: (rating: number) => void;
  iconSize?: number;
}> = ({ rating, onClick, iconSize }) => {
  return (
    <StyledStarList>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          className={i + 1 <= rating ? "active" : ""}
          key={i.toString()}
          style={{width:iconSize,height:iconSize}}
          onClick={() => {
            if (onClick) onClick(i + 1);
          }}
        >
          <StarIcon width={iconSize} height={iconSize} />
        </span>
      ))}
    </StyledStarList>
  );
};

const StyledStarList = styled.div`
  display: flex;

  > span {
    cursor: pointer;
    width: 32px;
    height: 32px;

    &.active {
      svg path {
        fill: var(--primary);
      }
    }
  }
`;

export default Rating;
