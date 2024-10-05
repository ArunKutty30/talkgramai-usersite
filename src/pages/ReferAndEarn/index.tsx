import React, { useState } from 'react';
import styled from 'styled-components';
import InstagramIcon from '@mui/icons-material/Instagram';
import MailIcon from '@mui/icons-material/Mail';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkIcon from '@mui/icons-material/CopyAll';

import { ReactComponent as ReferIllustration } from '../../assets/icons/refer.svg';
import { Button } from '../../components';
import Modal from '../../components/Modal';
import { useCopyToClipboard } from 'usehooks-ts';
import toast from 'react-hot-toast';

const ReferAndEarn = () => {
  const [openModal, setOpenModal] = useState(false);
  const [, setCopy] = useCopyToClipboard();

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => setOpenModal(false);

  const handleCopy = () => {
    setCopy('https://talkgram.in');
    toast.success('Link copied');
  };

  return (
    <StyledContainer>
      <div className="illustration">
        <ReferIllustration />
      </div>
      <div>
        <h5 className="section-title mb-10">Invite Friends</h5>
        <p className="s-14">Invite Friends to Simple Trade and Expand Your Learning Circle!</p>
      </div>
      <Button onClick={handleOpenModal}>Refer</Button>
      <Modal isOpen={openModal} handleClose={handleCloseModal}>
        <StyledDivModal>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              'https://talkgram.in'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" startIcon={<TwitterIcon />}>
              share via twitter
            </Button>
          </a>
          <a
            href={`https://www.instagram.com/talkgram.in?url=${encodeURIComponent(
              'https://talkgram.in'
            )}&caption=&hashtags=english,learning`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" startIcon={<InstagramIcon />}>
              share via instagram
            </Button>
          </a>

          <a
            href={`mailto:?subject=${encodeURIComponent(
              'Welcome to Simple Trade'
            )}&body=${encodeURIComponent('https://talkgram.in')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" startIcon={<MailIcon />}>
              share via Email
            </Button>
          </a>
          <Button onClick={handleCopy} variant="secondary" startIcon={<LinkIcon />}>
            Copy link
          </Button>
        </StyledDivModal>
      </Modal>
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

const StyledDivModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;

  > a {
    display: block;

    button {
      width: 100%;
    }
  }
`;

export default ReferAndEarn;
