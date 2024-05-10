import * as React from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Button from '@mui/material/Button';
import useSpeechStore from '../store/useSpeechStore';

interface IAccordionProps extends Omit<AccordionProps, 'children'> {
  title: string;
  description: string;
  feedback?: React.ReactNode;
  showSysthesis?: boolean;
}

export default function Accordion({
  title,
  description,
  feedback,
  showSysthesis,
  ...rest
}: IAccordionProps) {
  const { activeId, startSpeech, isPaused, pauseResumeSpeech } = useSpeechStore();

  const handleSpeak = () => {
    if (activeId !== title) {
      startSpeech(title, description);
    } else {
      pauseResumeSpeech();
    }
  };

  return (
    <div>
      <MuiAccordion sx={{ '&.Mui-expanded': { margin: 0 } }} {...rest}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ fontWeight: '500', color: '#000' }}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {showSysthesis && (
            <Button
              onClick={handleSpeak}
              variant="outlined"
              endIcon={
                activeId === title ? isPaused ? <PlayArrowIcon /> : <PauseIcon /> : <VolumeUpIcon />
              }
              sx={{ textTransform: 'capitalize', mb: 2, borderRadius: '30px' }}
            >
              Speak
            </Button>
          )}
          <Typography sx={{ marginBottom: feedback ? '15px' : 0 }}>{description}</Typography>
          {feedback &&
            (typeof feedback === 'string' ? (
              <Typography>
                <strong>Feedback:</strong> {feedback}
              </Typography>
            ) : (
              feedback
            ))}
        </AccordionDetails>
      </MuiAccordion>
    </div>
  );
}
