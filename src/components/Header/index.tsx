import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Timestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import dayjs from 'dayjs';

import {
  StyledHeader,
  StyledHeaderContainer,
  StyledHeaderLeft,
  StyledHeaderRight,
  StyledLogo,
  StyledNavLinks,
  StyledMenu,
  StyledMobileMenu,
} from './Header.styles';
import Button from '../Button';
import { userStore } from '../../store/userStore';
import { auth, db } from '../../utils/firebase';
import { IUserProfileData } from '../../constants/types';
import Avatar from '../Avatar';
import Sidebar from './Sidebar';

import logo from '../../assets/logo/logo_short.png';
import { ReactComponent as MenuIcon } from '../../assets/icons/menu.svg';
import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg';
import { ReactComponent as BookSessionIcon } from '../../assets/icons/book-session.svg';
import { ReactComponent as SessionIcon } from '../../assets/icons/session.svg';
import { USER_COLLECTION_NAME } from '../../constants/data';
import { getUserSubscriptionDoc, updateSubscriptionDoc } from '../../services/subscriptionService';
import { getUserCancelledSessionOnCurrentMonth } from '../../services/userService';
import SubscriptionEndedModal from '../Modal/SubscriptionEndedModal';
import { generalStore } from '../../store/generalStore';
import { getCurrentWeekInfo } from '../../utils/helpers';
import {
  getUserBookedSessionDoc,
  getUserBookedSessionOnThisWeekDoc,
  getUserCompletedSessionDoc,
} from '../../services/bookSessionService';
import { reminderStore } from '../../store/reminderStore';
import MenuDropdown from '../MenuDropdown';
// import VerifyPhoneNumberModal from '../Modal/VerifyPhoneNumberModal';

