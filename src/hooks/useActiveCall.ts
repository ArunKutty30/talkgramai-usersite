import { User } from 'firebase/auth';
import { and, collection, limit, onSnapshot, or, query, where } from 'firebase/firestore';
import { useEffect } from 'react';
import { callsStore } from '../store/callsStore';
import { db } from '../utils/firebase';
import { CallStatus } from './useCall';

const CALL_COLLECTION_NAME = 'calls';
const callRef = collection(db, CALL_COLLECTION_NAME);

export const useActiveCallHandler = (user: User | null) => {
  const setActiveCall = callsStore((state) => state.setActiveCall);

  const userId = user?.uid || '';

  useEffect(() => {
    const q = query(
      callRef,
      and(
        or(where('callerId', '==', userId), where('receiver', '==', userId)),
        where('status', 'in', ['ringing', 'connected']),
      ),
      limit(1),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.forEach((doc) => {
          const callData = doc.data();
          onSnapshot(
            doc.ref,
            (docSnapshot) => {
              const callData = docSnapshot.data();
              setActiveCall(callData as CallStatus);
            },
            (error) => {
              console.error('Error fetching upcoming sessions:', error);
            },
          );

          setActiveCall(callData as CallStatus);
        });
      },
      (error) => {
        console.error('Error fetching upcoming sessions:', error);
      },
    );
    return () => unsubscribe();
  }, [userId, setActiveCall]);

  return null;
};
