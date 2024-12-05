import React from 'react';
import { MeetingProvider, useMeeting } from '@videosdk.live/react-sdk';
import { userStore } from '../../store/userStore';
import { getVideosdkToken } from '../../utils/api';
import ControlBar from './ControlBar';
import ParticipantView from './ParticipantView';
import { Container, VideoGrid } from './styles';
import { useParams } from 'react-router-dom';
import { useHandlePermissions } from './helper';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCall } from '../../hooks/useCall';

function MeetingView({ onMeetingLeave }: { onMeetingLeave: () => Promise<void> }) {
  const navigate = useNavigate();
  const { participants } = useMeeting({
    onMeetingLeft: async () => {
      await onMeetingLeave();
      navigate('/call-peers');
      toast('Call Ended.');
    },
  });

  return (
    <Container>
      <VideoGrid>
        {Array.from(participants.keys()).map((participantId) => (
          <ParticipantView participantId={participantId} key={participantId} />
        ))}
      </VideoGrid>
      <ControlBar />
    </Container>
  );
}

const CallScreen = () => {
  const token = getVideosdkToken() || '';
  const { id: meetingId } = useParams<{ id: string }>();
  const user = userStore((state) => state.user);
  const { currentCallStatus, endCall } = useCall(user);

  const hasPermissions = useHandlePermissions();

  console.log(meetingId, user);

  if (!hasPermissions) return <div>Enable Microphone permission to continue.</div>;

  if (!user || !meetingId || !currentCallStatus) return null;

  const username = user.displayName || user.email || user.uid;
  const id = user.uid;

  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: false,
        name: username,
        debugMode: true,
        participantId: id,
        // metaData: {
        //   profileIm
        // }
      }}
      token={token}
      joinWithoutUserInteraction={true}
    >
      <MeetingView onMeetingLeave={async () => await endCall()} />
    </MeetingProvider>
  );
};

export default CallScreen;
