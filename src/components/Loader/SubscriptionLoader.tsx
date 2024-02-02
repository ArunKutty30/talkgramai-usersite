import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

const SubscriptionLoader = () => {
  return (
    <StyledContainer>
      <div className="mx pad">
        <div className="header">
          <Skeleton width={"50%"} style={{ marginBottom: 20 }} />
          <Skeleton count={2} />
        </div>
        <div className="card">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i.toString()} style={{ aspectRatio: 1 }} />
          ))}
        </div>
      </div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 0;
  min-height: calc(100vh - 70px);

  .header {
    margin-bottom: 30px;
  }

  .card {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

export default SubscriptionLoader;
