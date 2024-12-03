import React, { useEffect, useState } from 'react';

import { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import {
  DynamicContainer,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
} from '../../components/DynamicIsland';
import './styles.css';
import { CallDismiss } from 'styled-icons/fluentui-system-filled';
import { CallStatus, useCall } from '../../hooks/useCall';
import { userStore } from '../../store/userStore';
import AudioCall from './Audiocall';
import { useMediaDevice } from '@videosdk.live/react-sdk';
import { Timestamp } from 'firebase/firestore';
import Avatar from '../../components/Avatar';
import OnlineTutorList from './OnlineTutorList';
import {useNavigate} from "react-router-dom"
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
              <Avatar username={callStatus.receiverName} />
              <div>
                {callStatus.status === 'ringing' ? (
                  'ringing...'
                ) : (
                  <TimePassed timestamp={callStatus.updatedAt} />
                )}
              </div>
            </DynamicTitle>
            <div className="relative-flex">
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
    <div
      style={{
        padding: 16,
        display: 'flex',
        gap: 4,
      }}
    >
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
