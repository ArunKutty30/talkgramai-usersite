// usePresence.js
import { useEffect } from 'react';
import { rtdb } from './firebase';
import { ref, onDisconnect, set } from 'firebase/database';

export const useUserPresence = (userId: string | undefined) => {
  useEffect(() => {
    if (userId) {
      const userStatusDatabaseRef = ref(rtdb, `/status/${userId}`);

      const isOnline = {
        state: 'online',
        last_changed: new Date().toISOString(),
      };

      const isOffline = {
        state: 'offline',
        last_changed: new Date().toISOString(),
      };

      set(userStatusDatabaseRef, isOnline);

      onDisconnect(userStatusDatabaseRef).set(isOffline);
    }
  }, [userId]);
};
