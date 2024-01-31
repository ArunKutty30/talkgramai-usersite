import React from "react";
import styled from "styled-components";
import Button from "../Button";
import { Link } from "react-router-dom";
import Modal from ".";

const SubscriptionEndedModal: React.FC<{ isOpen: boolean; handleClose?: () => void }> = ({
  isOpen,
  handleClose,
}) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose} rootClassName="z-90">
      <StyledModalDiv>
        <p>
          Oops! Looks like you have not subscribed to a plan yet. Explore our subscription plans and
          get started.
        </p>
        <Link to="/subscribe" onClick={() => handleClose && handleClose()}>
          <Button>Subscribe</Button>
        </Link>
      </StyledModalDiv>
    </Modal>
  );
};

export const StyledModalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  gap: 24px;
  padding: 30px;

  p {
    font-size: 18px;
    line-height: 1.2;
  }
`;

export default SubscriptionEndedModal;
