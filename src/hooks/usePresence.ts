import { useCallback, useEffect, useMemo } from 'react';
import { ref, onDisconnect, set, update, serverTimestamp, onValue } from 'firebase/database';
import { rtdb } from '../utils/firebase';
import { User } from 'firebase/auth';
// import { useIncomingCall } from "./useIncomingCalls";

interface PresenceData {
  id: string;
  name: string | null;
  photoURL: string | null;
  state: 'online' | 'offline' | 'busy';
  last_changed: any; // Using Firebase server timestamp
  role: string;
}

export const useUserPresence = (user: User | null, profileImg: string | undefined) => {
  const userId = user?.uid;

  // const { incomingCall } = useIncomingCall(user?.uid);

  const userStatusRef = useMemo(() => ref(rtdb, `/status/${userId}`), [userId]);

  const updatePresenceData = useCallback(
    (state: PresenceData['state']): PresenceData => ({
      id: userId!,
      name: user?.displayName!,
      photoURL: profileImg ?? null,
      state,
      last_changed: serverTimestamp(),
      role: 'student',
    }),
    [userId, user?.displayName, profileImg],
  );

  // useEffect(() => {
  //   if (!userId) return;
  //   if (
  //     incomingCall &&
  //     ["ringing", "connected"].includes(incomingCall.status)
  //   ) {
  //     update(userStatusRef, { busy: true });
  //   } else {
  //     update(userStatusRef, { busy: false });
  //   }
  // }, [updatePresenceData, incomingCall]);

  useEffect(() => {
    if (!userId) return;

    const onlineData = updatePresenceData('online');
    const offlineData = updatePresenceData('offline');

    const setupPresence = async () => {
      await set(userStatusRef, onlineData);

      onDisconnect(userStatusRef).set(offlineData);

      const unsubscribe = onValue(userStatusRef, (snapshot) => {
        if (!snapshot.exists() || snapshot.val().state === 'offline') {
          set(userStatusRef, onlineData);
        }
      });

      return unsubscribe;
    };

    // const handleVisibilityChange = () => {
    //   if (!document.hidden) {
    //     set(userStatusRef, onlineData);
    //   }
    // };

    // document.addEventListener("visibilitychange", handleVisibilityChange);

    setupPresence().catch(console.error);

    return () => {
      // document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, updatePresenceData, userStatusRef]);
};
