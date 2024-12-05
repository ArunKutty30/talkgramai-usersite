import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCall } from '../hooks/useCall';
import { RingingDynamicIsland } from '../pages/CallToTutor/RingingDynamicIsland';
import { callsStore } from '../store/callsStore';
import { userStore } from '../store/userStore';

const ringtonePath = `/nokia.mp3`;

export default function RingingHandler() {
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const [ringtone] = useState<HTMLAudioElement>(new Audio(ringtonePath));

  const currentCallStatus = callsStore((state) => state.activeCall);

  const { endCall, acceptCall } = useCall(user);

  useEffect(() => {
    if (currentCallStatus && currentCallStatus.status === 'connected') {
      navigate('/call/' + currentCallStatus.roomId);
    }
  }, [currentCallStatus, navigate]);

  useEffect(() => {
    if (currentCallStatus?.status === 'ringing' && currentCallStatus.receiver === user?.uid) {
      ringtone.loop = true;
      ringtone.play().catch(() => console.log('Error playing ringtone'));
    } else {
      ringtone.pause();
      ringtone.currentTime = 0;
    }

    return () => {
      ringtone.pause();
      ringtone.currentTime = 0;
    };
  }, [currentCallStatus, ringtone, user]);

  if (!user) return null;

  return (
    <div className="mx pad">
      {!!currentCallStatus && currentCallStatus.status === 'ringing' && (
        <RingingDynamicIsland
          isIncoming={currentCallStatus.receiver === user.uid}
          callStatus={currentCallStatus}
          onReject={endCall}
          onAccept={acceptCall}
        />
      )}
    </div>
  );
}
