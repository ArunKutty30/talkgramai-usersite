import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import ReactCountdown, { CountdownRenderProps } from "react-countdown";

import SectionHeader from "../SectionHeader";
import StickyNotesCard from "../StickyNotesCard";

import Button from "../Button";
import NoSessionIllustration from "../../assets/images/no_sessions.svg";
import illustration1 from "../../assets/images/book_another_session.png";
import { userStore } from "../../store/userStore";
import { IBookingSession } from "../../constants/types";
import { db } from "../../utils/firebase";
import { BOOKINGS_COLLECTION_NAME } from "../../constants/data";
import BaseModal from "../Modal/BaseModal";
import { reminderStore } from "../../store/reminderStore";
import { ReactComponent as BellIcon } from "../../assets/icons/bell-alert.svg";
import { addPrefixZero } from "../../utils/helpers";
import DashboardSessionCard from "../SessionCards/DashboardSessionCard";

const SessionReminder = () => {
  const fetching = reminderStore((store) => store.fetching);
  const endDate = reminderStore((store) => store.endDate);
  const session = reminderStore((store) => store.session);

  const renderer = ({ completed, hours, minutes, seconds, days }: CountdownRenderProps) => {
    if (completed) {
      return null;
    } else {
      return (
        <div>
          <BellIcon width={14} height={14} />
          <p>
            Your {session} session{session > 1 ? "s" : ""} for this week ends in{" "}
            <b style={{ display: "inline-block", minWidth: "67px" }}>
              {addPrefixZero(days)}d : {addPrefixZero(hours)}h : {addPrefixZero(minutes)}m :{" "}
              {addPrefixZero(seconds)}s
            </b>{" "}
            hours !!
          </p>
        </div>
      );
    }
  };

  if (fetching) return null;

  if (session <= 0) return null;

  return (
    <StyledTimeReminder>
      <ReactCountdown date={endDate} renderer={renderer} />
    </StyledTimeReminder>
  );
};

const UnsubscribedUserBookedSession = () => {
  const [openModal, setOpenModal] = useState(false);
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const subscriptionData = userStore((store) => store.subscriptionData);
  const [sessions, setSessions] = useState<IBookingSession[]>([]);

  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
    const q = query(
      colRef,
      where("user", "==", user.uid),
      where("endTime", ">=", new Date()),
      where("status", "==", "UPCOMING"),
      orderBy("endTime", "asc")
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
        setSessions(slots.slice(0, 1));
      },
      (error) => {
        console.error("Error fetching upcoming sessions:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <>
      <div className="pad">
        <SectionHeader
          title={`Welcome ${profileData?.displayName}!`}
          description="Daily practice gradually leads to the mastery of fluency, step by step. "
        />
        <SessionReminder />

        <StyledGridContainer>
          <StyledGridOne>
            <StyledUpComingSessionContainer>
              <div className="flex-between mb-20">
                <h5 className="section-title">Your Upcoming Sessions</h5>
                <StyledViewAllLink to="/sessions">View all</StyledViewAllLink>
              </div>
              {!sessions.length ? (
                <StyledNoSession>
                  <img src={NoSessionIllustration} alt="no session illustration" />
                  <p>You do not have any upcoming sessions</p>
                  {subscriptionData ? (
                    <Link to="/book-session">
                      <Button>+ Book Session</Button>
                    </Link>
                  ) : (
                    <Button onClick={() => setOpenModal(true)}>+ Book Session</Button>
                  )}
                </StyledNoSession>
              ) : (
                sessions.map((sessionDetails) => (
                  // <SessionCard key={sessionDetails.id} type="upcoming" {...sessionDetails} />
                  <DashboardSessionCard
                    key={sessionDetails.id}
                    type="upcoming"
                    {...sessionDetails}
                  />
                ))
              )}
            </StyledUpComingSessionContainer>
            {/* <StyledPreviousSessionContainer>
              <div className="flex-between">
                <h5 className="section-title">Your Previous Sessions</h5>
                <StyledViewAllLink to="/sessions">View all</StyledViewAllLink>
              </div>
              <StyledNoSession>
                <img src={NoSessionIllustration} alt="no session illustration" />
                <p>You do not have any Previous Sessions</p>
                <Link to="/book-session">
                  <Button>+ Book Session</Button>
                </Link>
              </StyledNoSession>
            </StyledPreviousSessionContainer> */}
          </StyledGridOne>
          <StyledGridTwo>
            <StickyNotesCard
              title="Know our Subscription Plans"
              description="Elevate your skills by choosing the perfect plan that aligns with your needs today!"
              image={illustration1}
              backgroundColor="#FDB3B3"
            />
            <StickyNotesCard
              title="Need help?"
              description="For assistance or inquiries, we're here to help—your language learning journey is our priority."
              image={illustration1}
              backgroundColor="#FEE5C7"
            />
            <StickyNotesCard
              title="Refer a Friend"
              description="Invite Friends to Talkgram and Expand Your Learning Circle!"
              image={illustration1}
              backgroundColor="#D3ECD3"
            />
          </StyledGridTwo>
        </StyledGridContainer>
      </div>
      {openModal && (
        <BaseModal isOpen={openModal} handleClose={() => setOpenModal(false)}>
          <StyledModalDiv>
            <p>
              Oops! Looks like you have not subscribed to a plan yet. Explore our subscription plans
              and get started.
            </p>
            <Link to="/subscribe">
              <Button>Subscribe</Button>
            </Link>
          </StyledModalDiv>
        </BaseModal>
      )}
    </>
  );
};

const StyledUpComingSessionContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

// const StyledPreviousSessionContainer = styled.section`
//   display: flex;
//   flex-direction: column;
//   margin-bottom: 30px;
// `;

const StyledGridContainer = styled.div`
  display: grid;
  grid-template-columns: auto 400px;
  gap: 80px;
  padding: 0 0 30px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const StyledGridOne = styled.div`
  .section-title {
    font-size: 18px;
  }
`;

const StyledGridTwo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 400px;
  width: 100%;

  @media (max-width: 968px) {
    margin: 0 auto;
  }
`;

const StyledNoSession = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 300px;
  width: 100%;
  margin: 0 auto;
  padding: 50px 0;
`;

const StyledViewAllLink = styled(Link)`
  color: var(--primary-1, #f7941f);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const StyledModalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  gap: 24px;
  padding: 30px;

  p {
    font-size: 18px;
    line-height: 1.2;
  }
`;

const StyledTimeReminder = styled.div`
  margin-bottom: 20px;

  > div {
    border-radius: 8px;
    border: 1px solid #eae8e5;
    background: rgba(78, 126, 0, 0.2);
    box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    width: fit-content;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;

    p {
      color: var(--text-primary);
      font-family: "Inter";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
`;

export default UnsubscribedUserBookedSession;
