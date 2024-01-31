import React from "react";
import SubscribedUserSession from "../../components/Home/SubscribedUserSession";
import UnsubscribedUser from "../../components/Home/UnsubscribedUser";
import UnsubscribedUserBookedSession from "../../components/Home/UnsubscribedUserBookedSession";
import { userStore } from "../../store/userStore";

const Home = () => {
  const profileData = userStore((store) => store.profileData);
  const subscriptionData = userStore((store) => store.subscriptionData);

  return (
    <div className="home">
      {!profileData?.currentSubscriptionId ? (
        // !profileData?.demoClassBooked &&
        // profileData?.isNewUser ? (
        <>
          <UnsubscribedUser />
        </>
      ) : profileData?.currentSubscriptionId && subscriptionData?.demoClass ? (
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

export default Home;