const Header = ({ hide }: { hide?: boolean }) => {
  const user = userStore((state) => state.user);
  const profileData = userStore((state) => state.profileData);
  const navigate = useNavigate();
  const updateUser = userStore((state) => state.updateUser);
  const updateFetching = userStore((state) => state.updateFetching);
  const updateProfileData = userStore((state) => state.updateProfileData);
  const updateSubscriptionData = userStore((state) => state.updateSubscriptionData);
  const updateCancelledSession = userStore((state) => state.updateCancelledSession);
  const updateExpiredClass = userStore((state) => state.updateExpiredClass);
  const updateMissedClass = userStore((state) => state.updateMissedClass);
  const updateSessionLeft = userStore((state) => state.updateSessionLeft);
  const updateAllSessionFetching = userStore((state) => state.updateAllSessionFetching);
  const setOutdated = userStore((state) => state.setOutdated);
  const updateSubscriptionDataOutdated = userStore((state) => state.updateSubscriptionDataOutdated);
  const isSubscriptionDataOutdated = userStore((state) => state.isSubscriptionDataOutdated);
  const showHeader = generalStore((state) => state.showHeader);
  const isOutdated = userStore((state) => state.isOutdated);
  const updateOverallBookedSession = userStore((state) => state.updateOverallBookedSession);
  const updateCurrentPlanSession = userStore((state) => state.updateCurrentPlanSession);
  const subscriptionData = userStore((state) => state.subscriptionData);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const setReminder = reminderStore((state) => state.setReminder);
  const updateSubscriptionDataFetching = userStore((store) => store.updateSubscriptionDataFetching);

  const handleCheckCurrentData = useCallback(async () => {
    if (!subscriptionData) return;

    let missedSession = 0;

    updateCancelledSession(
      await getUserCancelledSessionOnCurrentMonth(
        subscriptionData.user,
        subscriptionData.startDate.toDate()
      )
    );

    if (subscriptionData.demoClass === true) {
      const sessionInfo = await getUserBookedSessionOnThisWeekDoc(
        subscriptionData.user,
        subscriptionData.id,
        subscriptionData.startDate.toDate(),
        subscriptionData.endDate.toDate()
      );

      if (sessionInfo.some((s) => s.status === 'COMPLETED')) {
        console.log('DEMO CLASS FINISHED');
        await updateSubscriptionDoc(subscriptionData.id, { subscriptionStatus: 'EXPIRED' });
        updateSubscriptionData(null);
        updateSubscriptionDataFetching('SUCCESS');
      }

      setReminder({
        fetching: false,
        endDate: subscriptionData.endDate.toDate(),
        session: 1 - sessionInfo.length,
        isLastWeek: true,
      });

      updateAllSessionFetching(false);
      updateExpiredClass(0);
      updateSubscriptionDataFetching('SUCCESS');
      return;
    }

    const currentInfo = getCurrentWeekInfo(
      subscriptionData.startDate.toDate(),
      subscriptionData.endDate.toDate()
    );
    // console.log('current', currentInfo);
    const sessionInfo = await getUserBookedSessionOnThisWeekDoc(
      subscriptionData.user,
      subscriptionData.id,
      currentInfo.currentWeekStartDate,
      currentInfo.currentWeekEndDate
    );

    if (currentInfo.currentWeek > 1) {
      const lastWeekSessionInfo = await getUserBookedSessionOnThisWeekDoc(
        subscriptionData.user,
        subscriptionData.id,
        subscriptionData.startDate.toDate(),
        currentInfo.lastWeekEndDate
      );

      const sessionPerWeek = subscriptionData?.sessionPerWeek ?? 0;

      missedSession = (currentInfo.currentWeek - 1) * sessionPerWeek - lastWeekSessionInfo.length;

      // console.log('MISSED CLASS ', missedSession);
      const sessionLeft =
        (subscriptionData?.noOfSession || 0) -
        ((subscriptionData?.bookedSession || 0) + missedSession);

      updateExpiredClass(missedSession);
      updateSessionLeft(sessionLeft);
    } else {
      const sessionLeft =
        (subscriptionData?.noOfSession || 0) - (subscriptionData?.bookedSession || 0);
      updateSessionLeft(sessionLeft);
      updateExpiredClass(0);
    }

    const currentPlanSession = await getUserBookedSessionDoc(
      subscriptionData.user,
      subscriptionData.id,
      subscriptionData.startDate.toDate(),
      new Date()
    );
    updateCurrentPlanSession(currentPlanSession);
    updateAllSessionFetching(false);

    updateMissedClass(currentPlanSession.filter((f) => f.status === 'MISSED').length);

    const sessionPerWeek = subscriptionData?.sessionPerWeek ?? 0;
    setReminder({
      fetching: false,
      endDate: currentInfo.currentWeekEndDate,
      session: sessionPerWeek - sessionInfo.length,
      isLastWeek: currentInfo.totalWeeks === currentInfo.currentWeek,
    });

    const bookedSession = subscriptionData.bookedSession || 0;
    const backlogSession = subscriptionData.backlogSession || 0;

    if (bookedSession + missedSession === subscriptionData.noOfSession && backlogSession === 0) {
      console.log('UNSUBSCRIBE');
      const isCompleted = currentPlanSession.some(
        (s) => Boolean(s.isLastSession) && s.status === 'COMPLETED'
      );
      if (isCompleted) {
        console.log('UNSUBSCRIBE THIS USER');
        await updateSubscriptionDoc(subscriptionData.id, { subscriptionStatus: 'EXPIRED' });
        updateSubscriptionData(null);
        updateSubscriptionDataFetching('SUCCESS');
        return;
      }
    }

    updateSubscriptionDataFetching('SUCCESS');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    subscriptionData,
    setReminder,
    updateExpiredClass,
    updateAllSessionFetching,
    updateMissedClass,
    updateCurrentPlanSession,
    updateCancelledSession,
    updateSessionLeft,
    updateSubscriptionDataFetching,
  ]);

  useEffect(() => {
    const updateData = async () => {
      console.log('CALLED');
      try {
        if (user) {
          const tempSubscriptionData = await getUserSubscriptionDoc(user.uid);
          updateSubscriptionData(tempSubscriptionData);
          updateSubscriptionDataOutdated(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (isSubscriptionDataOutdated) {
      console.log('SUBSCRIPTION DATA OUTDATED');
      updateData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubscriptionDataOutdated]);

  const handleGetOverallSessionData = useCallback(async () => {
    try {
      if (!user) return;

      const overallBookedSession = await getUserCompletedSessionDoc(user.uid, new Date());
      updateOverallBookedSession(overallBookedSession);
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleGetSubscriptionData = useCallback(async (user: User) => {
    if (!user) return;

    try {
      updateSubscriptionDataFetching('PENDING');
      const tempSubscriptionData = await getUserSubscriptionDoc(user.uid);

      if (tempSubscriptionData) {
        const isFinished = dayjs(tempSubscriptionData.endDate.toDate()).isBefore(dayjs());

        if (isFinished) {
          await updateSubscriptionDoc(tempSubscriptionData.id, { subscriptionStatus: 'EXPIRED' });
          updateSubscriptionData(null);
          updateSubscriptionDataFetching('SUCCESS');
        } else {
          updateSubscriptionData(tempSubscriptionData);
        }
      } else {
        updateSubscriptionData(null);
        updateSubscriptionDataFetching('SUCCESS');
      }
    } catch (error) {
      console.log(error);
      updateSubscriptionDataFetching('ERROR');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleCheckCurrentData();
    handleGetOverallSessionData();
  }, [handleCheckCurrentData, handleGetOverallSessionData]);

  const getUserData = useCallback(async (user: User) => {
    try {
      const userDocRef = doc(db, USER_COLLECTION_NAME, user.uid);
      const userSnapshot = await getDoc(userDocRef);

      setTimeout(() => {
        setOutdated();
      }, 0);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as IUserProfileData;
        updateProfileData(userData);
        updateFetching(false);
      } else {
        navigate('/');
        const profileData = {
          completedSession: 0,
          demoClassBooked: false,
          designation: '',
          displayName: user.displayName || '',
          email: user.email || '',
          gender: '',
          goals: [],
          interests: [],
          isNewUser: false,
          issues: [],
          profileImg: '',
          updatedAt: Timestamp.now(),
        };
        updateProfileData(profileData);
        const docId = doc(db, USER_COLLECTION_NAME, user.uid);
        await setDoc(docId, profileData);
        // navigate("/onboarding");
        updateFetching(false);
      }
    } catch (error) {
      console.log(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOutdated && user) {
      getUserData(user);
    }
  }, [isOutdated, user, getUserData]);

  useEffect(() => {
    return onAuthStateChanged(auth, (data) => {
      if (data) {
        updateUser(data);
        console.log(data);
        if (!data.emailVerified) {
          setTimeout(() => {
            updateFetching(false);
          }, 0);
          return navigate('/verify-mail');
        }
        getUserData(data);
        handleGetSubscriptionData(data);
      } else {
        navigate('/login');
        setTimeout(() => {
          updateFetching(false);
        }, 0);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!showHeader) return null;
  if (hide) return null;

  return (
    <StyledHeader>
      {/* <div
        style={{
          position: "fixed",
          width: "100%",
          top: "0",
          padding: "0.2em",
          zIndex: "100",
          textAlign: "center",
          backgroundColor: "#fff",
          fontWeight: "bold",
        }}
      >
        HEY , THIS APP IS NOW ON BETA VERSION !
      </div> */}
      <StyledHeaderContainer>
        <StyledHeaderLeft>
          <StyledLogo>
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </StyledLogo>
          <StyledNavLinks>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/book-session">Book Session</NavLink>
            </li>
            <li>
              <NavLink to="/sessions">Sessions</NavLink>
            </li>
            <li>
              <NavLink to="/subscribe">Subscribe</NavLink>
            </li>
            <li>
              <NavLink to="/ai-services">AI Services</NavLink>
            </li>
            <li>
              <NavLink to="/feedback-analysis">Feedback analysis</NavLink>
            </li>
            <MenuDropdown />
          </StyledNavLinks>
        </StyledHeaderLeft>
        <StyledHeaderRight>
          {subscriptionData ? (
            <Link to="/book-session" className="book-session-link">
              <Button>+ Book Session</Button>
            </Link>
          ) : (
            <Link to="/" className="book-session-link" onClick={(e) => e.preventDefault()}>
              <Button onClick={() => setOpenModal(true)}>+ Book Session</Button>
            </Link>
          )}
          {/* <h5>{user && user.displayName}</h5> */}
          <Link to="/profile">
            {user && (
              <Avatar
                profileImg={profileData?.profileImg}
                username={user?.displayName || user?.email}
              />
            )}
          </Link>
          <StyledMenu role="button" onClick={() => setOpenSidebar(true)}>
            <MenuIcon />
          </StyledMenu>
        </StyledHeaderRight>
      </StyledHeaderContainer>
      <Sidebar openSidebar={openSidebar} handleClose={() => setOpenSidebar(false)} />
      <StyledMobileMenu>
        <div>
          <NavLink to="/">
            <HomeIcon />
          </NavLink>
          <NavLink to="/book-session">
            <BookSessionIcon />
          </NavLink>
          <NavLink to="/sessions">
            <SessionIcon />
          </NavLink>
        </div>
      </StyledMobileMenu>
      {openModal && (
        <SubscriptionEndedModal isOpen={openModal} handleClose={() => setOpenModal(false)} />
      )}
      {/* {profileData && !profileData?.phoneNumberVerified && <VerifyPhoneNumberModal isOpen />} */}
    </StyledHeader>
  );
};

export default Header;
