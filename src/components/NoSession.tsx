import React from "react";
import styled from "styled-components";

import NoSessionIllustration from "../assets/images/no_sessions.svg";

const NoSession: React.FC<{ message: string }> = ({ message }) => {
  return (
    <StyledNoSession>
      <img src={NoSessionIllustration} alt="no session illustration" />
      <p>{message}</p>
    </StyledNoSession>
  );
};

const StyledNoSession = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 300px;
  width: 100%;
  margin: 0 auto;
  padding: 50px 0;
`;

export default NoSession;
