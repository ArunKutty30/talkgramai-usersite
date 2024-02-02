import React from "react";

import SubscribePage from "./SubscriptionPage";
import { userStore } from "../../store/userStore";
import SubscriptionDetails from "./SubscriptionDetails";
import SubscriptionLoader from "../../components/Loader/SubscriptionLoader";

const Subscribe = () => {
  const profileData = userStore((store) => store.profileData);

  return (
    <div>
      {!profileData ? (
        <SubscriptionLoader />
      ) : profileData.currentSubscriptionId ? (
        <SubscriptionDetails subsciptionId={profileData.currentSubscriptionId} />
      ) : (
        <SubscribePage />
      )}
    </div>
  );
};

export default Subscribe;
