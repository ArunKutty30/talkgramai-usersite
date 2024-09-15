import React from 'react';
import styled from 'styled-components';
import { customFormat } from '../../constants/formatDate';
import { userStore } from '../../store/userStore';
import { reminderStore } from '../../store/reminderStore';
// import { initiateAccessKey, loadScript } from "../../services/paymentService";
// import axios from "axios";

const SubscriptionDetails: React.FC = () => {
  const subscriptionData = userStore((store) => store.subscriptionData);
  const currentPlanSessions = userStore((store) => store.currentPlanSessions);
  const expiredClass = userStore((state) => state.expiredClass);
  const missedClass = userStore((state) => state.missedClass);
  const endDate = reminderStore((state) => state.endDate);

  return (
    <div>
      <StyledSubscribeContainer>
        <StyledContainer>
          <div className="pad">
            <StyledCard>
              <StyledHeader>
                <h5 className="section-title">Your Subscription Details</h5>
              </StyledHeader>
              {!subscriptionData ? null : (
                <StyledFlexContainer>
                  <div className="flex-between">
                    <p>Total Sessions</p>
                    <b>{subscriptionData.noOfSession}</b>
                  </div>
                  <div className="flex-between">
                    <p>Session/week</p>
                    <b>{subscriptionData.sessionPerWeek}</b>
                  </div>
                  {/* <div className="flex-between">
                    <p>Booked Sessions</p>
                    <b>{subscriptionData?.bookedSession ?? 0}</b>
                  </div> */}
                  <div className="flex-between">
                    <p>Completed Sessions</p>
                    <b>{currentPlanSessions?.length}</b>
                  </div>
                  <div className="flex-between">
                    <p>Backlog Sessions</p>
                    <b>{subscriptionData?.backlogSession ?? 0}</b>
                  </div>
                  <div className="flex-between">
                    <p>Cancelled Sessions</p>
                    <b>{subscriptionData?.cancelledSession ?? 0}</b>
                  </div>
                  <div className="flex-between">
                    <p>Missed Sessions</p>
                    <b>{missedClass || 0}</b>
                  </div>
                  <div className="flex-between">
                    <p>Expired Sessions</p>
                    <b>{expiredClass || 0}</b>
                  </div>
                  <div className="flex-between">
                    <p>Current Week End Date</p>
                    <b>{customFormat(endDate, 'DD MMM YYYY hh:mm a')}</b>
                  </div>
                  <div className="flex-between">
                    <p>Subscription End Date</p>
                    <b>{customFormat(subscriptionData.endDate.toDate(), 'DD MMM YYYY')}</b>
                  </div>
                </StyledFlexContainer>
              )}
            </StyledCard>
          </div>
          {/* <button onClick={() => test()}>test</button> */}
        </StyledContainer>
      </StyledSubscribeContainer>
    </div>
  );
};

const StyledSubscribeContainer = styled.div`
  background: #fff;
  min-height: calc(100vh - 70px);
`;

const StyledContainer = styled.div`
  padding: 50px 0;
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;

  .dropdown-grid {
    display: flex;
    align-items: center;
    gap: 80px;

    > div {
      width: 300px;
    }
  }
`;

const StyledFlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  border-radius: 8px;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  background: rgba(255, 255, 255, 0.11);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.18);
`;

export default SubscriptionDetails;
