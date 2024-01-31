import React from "react";
import styled from "styled-components";

import { ReactComponent as ReferIllustration } from "../../assets/icons/refer.svg";
import { Button } from "../../components";

const ReferAndEarn = () => {
  return (
    <StyledContainer>
      <div className="illustration">
        <ReferIllustration />
      </div>
      <div>
        <h5 className="section-title mb-10">Invite Friends</h5>
        <p className="s-14">Invite Friends to Talkgram and Expand Your Learning Circle!</p>
      </div>
      <Button>Refer</Button>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 0;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: calc(100vh - 70px);

  .illustration {
    width: 75%;
  }
`;

export default ReferAndEarn;
