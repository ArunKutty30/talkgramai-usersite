import React from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import SubscribedUserSession from '../../components/Home/SubscribedUserSession';
import UnsubscribedUser from '../../components/Home/UnsubscribedUser';
import UnsubscribedUserBookedSession from '../../components/Home/UnsubscribedUserBookedSession';
import { userStore } from '../../store/userStore';

const Home = () => {
  const subscriptionData = userStore((store) => store.subscriptionData);
  const subscriptionDataFetching = userStore((store) => store.subscriptionDataFetching);

  if (subscriptionDataFetching === 'PENDING') {
    return (
      <StyledLoadingContainer className="home">
        <div className="pad">
          <div style={{ marginBottom: '2rem' }}>
            <Skeleton width={'30%'} height={30} style={{ marginBottom: '10px' }} />
            <Skeleton width={'50%'} count={2} />
          </div>
          <div className="StyledLoadingContainer-grid" style={{ marginBottom: 30 }}>
            <Skeleton height={300} />
            <Skeleton height={300} />
          </div>
          <div>
            <Skeleton height={200} />
          </div>
        </div>
      </StyledLoadingContainer>
    );
  }

  return (
    <div className="home">
      {!subscriptionData ? (
        <>
          <UnsubscribedUser />
        </>
      ) : subscriptionData?.demoClass ? (
        <>
          <UnsubscribedUserBookedSession />
        </>
      ) : (
        <>
          <SubscribedUserSession />
        </>
      )}
    </div>
  );
};

const StyledLoadingContainer = styled.div`
  min-height: calc(100vh - var(--header-height));
  padding: 30px 0;

  .StyledLoadingContainer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

export default Home;
