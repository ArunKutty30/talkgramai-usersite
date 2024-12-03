import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CallDismiss } from 'styled-icons/fluentui-system-filled';
import styled from 'styled-components';
import CallIcon from '@mui/icons-material/Call';
import useOnlineUsers from '../../hooks/useOnlineUsers';

import {
  DynamicContainer,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
} from '../../components/DynamicIsland';
import './styles.css';
import { CallStatus, useCall } from '../../hooks/useCall';
import { userStore } from '../../store/userStore';
import AudioCall from './Audiocall';
import { useMediaDevice } from '@videosdk.live/react-sdk';
import { Timestamp } from 'firebase/firestore';
import Avatar from '../../components/Avatar';
import OnlineTutorList from './OnlineTutorList';
import {useNavigate} from "react-router-dom"
import { Button } from '../../components';

type CallInfoProps = {
  onReject: () => void;
  callStatus: CallStatus;
};

type TimePassedProps = {
  timestamp: Timestamp;
};

const TimePassed: React.FC<TimePassedProps> = ({ timestamp }) => {
  const [timePassed, setTimePassed] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - timestamp.toMillis();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimePassed({ minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return (
    <div>
      {timePassed.minutes}m {timePassed.seconds}s
    </div>
  );
};

const DynamicAction = ({ onReject, callStatus }: CallInfoProps) => {
  return (
    <div className="call-position">
      <DynamicIsland id="dynamic-blob">
        <DynamicContainer className="dynamic-container">
          <div className="relative-flex w-100">
            <DynamicTitle className="dynamic-title">
              <Avatar className="avatar" username={callStatus.receiverName} />
              <div>
                {callStatus.status === 'ringing' ? (
                  'ringing...'
                ) : (
                  <TimePassed timestamp={callStatus.updatedAt} />
                )}
              </div>
            </DynamicTitle>
            <div className="call-controls">
              <CallDismiss onClick={onReject} className="call-add bg-red" />
            </div>
          </div>
        </DynamicContainer>
      </DynamicIsland>
    </div>
  );
};

export function DynamicIslandDemo(props: CallInfoProps) {
  return (
    <DynamicIslandProvider initialSize="large">
      <div>
        <DynamicAction {...props} />
      </div>
    </DynamicIslandProvider>
  );
}

const FadeInStaggerContext = createContext(false);

const viewport = { once: true, margin: '0px 0px -200px' };

export function FadeIn(props: any) {
  let shouldReduceMotion = useReducedMotion();
  let isInStaggerGroup = useContext(FadeInStaggerContext);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: 'hidden',
            whileInView: 'visible',
            viewport,
          })}
      {...props}
    />
  );
}

export function FadeInStagger({ faster = false, ...props }) {
  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={{ staggerChildren: faster ? 0.12 : 0.2 }}
        {...props}
      />
    </FadeInStaggerContext.Provider>
  );
}

export default function CallToTutor() {
  const user = userStore((state) => state.user);
  const navigate = useNavigate()
  const { initiateCall, currentCallStatus, endCall } = useCall(user);

  useEffect(() => {
    console.log("cs", currentCallStatus)
    if (currentCallStatus && currentCallStatus.status === "connected"){
      navigate("/call-to-tutor/" + currentCallStatus.roomId)
    }
  }, [currentCallStatus, navigate])

  if (!user) return null;

  return (
    <div className="mx pad">
      {!!currentCallStatus && currentCallStatus.status === 'ringing' && (
        <DynamicIslandDemo callStatus={currentCallStatus} onReject={endCall} />
      )}
      {/* {!!currentCallStatus && currentCallStatus.status !== 'ended' && (
        <AudioCall
          username={user.displayName || user.email || user.uid}
          id={user.uid}
          meetingId={currentCallStatus.roomId}
        />
      )} */}

      <OnlineTutorList initiateCall={initiateCall} />
    </div>
  );
}

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 50px 0px;

  .card {
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgb(255, 255, 255);
    padding: 25px;
    cursor: pointer;
    transition: background-color 200ms linear;
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;

    .flex-column {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      gap: 8px;
      text-align: center;

      strong {
        font-size: 16px;
      }
    }
  }
`;

const StyledAvatar = styled.div`
  border-radius: 50%;
  background: var(--primary);
  width: 50%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 50px;

  b {
    font-size: 40px;
  }
`;
