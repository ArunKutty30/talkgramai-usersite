import MicOff from '@mui/icons-material/MicOff';
import { useParticipant } from '@videosdk.live/react-sdk';
import { useEffect, useRef } from 'react';
import {
  Avatar,
  ParticipantContainer,
  ParticipantInfo,
  ParticipantName,
  StatusIcon,
  StatusIcons,
  VideoOverlay,
} from './styles';

interface ParticipantViewProps {
  participantId: string;
}

function ParticipantView({ participantId }: ParticipantViewProps) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { micStream, micOn, isLocal, displayName } = useParticipant(participantId);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) => console.error('videoElem.current.play() failed', error));
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <ParticipantContainer>
      <audio ref={micRef} autoPlay muted={isLocal} />

      <VideoOverlay>
        <Avatar>{displayName.charAt(0)}</Avatar>
      </VideoOverlay>

      <ParticipantInfo>
        <ParticipantName>
          {displayName} {isLocal && '(You)'}
        </ParticipantName>
        <StatusIcons>
          {!micOn && (
            <StatusIcon>
              <MicOff fontSize="small" />
            </StatusIcon>
          )}
        </StatusIcons>
      </ParticipantInfo>
    </ParticipantContainer>
  );
}

export default ParticipantView;
