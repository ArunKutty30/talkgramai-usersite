import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_COLLECTION_NAME } from '../../constants/data';

import { userStore } from '../../store/userStore';
import { generalStore } from '../../store/generalStore';
import { auth, db } from '../../utils/firebase';

const Auth = () => {
  const navigate = useNavigate();
  const updateUser = userStore((state) => state.updateUser);
  const updateFetching = userStore((state) => state.updateFetching);
  const isSignup = generalStore((state) => state.isSignup);

  const getUserData = useCallback(async (user: User) => {
    try {
      const userDocRef = doc(db, USER_COLLECTION_NAME, user.uid);
      const userSnapshot = await getDoc(userDocRef);

      setTimeout(() => {
        updateFetching(false);
      }, 0);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log(userData);
        navigate('/');
      } else {
        // navigate("/onboarding");
        navigate('/');
      }
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (data) => {
      console.log(data);
      if (data) {
        // if (!data.emailVerified) {
        //   setTimeout(() => {
        //     updateFetching(false);
        //   }, 0);
        //   return navigate('/verify-mail');
        // }
        updateUser(data);
        getUserData(data);
        // setTimeout(() => {
        //   updateFetching(false);
        // }, 0);
      } else {
        setTimeout(() => {
          updateFetching(false);
        }, 0);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignup]);

  return null;
};

export default Auth;
