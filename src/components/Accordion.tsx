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
  const [isPaused, setIsPaused] = React.useState(false);
  const [speechSynthesisUtterance, setSpeechSynthesisUtterance] =
    React.useState<SpeechSynthesisUtterance | null>(null);

  const handleSpeak = () => {
    const speechSynthesis = window.speechSynthesis;

    if (!speechSynthesisUtterance) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel(); // Stop any currently speaking synthesis
        setTimeout(() => {
          // Delay new speech to ensure cancel completes
          startSpeaking();
        }, 100); // Delay of 100 ms
      } else {
        startSpeaking();
      }
    } else if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const startSpeaking = () => {
    let utterance = new SpeechSynthesisUtterance(description);
    utterance.onend = () => {
      setSpeechSynthesisUtterance(null);
      setIsPaused(false); // Reset pause state on end
    };
    window.speechSynthesis.speak(utterance);
    setSpeechSynthesisUtterance(utterance);
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
              onClick={() => handleSpeak()}
              variant="outlined"
              endIcon={
                speechSynthesisUtterance ? (
                  isPaused ? (
                    <PlayArrowIcon />
                  ) : (
                    <PauseIcon />
                  )
                ) : (
                  <VolumeUpIcon />
                )
              }
              sx={{ textTransform: 'capitalize', mb: 2, borderRadius: '30px' }}
            >
              speak
            </Button>
          )}
          <Typography>{description}</Typography>
          {feedback ? (
            typeof feedback === 'string' ? (
              <Typography>
                <strong>Feedback:</strong> {feedback}
              </Typography>
            ) : (
              feedback
            )
          ) : null}
        </AccordionDetails>
      </MuiAccordion>
    </div>
  );
}
