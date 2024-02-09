import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import ReactCountdown, { CountdownRenderProps } from "react-countdown";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import SectionHeader from "../SectionHeader";
import Button from "../Button";
import NoSessionIllustration from "../../assets/images/no_sessions.svg";
import { userStore } from "../../store/userStore";
import { BOOKINGS_COLLECTION_NAME } from "../../constants/data";
import { db } from "../../utils/firebase";
import { EBookingStatus, IBookingSession } from "../../constants/types";
import { reminderStore } from "../../store/reminderStore";
import { addPrefixZero } from "../../utils/helpers";
import DashboardSessionCard from "../SessionCards/DashboardSessionCard";
import UserSessionStats from "../UserSessionStats";

dayjs.extend(relativeTime);

const SessionReminder = () => {
  const fetching = reminderStore((store) => store.fetching);
  const endDate = reminderStore((store) => store.endDate);
  const session = reminderStore((store) => store.session);
  const remainingSession = reminderStore((store) => store.session);
  const subscriptionData = userStore((store) => store.subscriptionData);

  const renderer = ({ completed, hours, minutes, seconds, days }: CountdownRenderProps) => {
    if (completed) {
      return null;
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            gap: "15px",
          }}
        >
          <p style={{ color: "#646464" }}>Your remaining</p>
          <h1>
            {remainingSession} Session{remainingSession > 1 ? "s" : ""}
          </h1>
          <div>
            {/* <BellIcon width={14} height={14} /> */}
            <p>
              {/* Your {session} session{session > 1 ? "s" : ""} for this week ends in{" "} */}
              ends in{" "}
              <b style={{ display: "inline-block", minWidth: "67px" }}>
                {addPrefixZero(days)}D : {addPrefixZero(hours)}H : {addPrefixZero(minutes)}M :{" "}
                {addPrefixZero(seconds)}S
              </b>{" "}
              !!
            </p>
          </div>
        </Box>
      );
    }
  };

  const nextWeekRenderer = ({ completed, hours, minutes, seconds, days }: CountdownRenderProps) => {
    if (completed) {
      return null;
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "start",
            gap: "15px",
          }}
        >
          <p style={{ color: "#646464" }}>Your next</p>
          <h1>{subscriptionData?.sessionPerWeek} Sessions</h1>
          <div>
            {/* <BellIcon width={14} height={14} /> */}
            <p>
              {/* Your next week session booking starts in{" "} */}
              starts in{" "}
              <b style={{ display: "inline-block", minWidth: "67px" }}>
                {addPrefixZero(days)}D : {addPrefixZero(hours)}H : {addPrefixZero(minutes)}M :{" "}
                {addPrefixZero(seconds)}S
              </b>
            </p>
          </div>
        </Box>
      );
    }
  };

  if (fetching) return null;

  if (session <= 0)
    return (
      <StyledTimeReminder>
        <ReactCountdown date={endDate} renderer={nextWeekRenderer} />
      </StyledTimeReminder>
    );

  return (
    <StyledTimeReminder>
      <ReactCountdown date={endDate} renderer={renderer} />
    </StyledTimeReminder>
  );
};

