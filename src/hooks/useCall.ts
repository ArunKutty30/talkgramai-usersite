import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
// import { VideoSDK } from '@videosdk.live/react-sdk';
import { createCall } from '../utils/api';
import { addDoc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';

import { collection, limit, onSnapshot, query, where } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Tutor } from './useOnlineUsers';
import toast from 'react-hot-toast';

const CALL_COLLECTION_NAME = 'calls';
const callRef = collection(db, CALL_COLLECTION_NAME);

export type CallStatus = {
  callerId: string;
  callerName: string | null | undefined;
  receiver: string;
  roomId: string;
  status: 'ended' | 'ringing' | 'connected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  receiverName: string;
};

export const useCall = (user: User | null) => {
  const userId = user?.uid || '';
  const [currentCallStatus, setCallStatus] = useState<CallStatus | null>(null);

  const roomId = currentCallStatus?.roomId;

  useEffect(() => {
    const q = query(
      callRef,
      where('callerId', '==', userId),
      where('status', 'in', ['ringing', 'connected']),
      limit(1)
    );



    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.forEach((doc) => {
          const callData = doc.data();

          console.log("call status fetched")

          onSnapshot(
            doc.ref,
            (docSnapshot) => {
              const callData = docSnapshot.data();
              console.log("call status updated")
              setCallStatus(callData as CallStatus);
            },
            (error) => {
              console.error('Error fetching upcoming sessions:', error);
            }
          ); 

          setCallStatus(callData as CallStatus);
        });
      },
      (error) => {
        console.error('Error fetching upcoming sessions:', error);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  // useEffect(() => {
  //   if (currentCallRef) {
  //     toast.success('Call updated');
  //     const unsubscribe = onSnapshot(
  //       currentCallRef,
  //       (docSnapshot) => {
  //         const callData = docSnapshot.data();
  //         setCallStatus(callData as CallStatus);
  //       },
  //       (error) => {
  //         console.error('Error fetching upcoming sessions:', error);
  //       }
  //     );
  //     return () => unsubscribe();
  //   }
  // }, [currentCallRef]);

  const isBusy = async (tutorId: string) => {
    const q = query(
      callRef,
      where('receiver', '==', tutorId),
      where('status', '!=', 'ended'),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.size > 0) {
      return true;
    }

    return false;
  };

  const initiateCall = async (tutor: Tutor) => {
    const busy = await isBusy(tutor.id);
    if (busy) {
      toast.error('Tutor is busy, try again later');
      return null;
    }
    const roomId: string = await createCall();
    // const roomId: string = "ABCVD";
    const calldoc: CallStatus = {
      callerId: userId,
      callerName: user?.displayName || user?.email,
      receiver: tutor.id,
      receiverName: tutor.name,
      roomId,
      status: 'ringing',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await addDoc(callRef, calldoc);
    setCallStatus(calldoc);
    return roomId;
  };

  const endCall = async () => {
    if (roomId) {
      const callQuery = query(callRef, where('roomId', '==', roomId), limit(1));
      const querySnapshot = await getDocs(callQuery);

      querySnapshot.forEach(async (doc) => {
        await updateDoc(doc.ref, { status: 'ended' });
      });

      console.log("call end done")

      setCallStatus(null);
    }
  };

  return {
    initiateCall,
    endCall,
    currentCallStatus,
  };
};