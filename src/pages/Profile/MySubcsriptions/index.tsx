import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

import SubscriptionCard from "../../../components/MySubscriptionCard";
import { userStore } from "../../../store/userStore";
import { SUBSCRIPTION_COLLECTION_NAME } from "../../../constants/data";
import { ITransactionDB } from "../../../constants/types";
import { db } from "../../../utils/firebase";
import SessionCardLoader from "../../../components/Loader/SessionCardLoader";
import SubscriptionData from "./SubscriptionData";

const MySubscriptions = () => {
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const [transactionData, setTransactionData] = useState<ITransactionDB[]>([]);
  const [selectedData, setSelectedData] = useState<ITransactionDB | null>(null);
  const [loading, setLoading] = useState(true);
  const overallBookedSession = userStore((store) => store.overallBookedSession);

  const handleGetData = useCallback(async () => {
    if (!user) return;
    const colRef = collection(db, SUBSCRIPTION_COLLECTION_NAME);
    const q = query(
      colRef,
      where("user", "==", user.uid),
      where("status", "==", "COMPLETED"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const slots: ITransactionDB[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<ITransactionDB, "id">;
          slots.push({
            id: doc.id,
            ...data,
          });
        });
        setTransactionData(slots);
        if (slots.length) {
          setSelectedData(slots[0]);
        }
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

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const pastSubscriptions = transactionData.filter(
    (f) => f.id !== profileData?.currentSubscriptionId
  );

  const presentData = transactionData.filter((f) => f.id === profileData?.currentSubscriptionId);

  const sessionInfo = useMemo(() => {
    if (!selectedData) return null;

    const selectedPlanSessions = overallBookedSession.filter(
      (f) => f.subscriptionId === selectedData.id
    );

    return {
      ...selectedData,
      completedSession: selectedPlanSessions.filter((f) => f.status === "COMPLETED").length,
    };
  }, [selectedData, overallBookedSession]);

  if (loading) {
    return (
      <StyledSubscriptionsWrappper>
        <SessionCardLoader count={2} />
      </StyledSubscriptionsWrappper>
    );
  }

  return (
    <StyledContainer>
      <div>
        <StyledSubscriptions>
          <h5>Present Subscriptions</h5>
          <StyledSubscriptionsWrappper>
            {presentData.map((m) => (
              <div key={m.id} onClick={() => setSelectedData(m)}>
                <SubscriptionCard key={m.id} isFinished={false} {...m} />
              </div>
            ))}
          </StyledSubscriptionsWrappper>
        </StyledSubscriptions>
        {pastSubscriptions.length ? (
          <StyledSubscriptions>
            <h5>Past Subscriptions</h5>
            <StyledSubscriptionsWrappper>
              {pastSubscriptions.map((m) => (
                <div key={m.id} onClick={() => setSelectedData(m)}>
                  <SubscriptionCard isFinished {...m} />
                </div>
              ))}
            </StyledSubscriptionsWrappper>
          </StyledSubscriptions>
        ) : null}
      </div>
      {sessionInfo && <SubscriptionData {...sessionInfo} />}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 80px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const StyledSubscriptions = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;

  > h5 {
    margin-bottom: 24px;
    color: var(--text-primary);
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const StyledSubscriptionsWrappper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 530px;
  width: 100%;
`;

export default MySubscriptions;
