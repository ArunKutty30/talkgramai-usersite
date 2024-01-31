import React from "react";
import Modal from ".";
import styled from "styled-components";
import { Button } from "..";
import { auth } from "../../utils/firebase";

interface ILogoutModal {
  isOpen: boolean;
  handleClose?: () => void;
}

const LogoutModal: React.FC<ILogoutModal> = ({ isOpen, handleClose }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <StyledDiv>
        <h4>Are you sure! you want to logout?</h4>
        <div className="controls">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="error-filled" onClick={() => handleLogout()}>
            Logout
          </Button>
        </div>
      </StyledDiv>
    </Modal>
  );
};

const StyledDiv = styled.div`
  padding: 20px;

  .controls {
    margin-top: 30px;
    display: grid;
    gap: 15px;
    grid-template-columns: 1fr 1fr;
  }
`;

export default LogoutModal;
