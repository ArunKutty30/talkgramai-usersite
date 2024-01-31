import React from "react";
import SubscribePage from "./SubscriptionPage";
import { userStore } from "../../store/userStore";
import SubscriptionDetails from "./SubscriptionDetails";

const Subscribe = () => {
  const profileData = userStore((store) => store.profileData);

  return (
    <div>
      {!profileData ? (
        <div>Loading...</div>
      ) : profileData.currentSubscriptionId ? (
        <SubscriptionDetails subsciptionId={profileData.currentSubscriptionId} />
      ) : (
        <SubscribePage />
      )}
    </div>
  );
};

export default Subscribe;
