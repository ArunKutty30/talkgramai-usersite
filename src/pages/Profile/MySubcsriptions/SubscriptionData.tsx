import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import { customFormat } from "../../../constants/formatDate";
import { ITransactionDB } from "../../../constants/types";

import sandclock from "../../../assets/icons/sandclock.png";
import rocket from "../../../assets/icons/rocket.png";
import checked from "../../../assets/icons/checked.png";
import close from "../../../assets/icons/close.svg";
import { getCurrentWeekInfo } from "../../../utils/helpers";
import { getUserCompletedSessionOnSubscriptionDoc } from "../../../services/bookSessionService";

const Stats: React.FC<{
  icon: string;
  title: string;
  count: number;
}> = ({ icon, title, count }) => {
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

interface ISubscriptionDataProps extends ITransactionDB {}

const SubscriptionData: React.FC<ISubscriptionDataProps> = (props) => {
  const {
    totalPrice,
    demoClass,
    noOfSession,
    sessionPerWeek,
    startDate,
    endDate,
    plan,
    missedSession,
    cancelledSession,
    bookedSession,
    user,
    id,
    completedSession,
  } = props;
  const [expiredClass, setExpiredClass] = useState(0);

  const handleGetSubscriptionData = useCallback(async () => {
    try {
      const currentDate = dayjs().isAfter(endDate.toDate()) ? endDate.toDate() : new Date();
      const currentInfo = getCurrentWeekInfo(startDate.toDate(), endDate.toDate(), currentDate);

      if (currentInfo.currentWeek > 1) {
        const lastWeekSessionInfo = await getUserCompletedSessionOnSubscriptionDoc(
          user,
          id,
          startDate.toDate(),
          currentInfo.lastWeekEndDate
        );

        const sessionPerWeekTemp = sessionPerWeek ?? 0;

        const missedClass =
          (currentInfo.currentWeek - 1) * sessionPerWeekTemp - lastWeekSessionInfo.length;

        setExpiredClass(missedClass);
      } else {
        setExpiredClass(0);
      }
    } catch (error) {
      console.log(error);
    }
  }, [startDate, endDate, id, user, sessionPerWeek]);

  useEffect(() => {
    handleGetSubscriptionData();
  }, [handleGetSubscriptionData]);

  const remainingSession = (noOfSession || 0) - ((bookedSession || 0) + (expiredClass || 0));

  return (
    <StyledSelectedSubscription>
      <StyledSelectedSubscriptionCard>
        <p className="text-primary">Subscription Summary</p>

        <div className="grid">
          <p>
            <b>{plan}</b>
          </p>
          <p>
            {demoClass ? (
              <>
                <b>Rs {totalPrice}</b>
              </>
            ) : (
              <>
                <b>Rs {totalPrice}</b>/mo
              </>
            )}
          </p>
        </div>
        <div className="grid">
          <p>
            No. of Sessions : <span>{noOfSession}</span>
          </p>
          {/* <p>
                Subscription Duration : <span>{m.plan}</span>
              </p> */}
        </div>
        <div className="grid">
          <p>
            Start Date : <span>{customFormat(startDate.toDate(), "DD/MM/YYYY")}</span>
          </p>
          <p>
            Number of Sessions /Week: <span>{sessionPerWeek}</span>
          </p>
        </div>
        <div className="grid">
          <p>
            End Date : <span>{customFormat(endDate.toDate(), "DD/MM/YYYY")}</span>
          </p>
          <p>
            Session Duration: <span>30 Minutes</span>
          </p>
        </div>
      </StyledSelectedSubscriptionCard>
      <StyledSelectedSubscriptionStats>
        <Stats
          icon={sandclock}
          title="Remaining Classes"
          count={remainingSession > 0 ? remainingSession : 0}
        />
        <Stats icon={checked} title="Completed Classes" count={completedSession || 0} />
        <Stats icon={rocket} title="Missed Classes" count={missedSession || 0} />
        <Stats icon={close} title="Cancelled Classes" count={cancelledSession || 0} />
        <Stats icon={sandclock} title="Expired Classes" count={expiredClass} />
      </StyledSelectedSubscriptionStats>
    </StyledSelectedSubscription>
  );
};

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

export default SubscriptionData;
