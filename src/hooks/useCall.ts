import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
// import { VideoSDK } from '@videosdk.live/react-sdk';
import { createCall } from '../utils/api';
import { addDoc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';

import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { User } from 'firebase/auth';

const CALL_COLLECTION_NAME ="calls"
const callRef = collection(db, CALL_COLLECTION_NAME);

type CallStatus = {
  callerId: string;
  callerName: string | null | undefined;
  receiver: string;
  roomId: string;
  status: string;
  createdAt: Timestamp;
}

export const useCall = (user: User | null) => {
  const userId = user?.uid || "";
  const [currentCallStatus, setCallStatus] = useState<CallStatus | null>(null);

  const roomId = currentCallStatus?.roomId;

  useEffect(() => { 
    const q = query(
      callRef,
      where('callerId', '==', userId),
      where('status', '==', 'ringing'),
      limit(1)
    );
  
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.forEach((doc) => {
          const callData = doc.data();
          setCallStatus(callData as CallStatus);
        });
      },
      (error) => {
        console.error('Error fetching upcoming sessions:', error);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (roomId) {
      const q = query(
        callRef,
        where("roomId", "==", roomId),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          snapshot.forEach((doc) => {
            const callData = doc.data();
            setCallStatus(callData as CallStatus);
          });
        },
        (error) => {
          console.error("Error fetching upcoming sessions:", error);
        }
      );
      return () => unsubscribe();
    }
  }, [roomId]);

  // Initiate a call
  const initiateCall = async (receiverId: string ) => {
    const roomId: string = await createCall();
    const calldoc: CallStatus = {
      callerId: userId,
      callerName: user?.displayName,
      receiver: receiverId,
      roomId,
      status: 'ringing',
      createdAt: Timestamp.now(),
    }
    await addDoc(callRef, calldoc );
    setCallStatus(calldoc);
    return roomId;
  };

  // Accept a call
  const acceptCall = async (roomId: string) => {
    // const meeting = VideoSDK.initMeeting({
    //   meetingId: roomId,
    //   participantId: userId,
    //   token: VIDEO_SDK_TOKEN,
    // });

    // await meeting.join();

    // Update the call status in Firestore
    // const callQuery = db.collection('calls').where('roomId', '==', roomId);
    // const callSnapshot = await callQuery.get();

    // callSnapshot.forEach(async (doc) => {
    //   await doc.ref.update({ status: 'connected' });
    // });

    // setRoomId(roomId);
  };


  const endCall = async () => {
    if (roomId) {
      const callQuery = query(callRef, where("roomId", "==", roomId), limit(1));
      const querySnapshot = await getDocs(callQuery);

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { status: "ended" });
      });

      setCallStatus(null);
    }
  };

  return {
    initiateCall,
    acceptCall,
    endCall,
    currentCallStatus,
  };
};
