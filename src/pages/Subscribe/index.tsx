import React from 'react';

import SubscribePage from './SubscriptionPage';
import { userStore } from '../../store/userStore';
import SubscriptionDetails from './SubscriptionDetails';
import SubscriptionLoader from '../../components/Loader/SubscriptionLoader';

const Subscribe: React.FC = () => {
  const subscriptionDataFetching = userStore((store) => store.subscriptionDataFetching);
  const subscriptionData = userStore((store) => store.subscriptionData);

  return (
    <div>
      {subscriptionDataFetching === 'PENDING' ? (
        <SubscriptionLoader />
      ) : subscriptionData ? (
        <SubscriptionDetails />
      ) : (
        <SubscribePage />
      )}
    </div>
  );
};

export default Subscribe;