const SubscribedUserSession: React.FC = () => {
  const user = userStore((store) => store.user);
  const [sessions, setSessions] = useState<IBookingSession[]>([]);
  const [previousSessions, setPreviousSessionss] = useState<IBookingSession[]>([]);
  const subscriptionData = userStore((store) => store.subscriptionData);
  const [showPopup, setShowPopup] = useState(false);
  const expiredClass = userStore((state) => state.expiredClass);
  const missedClass = userStore((state) => state.missedClass);
  const overallBookedSession = userStore((state) => state.overallBookedSession);

  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
    const q = query(
      colRef,
      where("user", "==", user.uid),
      where("status", "==", "UPCOMING"),
      where("endTime", ">=", new Date()),
      orderBy("endTime", "asc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const slots: any[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          slots.push({
            id: doc.id,
            ...data,
            startTime: data.startTime.toDate(),
            endTime: data.endTime.toDate(),
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          });
        });
        setSessions(slots);
      },
      (error) => {
        console.error("Error fetching upcoming sessions:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
    const q = query(
      colRef,
      where("user", "==", user.uid),
      where("endTime", "<", new Date()),
      where("status", "in", [EBookingStatus.UPCOMING, EBookingStatus.COMPLETED]),
      orderBy("endTime", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const slots: any[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status !== "MISSED") {
            slots.push({
              id: doc.id,
              ...data,
              startTime: data.startTime.toDate(),
              endTime: data.endTime.toDate(),
              createdAt: data.createdAt.toDate(),
              updatedAt: data.updatedAt.toDate(),
            });
          }
        });
        setPreviousSessionss(slots);
      },
      (error) => {
        console.error("Error fetching upcoming sessions:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      <div className="pad">
        <SectionHeader
          title={`Howdy ${user && user.displayName}!`}
          description="Here’s everything at once. Let today be the reason you look back and smile on tomorrow."
          isPopupOpen={showPopup}
          handlePopup={handlePopup}
        />

        <UserSessionStats overallBookedSession={overallBookedSession} />

        <StyledGridContainer>
          <StyledUpComingSessionContainer>
            <div className="flex-between mb-20">
              <h5 className="section-title">Upcoming Sessions</h5>
            </div>
            {sessions.length ? (
              sessions.map((sessionDetails) => (
                <div key={sessionDetails.id} className="section-hold">
                  <DashboardSessionCard type="upcoming" {...sessionDetails} />
                </div>
              ))
            ) : (
              <StyledNoSession>
                <img src={NoSessionIllustration} alt="no session illustration" />
                <p>You do not have any Upcoming Sessions</p>
              </StyledNoSession>
            )}
          </StyledUpComingSessionContainer>
          <StyledPreviousSessionContainer>
            <div className="flex-between" style={{ marginBottom: "24px" }}>
              <h5 className="section-title">Previous Sessions</h5>
            </div>
            <div className="section-hold-shadow"></div>
            {previousSessions.length ? (
              previousSessions.map((sessionDetails) => (
                <div key={sessionDetails.id} className="section-hold">
                  <DashboardSessionCard type="previous" {...sessionDetails} />
                </div>
              ))
            ) : (
              <StyledNoSession>
                <img src={NoSessionIllustration} alt="no session illustration" />
                <p>You do not have any Previous Sessions</p>
              </StyledNoSession>
            )}
          </StyledPreviousSessionContainer>
        </StyledGridContainer>
        <StyledCurrentPlan>
          <Box className="current-plan-sec-1">
            <SessionReminder />
            <Box
              className="book-session-one"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <Link to="/book-session">
                <Button>+ Book Session</Button>
              </Link>
            </Box>
          </Box>

          <Box className="sec-last-card-hold">
            <CurrentPlanCards title="Total Sessions" count={subscriptionData?.noOfSession || 0} />
            <CurrentPlanCards
              title="Sessions Left"
              count={
                (subscriptionData?.noOfSession || 0) -
                ((subscriptionData?.bookedSession || 0) + (expiredClass || 0))
              }
            />
            <CurrentPlanCards
              title="Backlog Sessions"
              count={subscriptionData?.backlogSession || 0}
            />
            <CurrentPlanCards
              title="Cancelled Sessions"
              count={subscriptionData?.cancelledSession || 0}
            />
            <CurrentPlanCards title="Missed Session" count={missedClass || 0} />
            <CurrentPlanCards title="Expired Session" count={expiredClass || 0} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              height: "2rem",
            }}
            className="book-session-two"
          >
            <Link to="/book-session">
              <Button style={{ whiteSpace: "nowrap", width: "100%" }}>+ Book Session</Button>
            </Link>
          </Box>
        </StyledCurrentPlan>
      </div>
    </>
  );
};

