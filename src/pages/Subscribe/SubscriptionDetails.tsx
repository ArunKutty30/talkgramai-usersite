import React, { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import styled from "styled-components";
import { db } from "../../utils/firebase";
import { SUBSCRIPTION_COLLECTION_NAME } from "../../constants/data";
import { ISubscriptionDB } from "../../constants/types";
import { customFormat } from "../../constants/formatDate";
// import { initiateAccessKey, loadScript } from "../../services/paymentService";
// import axios from "axios";

const SubscriptionDetails = ({ subsciptionId }: { subsciptionId: string }) => {
  const [subscriptionData, setSubscriptionData] = useState<ISubscriptionDB | null>(null);

  const handleGetSubscriptionData = useCallback(async () => {
    const docRef = doc(db, SUBSCRIPTION_COLLECTION_NAME, subsciptionId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setSubscriptionData(snapshot.data() as ISubscriptionDB);
        }
      },
      (error) => {
        console.error("Error fetching upcoming sessions:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [subsciptionId]);

  useEffect(() => {
    handleGetSubscriptionData();
  }, [handleGetSubscriptionData]);

  // const test = async () => {
  //   try {
  //     await loadScript(
  //       "https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js"
  //     );
  //     const razorpayWindow = window as any;
  //     await initiateAccessKey();
  //     // const easebuzzCheckout = new razorpayWindow.EasebuzzCheckout("2PBP7IABZ2", "prod");
  //     // const options = {
  //     //   access_key: "2PBP7IABZ2", // access key received via Initiate Payment
  //     //   onResponse: (response: any) => {
  //     //     console.log(response);
  //     //   },
  //     //   theme: "#123456", // color hex
  //     // };
  //     // easebuzzCheckout.initiatePayment(options);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div>
      <StyledSubscribeContainer>
        <StyledContainer>
          <div className="mx pad">
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
                  <p>Booked Sessions</p>
                  <b>{subscriptionData?.bookedSession ?? 0}</b>
                </div>
                <div className="flex-between">
                  <p>Completed Sessions</p>
                  <b>
                    {subscriptionData["completedSession"] ? subscriptionData.completedSession : 0}
                  </b>
                </div>
                <div className="flex-between">
                  <p>Created At</p>
                  <b>{customFormat(subscriptionData.startDate.toDate(), "DD MMM YYYY")}</b>
                </div>
                <div className="flex-between">
                  <p>End Date</p>
                  <b>{customFormat(subscriptionData.endDate.toDate(), "DD MMM YYYY")}</b>
                </div>
              </StyledFlexContainer>
            )}
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
  max-width: 600px;
  width: 100%;
`;

export default SubscriptionDetails;
