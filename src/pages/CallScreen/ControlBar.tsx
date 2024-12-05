import Mic from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import Phone from '@mui/icons-material/Phone';
import Tooltip from '@mui/material/Tooltip';
import { useMeeting } from '@videosdk.live/react-sdk';
import React from 'react';
//import CallDuration from './CallDuration';
import { ControlBarContainer, ControlButton, ControlsWrapper } from './styles';

function ControlBar() {
  const isMuted = false;
  const { toggleMic, end } = useMeeting();

  const controls = [
    {
      icon: isMuted ? <MicOffIcon /> : <Mic />,
      label: isMuted ? 'Unmute' : 'Mute',
      onClick: () => toggleMic(),
      tooltip: isMuted ? 'Turn on microphone (⌘+D)' : 'Turn off microphone (⌘+D)',
    },

    {
      icon: <Phone style={{ transform: 'rotate(135deg)' }} />,
      label: 'End Call',
      onClick: () => end(),
      variant: 'danger',
      tooltip: 'Leave call',
    },
  ];

  return (
    <ControlBarContainer>
      <ControlsWrapper>
        {/* <CallDuration /> */}

        {controls.map((control, index) => (
          <Tooltip arrow title={control.tooltip}>
            <ControlButton
              onClick={control.onClick}
              $variant={control.variant === 'danger' ? 'danger' : undefined}
            >
              {control.icon}
            </ControlButton>
          </Tooltip>
        ))}
      </ControlsWrapper>
    </ControlBarContainer>
  );
}

export default ControlBar;
