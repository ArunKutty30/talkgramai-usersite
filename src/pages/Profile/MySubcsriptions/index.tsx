import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

import sandclock from "../../../assets/icons/sandclock.png";
import rocket from "../../../assets/icons/rocket.png";
import checked from "../../../assets/icons/checked.png";
import SubscriptionCard from "../../../components/MySubscriptionCard";
import { userStore } from "../../../store/userStore";
import { SUBSCRIPTION_COLLECTION_NAME } from "../../../constants/data";
import { ITransactionDB } from "../../../constants/types";
import { db } from "../../../utils/firebase";
import SessionCardLoader from "../../../components/Loader/SessionCardLoader";
import { customFormat } from "../../../constants/formatDate";

interface ISubscriptionStatsProps {
  icon: string;
  title: string;
  count: number;
}

const Stats: React.FC<ISubscriptionStatsProps> = ({ icon, title, count }) => {
  return (
    <StyledStatsCard>
      <div className="icon">
        <img src={icon} alt="" />
      </div>
      <div className="flex-column">
        <p>{title}</p>
        <h4>{count}</h4>
      </div>
    </StyledStatsCard>
  );
};

const MySubscriptions = () => {
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const [transactionData, setTransactionData] = useState<ITransactionDB[]>([]);
  const [loading, setLoading] = useState(true);

  const handleGetData = useCallback(async () => {
    if (!user) return;
    const colRef = collection(db, SUBSCRIPTION_COLLECTION_NAME);
    const q = query(colRef, where("user", "==", user.uid), orderBy("createdAt", "desc"));

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
              <SubscriptionCard key={m.id} isFinished={false} {...m} />
            ))}
          </StyledSubscriptionsWrappper>
        </StyledSubscriptions>
        {pastSubscriptions.length ? (
          <StyledSubscriptions>
            <h5>Past Subscriptions</h5>
            <StyledSubscriptionsWrappper>
              {pastSubscriptions.map((m) => (
                <SubscriptionCard key={m.id} isFinished {...m} />
              ))}
            </StyledSubscriptionsWrappper>
          </StyledSubscriptions>
        ) : null}
      </div>
      {presentData.map((m) => (
        <StyledSelectedSubscription key={m.id}>
          <StyledSelectedSubscriptionCard>
            <p className="text-primary">Subscription Summary</p>

            <div className="grid">
              <p>
                <b>{m.plan}</b>
              </p>
              <p>
                {m.demoClass ? (
                  <>
                    <b>Rs {m.totalPrice}</b>
                  </>
                ) : (
                  <>
                    <b>Rs {m.totalPrice}</b>/mo
                  </>
                )}
              </p>
            </div>
            <div className="grid">
              <p>
                No. of Sessions : <span>{m.noOfSession}</span>
              </p>
              <p>
                Subscription Duration : <span>{m.plan}</span>
              </p>
            </div>
            <div className="grid">
              <p>
                Start Date : <span>{customFormat(m.startDate.toDate(), "DD/MM/YYYY")}</span>
              </p>
              <p>
                Number of Sessions per Week: <span>{m.sessionPerWeek}</span>
              </p>
            </div>
            <div className="grid">
              <p>
                End Date : <span>{customFormat(m.endDate.toDate(), "DD/MM/YYYY")}</span>
              </p>
              <p>
                Session Duration: <span>30 Minutes</span>
              </p>
            </div>
          </StyledSelectedSubscriptionCard>
          <StyledSelectedSubscriptionStats>
            <Stats
              icon={checked}
              title="Remaining Classes"
              count={m.completedSession ? m.noOfSession - m.completedSession : m.noOfSession}
            />
            <Stats
              icon={rocket}
              title="Completed Classes"
              count={m.completedSession ? m.completedSession : 0}
            />
            <Stats
              icon={sandclock}
              title="Missed Classes"
              count={m.missedSession ? m.missedSession : 0}
            />
          </StyledSelectedSubscriptionStats>
        </StyledSelectedSubscription>
      ))}
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

const StyledSelectedSubscription = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledSelectedSubscriptionCard = styled.div`
  padding: 25px;
  border-radius: 25px;
  border: 2px solid var(--gray-1, #ecf0ef);
  margin-bottom: 30px;

  .text-primary {
    color: var(--primary-1, #f7941f);
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 25px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 10px;

    p {
      color: var(--gray-3);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      b {
        color: var(--text-primary);
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }

    span {
      color: var(--gray-2, #62635e);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;

const StyledSelectedSubscriptionStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
`;

const StyledStatsCard = styled.div`
  border-radius: 8px;
  border: 1px solid #ede7df;
  background: var(--white, #fff);
  padding: 20px;
  min-width: 250px;
  display: flex;
  align-items: center;
  gap: 10px;

  .icon {
    height: 50px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    background: #fde9d2;
    border-radius: 50%;

    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }
  }

  .flex-column {
    p {
      color: var(--text-primary);
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      margin-bottom: 8px;
    }

    h4 {
      color: var(--text-primary);
      font-size: 28px;
      font-style: normal;
      font-weight: 800;
      line-height: normal;
    }
  }
`;

export default MySubscriptions;