const CurrentPlanCards = ({ title, count }: { title: string; count: number }) => {
  return (
    <Box
      sx={{
        background: "white",
        padding: "1rem",
        borderRadius: "12px",
        border: "1px solid #E3E3E380",
        boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.02)",
        minWidth: "10rem",
        fontSize: "0.7rem",
      }}
    >
      <p style={{ fontSize: "13px" }}>{title}</p>
      <h1 style={{ padding: "0.5rem 0 0 0" }}>{count}</h1>
    </Box>
  );
};

// 767 1023

const StyledCurrentPlan = styled.section`
  border-radius: 12px;
  width: 100%;
  border: 1px solid #cecece40;
  background: #d9d9d91c;
  padding: 25px;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 3fr 4fr 2fr;
  justify-content: space-between;
  align-items: center;

  .book-session-one {
    display: none;
  }

  .current-plan-sec-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
  }

  .sec-last-card-hold {
    display: grid;
    grid-template-columns: repeat(4, 10rem);
    justify-content: start;
    align-items: flex-start;
    gap: 15px;
  }

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    justify-content: start;
    align-items: start;
    gap: 20px;

    .book-session-one {
      display: flex;
      justify-content: end;
    }

    .book-session-two {
      display: none;
    }
  }

  @media (max-width: 820px) {
    .sec-last-card-hold {
      grid-template-columns: repeat(2, 15rem);
      justify-content: start;
    }

    .book-session-one {
      display: none;
    }

    .book-session-two {
      margin: 1rem 0;
      display: flex;
      justify-content: start;
    }
  }

  @media (max-width: 620px) {
    .sec-last-card-hold {
      grid-template-columns: repeat(2, 10rem);
      justify-content: start;
    }
  }

  @media (max-width: 400px) {
    .sec-last-card-hold {
      grid-template-columns: repeat(2, 9rem);
      font-size: 70%;
      gap: 5px;
      justify-content: start;
    }
  }
`;

const StyledUpComingSessionContainer = styled.section`
  border-radius: 12px;
  border: 1px solid #cecece40;
  background: #d9d9d91c;
  padding: 25px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  position: relative;

  @media (max-width: 600px) {
    padding: 15px;
  }

  .section-hold-shadow {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    background: linear-gradient(274deg, #eeeeee 0%, rgba(251, 251, 251, 0) 100%);
    border-radius: 11px;
  }

  .section-title {
    font-weight: 500;
  }

  .section-hold {
    display: grid;
    grid-template-columns: 1fr;
    // justify-content: start;
    // align-items: start;
    // gap: 15px;
    // overflow: auto hidden;
  }
`;

const StyledPreviousSessionContainer = styled.section`
  border-radius: 12px;
  border: 1px solid #cecece40;
  background: #d9d9d91c;
  padding: 25px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  position: relative;

  @media (max-width: 600px) {
    padding: 15px;
  }

  .section-hold-shadow {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    background: linear-gradient(274deg, #eeeeee 0%, rgba(251, 251, 251, 0) 100%);
    border-radius: 11px;
  }

  .section-title {
    font-weight: 500;
  }

  .section-hold {
    display: grid;
    grid-template-columns: 1fr;
    // display: flex;
    // justify-content: start;
    // align-items: start;
    // gap: 15px;
    // overflow: auto hidden;
  }
`;
const StyledGridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding-bottom: 10px;

  @media (max-width: 968px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const StyledNoSession = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  max-width: 300px;
  width: 100%;
  margin: 0 auto;
  padding: 10px 0;

  img {
    width: 75%;
  }
`;

const StyledTimeReminder = styled.div`
  margin-bottom: 20px;

  > div {
    border-radius: 8px;
    // border: 1px solid #eae8e5;
    // background: rgba(78, 126, 0, 0.2);
    // box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    width: fit-content;
    display: flex;
    gap: 10px;

    p {
      color: var(--black, #ff1a1a);
      font-family: "Inter";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      b {
        text-transform: lowercase;
      }
    }
  }
`;

export default SubscribedUserSession;
