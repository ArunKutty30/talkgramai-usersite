import React from "react";
import styled from "styled-components";

import { ReactComponent as PageNotFoundIllustration } from "../assets/illustration/404.svg";

const PageNotFound = () => {
  return (
    <StyledDiv>
      <PageNotFoundIllustration />
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 70px);

  svg {
    height: 50vh;
  }
`;

export default PageNotFound;
