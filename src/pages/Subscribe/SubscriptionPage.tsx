import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useMediaQuery } from 'usehooks-ts';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import Dropdown from '../../components/Dropdown';
import SubscriptionCard from '../../components/SubscriptionCard';
import PaymentDetails from '../../components/PaymentDetails';
import { ISelectedPlan, TDropdownList } from '../../constants/types';
import { subscriptionList } from '../../constants/data';

// const durationList: TDropdownList[] = [
//   { name: "30 minutes", value: "30 minutes" },
//   // { name: "45 minutes", value: "45 minutes" },
//   // { name: "60 minutes", value: "60 minutes" },
// ];

const sessionList: TDropdownList[] = [
  { name: '3 Sessions/Week', value: '3' },
  { name: '4 Sessions/Week', value: '4' },
  { name: '5 Sessions/Week', value: '5' },
  { name: '7 Sessions/Week', value: '7' },
];

const SubscribePage = () => {
  // const [selectedDuration, setSelectedDuration] = useState<TDropdownList | undefined>(
  //   durationList[0]
  // );
  const isTab = useMediaQuery('(max-width:768px)');
  const [selectedSessionPerWeek, setSelectedSessionPerWeek] = useState<TDropdownList | undefined>(
    sessionList[0]
  );
  const [selectedPlan, setSelectedPlan] = useState<ISelectedPlan | null>(null);
  const [applyOffer, setApplyOffer] = useState(false);

  useEffect(() => {
    const noOfSessions = subscriptionList[1].durationInMonth * 4 * Number(sessionList[0].value);
    setSelectedPlan({
      title: subscriptionList[1].title,
      noOfSessions: noOfSessions,
      total: noOfSessions * subscriptionList[1].priceForSession,
      durationInMonth: subscriptionList[1].durationInMonth,
      sessionPerWeek: 3,
      offerPrice: 25,
      priceForSession: subscriptionList[1].priceForSession,
    });
  }, []);

  useEffect(() => {
    if (selectedSessionPerWeek) {
      if (selectedPlan) {
        const noOfSessions =
          selectedPlan.durationInMonth * 4 * Number(selectedSessionPerWeek.value);
        setSelectedPlan((s) => ({
          ...selectedPlan,
          sessionPerWeek: Number(selectedSessionPerWeek.value),
          noOfSessions: noOfSessions,
          total: noOfSessions * (s ? s.priceForSession : 0),
        }));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionPerWeek, setSelectedPlan]);

  return (
    <StyledSubscribeContainer>
      <StyledContainer>
        <div className="mx pad">
          <StyledHeader>
            <div>
              <h5 className="section-title mb-10">Subscription Plans</h5>
              <p>
                Choose the number of Sessions/Week and the Plan Duration that best suits your
                schedule and aspirations.
              </p>
            </div>
            <div className="dropdown-grid">
              {/* <Dropdown
                list={durationList}
                selectedList={selectedDuration}
                setSelectedList={setSelectedDuration}
                placeholder="Select Duration"
              /> */}
              <Dropdown
                list={sessionList}
                selectedList={selectedSessionPerWeek}
                setSelectedList={setSelectedSessionPerWeek}
                placeholder="No. Of Sessions per Week"
                style={{
                  border: '2px solid rgba(248, 145, 32, 0.25)',
                }}
              />
            </div>
          </StyledHeader>
          {isTab && (
            <Swiper pagination={true} modules={[Pagination]} className="mySwiper">
              {subscriptionList.map((plan, index) => (
                <SwiperSlide key={index}>
                  <SubscriptionCard
                    key={index.toString()}
                    {...plan}
                    sessionPerWeek={Number(selectedSessionPerWeek?.value) ?? 0}
                    selectedPlan={selectedPlan}
                    setSelectedPlan={setSelectedPlan}
                    applyOffer={applyOffer}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <StyledTransactions>
            {!isTab && (
              <StyledTransactionsWrappper>
                {subscriptionList.map((plan, index) => (
                  <SubscriptionCard
                    key={index.toString()}
                    {...plan}
                    sessionPerWeek={Number(selectedSessionPerWeek?.value) ?? 0}
                    selectedPlan={selectedPlan}
                    setSelectedPlan={setSelectedPlan}
                    applyOffer={applyOffer}
                  />
                ))}
              </StyledTransactionsWrappper>
            )}
            {selectedPlan && (
              <PaymentDetails
                selectedPlan={selectedPlan}
                applyOffer={applyOffer}
                setApplyOffer={setApplyOffer}
              />
            )}
          </StyledTransactions>
        </div>
      </StyledContainer>
    </StyledSubscribeContainer>
  );
};

const StyledSubscribeContainer = styled.div`
  background: #fff;
`;

const StyledContainer = styled.div`
  padding: 50px 0;

  .mySwiper {
    padding: 50px 0;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  .dropdown-grid {
    display: flex;
    align-items: center;
    gap: 80px;

    > div {
      width: 300px;
    }
  }
`;

const StyledTransactions = styled.div`
  display: grid;
  grid-template-columns: 830px auto;
  padding: 50px 0;
  gap: 50px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    justify-content: center;
  }

  > h5 {
    margin-bottom: 24px;
    color: var(--text-primary);
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const StyledTransactionsWrappper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  // max-width: 530px;
  width: 100%;

  @media (max-width: 1080px) {
    margin: 0 auto;
    grid-template-columns: repeat(1, 1fr);
  }
`;

export default SubscribePage;
