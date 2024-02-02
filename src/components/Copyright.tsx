import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  padding: 20px 0px 25px 0px;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-top: 1px solid #c5c5c5;
  p {
    color: #646464;
    font-size: 14px;
  }
`;

const Copyright = () => {
  return (
    <Container>
      <p>2023 Talkgram 0.0.8, All Rights Reserved</p>
    </Container>
  );
};

export default Copyright;
