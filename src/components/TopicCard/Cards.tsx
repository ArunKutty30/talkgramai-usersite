import React from 'react';
import styled from 'styled-components';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import IconButton from '@mui/material/IconButton';

import useSpeechStore from '../../store/useSpeechStore';
import { ReactComponent as SingleQuotes } from '../../assets/icons/singleQuotes.svg';

interface ICards {
  title: string;
  description: string;
}

const Cards: React.FC<ICards> = ({ title, description }) => {
  const { activeId, startSpeech, isPaused, pauseResumeSpeech } = useSpeechStore();

  const handleSpeak = () => {
    if (activeId !== title) {
      startSpeech(title, `${title}. ${description}`);
    } else {
      pauseResumeSpeech();
    }
  };

  return (
    <CardsContainer>
      <BackgroundSingleQuotes>
        <SingleQuotes />
      </BackgroundSingleQuotes>
      <StyledFlex>
        <h5>{title}</h5>
        <IconButton color="primary" onClick={handleSpeak}>
          {activeId === title ? isPaused ? <PlayArrowIcon /> : <PauseIcon /> : <VolumeUpIcon />}
        </IconButton>
      </StyledFlex>
      <DescriptionText>{description}</DescriptionText>
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  border-radius: 8px;
  border: 1px solid #dcdcdc;
  background: #f6f6f6;
  width: 100%;
  padding: 30px;
  position: relative;

  h5 {
    color: #df7e0b;
    font-size: 18px;
    letter-spacing: 0.606px;
  }
  p {
    letter-spacing: 0.4px;
    font-size: 14px;
    color: #423f4e;
    z-index: 100;
    line-height: 150%;
  }
`;

const BackgroundSingleQuotes = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  height: 80px;

  svg {
    z-index: -1;
    height: 100%;
  }
`;

const DescriptionText = styled.div`
  position: relative;
  z-index: 1000;
  line-height: 150%;
`;

const StyledFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
`;

export default Cards;
