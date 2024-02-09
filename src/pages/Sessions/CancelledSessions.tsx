import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

import { BOOKINGS_COLLECTION_NAME } from "../../constants/data";
import { EBookingStatus, IBookingSession } from "../../constants/types";
import { userStore } from "../../store/userStore";
import { db } from "../../utils/firebase";
import NoSession from "../../components/NoSession";
import SessionCardLoader from "../../components/Loader/SessionCardLoader";
import DashboardSessionCard from "../../components/SessionCards/DashboardSessionCard";

const CancelledSession = () => {
  const user = userStore((store) => store.user);
  const [sessions, setSessions] = useState<IBookingSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const colRef = collection(db, BOOKINGS_COLLECTION_NAME);
    const q = query(
      colRef,
      where("user", "==", user.uid),
      where("status", "in", [EBookingStatus.TUTOR_CANCELLED, EBookingStatus.USER_CANCELLED]),
      orderBy("endTime", "desc")
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
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching upcoming sessions:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  if (loading)
    return (
      <StyledCancelledSessionWrapper style={{ gap: 10 }}>
        <SessionCardLoader count={3} />
      </StyledCancelledSessionWrapper>
    );

  if (!sessions.length) {
    return <NoSession message="You do not have any Missed Sessions" />;
  }

  return (
    <StyledCancelledSessionWrapper>
      {sessions.map((sessionDetails) => (
        <DashboardSessionCard key={sessionDetails.id} type="previous" {...sessionDetails} />
      ))}
    </StyledCancelledSessionWrapper>
  );
};

const StyledCancelledSessionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  max-width: 900px;
  width: 100%;
  min-height: 70vh;

  > div {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export default CancelledSession;