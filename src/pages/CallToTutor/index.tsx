import React, { useEffect } from 'react';
import useOnlineUsers from '../../hooks/useOnlineUsers';

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
import { useCall } from '../../hooks/useCall';
import { userStore } from '../../store/userStore';
import AudioCall from './Audiocall';
import { useMediaDevice } from '@videosdk.live/react-sdk';

type CallInfoProps = {
  title: string;
  onReject: () => void;
};


const DynamicAction = ({ title, onReject }: CallInfoProps) => {
  return (
    <div className="call-position">
      <DynamicIsland id="dynamic-blob">
        <DynamicContainer className="dynamic-container">
          <div className="relative-flex w-100">
            <DynamicTitle className="dynamic-title">{title}</DynamicTitle>
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
        <DynamicAction {...props}/>
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
  const onlineUsers = useOnlineUsers();
  const user = userStore((state) => state.user);

  const { initiateCall , currentCallStatus, endCall} = useCall(user);

  
const { requestPermission } = useMediaDevice();

const checkMediaPermission = async () => {
    try {
      //@ts-ignore
      await requestPermission("audio")
  } catch (ex) {
  }
};



useEffect(() => {
  checkMediaPermission()
}, [])
  console.log(onlineUsers);

  if (!user) return null;


  return (
    <div
      style={{
        padding: 16,
        display: 'flex',
      }}
    >
      {!!currentCallStatus && currentCallStatus.status !== "ended" && <DynamicIslandDemo onReject={endCall} title={
        currentCallStatus.status === "ringing" ? `Ringing...` : "Call in progress"
      } />}
      {
        !!currentCallStatus && <AudioCall username={user.displayName || user.email ||  user.uid} id={user.uid} meetingId={currentCallStatus.roomId} />
      }

      {onlineUsers.map((tutor) => {
        return (
          <div
            style={{
              width: 100,
              height: 100,
              cursor: 'pointer',
              backgroundColor: 'gray',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
            }}
            onClick={() => initiateCall(tutor.id)}
            key={tutor.id}
          >
            {tutor.name}
          </div>
        );
      })}
    </div>
  );
}
