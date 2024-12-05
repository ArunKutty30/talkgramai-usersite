import React, { useEffect, useState } from 'react';
import './styles.css';
import { useCall } from '../../hooks/useCall';
import { userStore } from '../../store/userStore';
import OnlineTutorList from './OnlineTutorList';
import { useNavigate } from 'react-router-dom';
import { RingingDynamicIsland } from './RingingDynamicIsland';

const ringtonePath = `/nokia.mp3`;

export default function CallToTutor() {
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const [ringtone] = useState<HTMLAudioElement>(new Audio(ringtonePath));

  const { initiateCall, currentCallStatus, endCall, acceptCall } = useCall(user);

  useEffect(() => {
    if (currentCallStatus && currentCallStatus.status === 'connected') {
      navigate('/call-to-tutor/' + currentCallStatus.roomId);
    }
  }, [currentCallStatus, navigate]);

  useEffect(() => {
    if (currentCallStatus?.status === 'ringing' && currentCallStatus.receiver === user?.uid) {
      ringtone.loop = true; // Loop the ringtone
      ringtone.play().catch(() => console.log('Error playing ringtone')); // Play the ringtone
    } else {
      ringtone.pause(); // Stop the ringtone when not ringing
      ringtone.currentTime = 0; // Reset to the start
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

      <OnlineTutorList userId={user.uid} initiateCall={initiateCall} />
    </div>
  );
}
