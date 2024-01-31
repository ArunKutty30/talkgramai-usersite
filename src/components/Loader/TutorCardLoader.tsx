import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

const TutorCardLoader = () => {
  return (
    <StyledDiv>
      {Array.from({ length: 4 }).map((_, index) => (
        <StyledTutorCard key={index.toString()}>
          <div className="card-image">
            <Skeleton style={{ height: "100%" }} />
          </div>
          <Skeleton count={2} />
        </StyledTutorCard>
      ))}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 270px));
  gap: 20px 70px;
  justify-content: space-between;
`;

const StyledTutorCard = styled.div`
  padding: 32px 32px;
  border-radius: 8px;
  border: 1px solid #ede7df;
  background: var(--white, #fff);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  position: relative;

  .card-image {
    aspect-ratio: 16/12;
    margin-bottom: 20px;
  }
`;

export default TutorCardLoader;
