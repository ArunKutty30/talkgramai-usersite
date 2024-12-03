import React, { useEffect } from 'react';
import './styles.css';
import { useCall } from '../../hooks/useCall';
import { userStore } from '../../store/userStore';
import OnlineTutorList from './OnlineTutorList';
import { useNavigate } from 'react-router-dom';
import { RingingDynamicIsland } from './RingingDynamicIsland';

export default function CallToTutor() {
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const { initiateCall, currentCallStatus, endCall } = useCall(user);

  useEffect(() => {
    if (currentCallStatus && currentCallStatus.status === 'connected') {
      navigate('/call-to-tutor/' + currentCallStatus.roomId);
    }
  }, [currentCallStatus, navigate]);

  if (!user) return null;

  return (
    <div className="mx pad">
      {!!currentCallStatus && currentCallStatus.status === 'ringing' && (
        <RingingDynamicIsland callStatus={currentCallStatus} onReject={endCall} />
      )}

      <OnlineTutorList initiateCall={initiateCall} />
    </div>
  );
}
