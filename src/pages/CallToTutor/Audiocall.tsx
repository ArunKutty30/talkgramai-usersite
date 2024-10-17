import React, { memo, useEffect, useRef } from 'react';
import { MeetingProvider, useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import { getVideosdkToken } from '../../utils/api';

interface AudioCallProps {
  meetingId: string;
  username: string;
  id: string
}

function ParticipantView({ participantId }: { participantId: string }) {
  const micRef = useRef<HTMLAudioElement>(null);
  const { micStream, micOn, isLocal } = useParticipant(participantId);
  console.log(participantId, isLocal);

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
    <div key={participantId}>
      <audio ref={micRef} autoPlay muted={isLocal} />
    </div>
  );
}

function MeetingView({ onMeetingLeave }: { onMeetingLeave: () => void }) {
  const { participants,  } = useMeeting({
    onMeetingJoined: () => {
      console.log('meeting joined');
    },
    onMeetingLeft: () => {
      onMeetingLeave();
    },
  });

  console.log("MeetingView rendering");

  // console.log("participants", participants);

  return (
    <>
      {Array.from(participants.keys()).map((participantId) => (
        <ParticipantView participantId={participantId} key={participantId} />
      ))}
    </>
  );
}

const AudioCall: React.FC<AudioCallProps> = ({ meetingId, username, id}) => {
  const token = getVideosdkToken() || '';

  console.log("AudioCallrendering");

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: false,
        name: username,
        debugMode: true,
        participantId: id,
      }}
      token={token}
      joinWithoutUserInteraction={true}
    >
      <MeetingView onMeetingLeave={() => {}} />
    </MeetingProvider>
  );
};

export default memo(AudioCall);