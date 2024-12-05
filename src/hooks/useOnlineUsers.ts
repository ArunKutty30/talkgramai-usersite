import { useState, useEffect } from 'react';
import { rtdb } from '../utils/firebase';
import { ref, onValue, off } from 'firebase/database';

export type Tutor = {
  id: string;
  name: string;
  photoURL: string;
  state: string;
  last_changed: string;
  busy: boolean;
  role: string;
};

type Props = {
  role?: 'student' | 'tutor';
  loggedInUserId?: string;
};

const useOnlineUsers = ({ role, loggedInUserId }: Props) => {
  const [onlineUsers, setOnlineUsers] = useState<Tutor[]>([]);

  useEffect(() => {
    // Reference to the status node where user statuses are stored
    const statusRef = ref(rtdb, 'status');
    const onStatusChange = onValue(statusRef, (snapshot) => {
      const usersStatus = snapshot.val();
      const onlineUserList: Tutor[] = [];

      if (usersStatus) {
        Object.keys(usersStatus).forEach((userId) => {
          if (
            usersStatus[userId].state === 'online' &&
            usersStatus[userId].role === role &&
            userId !== loggedInUserId
          ) {
            onlineUserList.push(usersStatus[userId]);
          }
        });
      }

      setOnlineUsers(onlineUserList);
    });
    // Cleanup the listener when the component is unmounted
    return () => off(statusRef, 'value', onStatusChange);
  }, []);

  return onlineUsers;
};

export default useOnlineUsers;
