import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import dayjs from "dayjs";

import {
  StyledHeader,
  StyledHeaderContainer,
  StyledHeaderLeft,
  StyledHeaderRight,
  StyledLogo,
  StyledNavLinks,
  StyledMenu,
  StyledMobileMenu,
} from "./Header.styles";
import Button from "../Button";
import { userStore } from "../../store/userStore";
import { auth, db } from "../../utils/firebase";
import { IUserProfileData } from "../../constants/types";
import Avatar from "../Avatar";
import Sidebar from "./Sidebar";

import logo from "../../assets/logo/logo_short.png";
import { ReactComponent as MenuIcon } from "../../assets/icons/menu.svg";
import { ReactComponent as HomeIcon } from "../../assets/icons/home.svg";
import { ReactComponent as BookSessionIcon } from "../../assets/icons/book-session.svg";
import { ReactComponent as SessionIcon } from "../../assets/icons/session.svg";
import { USER_COLLECTION_NAME } from "../../constants/data";
import { getSubscriptionDoc } from "../../services/subscriptionService";
import { getUserCancelledSessionOnCurrentMonth, updateUserDoc } from "../../services/userService";
import SubscriptionEndedModal from "../Modal/SubscriptionEndedModal";
import { generalStore } from "../../store/generalStore";
import { getCurrentWeekInfo } from "../../utils/helpers";
import {
  getUserBookedSessionDoc,
  getUserBookedSessionOnThisWeekDoc,
} from "../../services/bookSessionService";
import { reminderStore } from "../../store/reminderStore";
// import VerifyPhoneNumberModal from "../Modal/VerifyPhoneNumberModal";

const Header = ({ hide }: { hide?: boolean }) => {
  const user = userStore((state) => state.user);
  const profileData = userStore((state) => state.profileData);
  const navigate = useNavigate();
  const updateUser = userStore((state) => state.updateUser);
  const updateFetching = userStore((state) => state.updateFetching);
  const updateProfileData = userStore((state) => state.updateProfileData);
  const updateSubscriptionData = userStore((state) => state.updateSubscriptionData);
  const updateCancelledSession = userStore((state) => state.updateCancelledSession);
  const updateMissedClass = userStore((state) => state.updateMissedClass);
  const updateAllSessionFetching = userStore((state) => state.updateAllSessionFetching);
  const setOutdated = userStore((state) => state.setOutdated);
  const showHeader = generalStore((state) => state.showHeader);
  const isOutdated = userStore((state) => state.isOutdated);
  const updateOverallBookedSession = userStore((state) => state.updateOverallBookedSession);
  const subscriptionData = userStore((state) => state.subscriptionData);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const setReminder = reminderStore((state) => state.setReminder);

  const handleCheckCurrentData = useCallback(async () => {
    if (!subscriptionData) return;

    if (subscriptionData.demoClass === true) {
      const sessionInfo = await getUserBookedSessionOnThisWeekDoc(
        subscriptionData.user,
        subscriptionData.id,
        subscriptionData.startDate.toDate(),
        subscriptionData.endDate.toDate()
      );

      setReminder({
        fetching: false,
        endDate: subscriptionData.endDate.toDate(),
        session: 1 - sessionInfo,
      });

      updateAllSessionFetching(false);
      updateMissedClass(0);
      return;
    }

    const currentInfo = getCurrentWeekInfo(
      subscriptionData.startDate.toDate(),
      subscriptionData.endDate.toDate()
    );
    console.log("current", currentInfo);
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

      // if (subscriptionData?.sessionPerWeek !== lastWeekSessionInfo) {
      //   const sessionPerWeek = subscriptionData?.sessionPerWeek ?? 0;
      //   await updateMissedSessionSubscriptionDoc(
      //     subscriptionData.id,
      //     sessionPerWeek - lastWeekSessionInfo
      //   );
      // }

      const missedClass = (currentInfo.currentWeek - 1) * sessionPerWeek - lastWeekSessionInfo;

      console.log("MISSED CLASS ", missedClass);
      updateMissedClass(missedClass);
    } else {
      updateMissedClass(0);
    }

    const overallBookedSession = await getUserBookedSessionDoc(
      subscriptionData.user,
      subscriptionData.id,
      subscriptionData.startDate.toDate(),
      new Date()
    );
    updateOverallBookedSession(overallBookedSession);
    updateAllSessionFetching(false);

    console.log(
      overallBookedSession.filter((f) => f.endTime.toDate() < currentInfo.lastWeekEndDate)
    );

    const sessionPerWeek = subscriptionData?.sessionPerWeek ?? 0;
    setReminder({
      fetching: false,
      endDate: currentInfo.currentWeekEndDate,
      session: sessionPerWeek - sessionInfo,
    });
  }, [
    subscriptionData,
    setReminder,
    updateMissedClass,
    updateOverallBookedSession,
    updateAllSessionFetching,
  ]);

  useEffect(() => {
    handleCheckCurrentData();
  }, [handleCheckCurrentData]);

  const getUserData = useCallback(async (user: User) => {
    try {
      const userDocRef = doc(db, USER_COLLECTION_NAME, user.uid);
      const userSnapshot = await getDoc(userDocRef);

      setTimeout(() => {
        setOutdated();
      }, 0);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data() as IUserProfileData;
        console.log(userData);
        updateProfileData(userData);
        updateCancelledSession(await getUserCancelledSessionOnCurrentMonth(user.uid));

        if (userData.currentSubscriptionId) {
          updateSubscriptionData(await getSubscriptionDoc(userData.currentSubscriptionId));
          updateFetching(false);
        } else {
          updateFetching(false);
        }
      } else {
        navigate("/");
        const profileData = {
          completedSession: 0,
          demoClassBooked: false,
          designation: "",
          displayName: user.displayName || "",
          email: user.email || "",
          gender: "",
          goals: [],
          interests: [],
          isNewUser: false,
          issues: [],
          profileImg: "",
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
          return navigate("/verify-mail");
        }
        getUserData(data);
      } else {
        navigate("/login");
        setTimeout(() => {
          updateFetching(false);
        }, 0);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckSubsciptionData = useCallback(async () => {
    if (!subscriptionData) return;

    console.log(subscriptionData);
    const isFinished = dayjs(subscriptionData.endDate.toDate()).isBefore(dayjs());

    if (isFinished) {
      await updateUserDoc(subscriptionData.user, { currentSubscriptionId: null });
      setOutdated();
      window.location.reload();
    }

    if (
      subscriptionData["allSessionsCompleted"] &&
      subscriptionData["allSessionsCompleted"] === true
    ) {
      await updateUserDoc(subscriptionData.user, { currentSubscriptionId: null });
      setOutdated();
      // window.location.href = "/";
    }
  }, [subscriptionData, setOutdated]);

  useEffect(() => {
    handleCheckSubsciptionData();
  }, [handleCheckSubsciptionData]);

  console.log(subscriptionData);

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
              <NavLink to="/refer-and-earn">Refer</NavLink>
            </li>
            <li>
              <NavLink to="/subscribe">Subscribe</NavLink>
            </li>
            <li>
              <NavLink to="/dispute">Disputes</NavLink>
            </li>
          </StyledNavLinks>
        </StyledHeaderLeft>
        <StyledHeaderRight>
          {subscriptionData ? (
            <Link to="/book-session" className="book-session-link">
              <Button>+ Book Session</Button>
            </Link>
          ) : (
            <Button onClick={() => setOpenModal(true)}>+ Book Session</Button>
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
      {/* {user && !user?.phoneNumber && <VerifyPhoneNumberModal isOpen />} */}
    </StyledHeader>
  );
};

export default Header;
