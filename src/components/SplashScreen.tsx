import React from "react";
import styled from "styled-components";
import logo from "../assets/logo/logo.png";

const StyledScreen = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: #fff;
  z-index: 100000;
`;

const SplashScreen = () => {
  return (
    <StyledScreen>
      <img src={logo} alt="logo" style={{ height: "40px" }} />
    </StyledScreen>
  );
};

export default SplashScreen;
