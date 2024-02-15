import React from "react";
import styled from "styled-components";

import Modal from ".";
import { IChat } from "../../constants/types";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

interface IChatModalProps {
  handleClose?: () => void;
  chats: IChat[];
  isOpen: boolean;
}

const ChatModal: React.FC<IChatModalProps> = ({ isOpen, handleClose, chats }) => {
  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <StyledChatContainer>
        <StyledChatHeader>
          <h3>Chats</h3>
          <div role="button" className="pointer" onClick={handleClose}>
            <CloseIcon />
          </div>
        </StyledChatHeader>
        <StyledChatWrapper>
          {chats.length ? (
            chats.map((m) => <StyledChat>{m.message}</StyledChat>)
          ) : (
            <StyledNoChatMessage>No chat messages</StyledNoChatMessage>
          )}
        </StyledChatWrapper>
      </StyledChatContainer>
    </Modal>
  );
};

const StyledChatContainer = styled.div`
  height: 75vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
`;

const StyledChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 20px 20px;
  background-color: var(--card-bg, #fff);
`;

const StyledChatWrapper = styled.div`
  flex: 1;
  padding: 10px 20px;
  background-color: rgba(250, 250, 255, 1);
`;

const StyledChat = styled.div`
  padding: 6px 10px;
  border-radius: 15px 15px 15px 0;
  background-color: var(--gray, rgb(238, 237, 237));
  margin-bottom: 10px;
  max-width: 75%;
  width: fit-content;
`;

const StyledNoChatMessage = styled.div`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export default ChatModal;
