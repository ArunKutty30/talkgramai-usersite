import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import ReactCountdown, { CountdownRenderProps } from 'react-countdown';

import { ICategory } from '../../constants/types';
import { ReactComponent as LeftArrowIcon } from '../../assets/icons/chevron-left.svg';
import BookSessionWrapper from './BookSessionWrapper';
import { userStore } from '../../store/userStore';
import SubscriptionEndedModal from '../../components/Modal/SubscriptionEndedModal';
import Modal from '../../components/Modal';
import { Button } from '../../components';
import { reminderStore } from '../../store/reminderStore';
import { addPrefixZero } from '../../utils/helpers';

const BookSessionContainer = styled.div`
  padding-bottom: 50px;
`;

const BookSessionCategory = styled.div`
  > div {
    display: flex;
    padding: 5.5px 6px;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    background: var(--gray-1, #ecf0ef);
    width: fit-content;

    button {
      all: unset;
      padding: 10.5px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 200ms linear;

      &.active {
        background: #fff;
        box-shadow: 0px 1px 3px 0px rgba(72, 72, 72, 0.15);
      }
    }
  }
`;

const BookSessionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  svg {
    path {
      stroke: black;
    }
  }
`;

const BookSession = () => {
  const [selectedCategory, setSelectedCategory] = useState<ICategory>(ICategory.TUTOR_TALK);
  const navigate = useNavigate();
  const subscriptionData = userStore((store) => store.subscriptionData);
  const expiredClass = userStore((store) => store.expiredClass);
  const profileData = userStore((store) => store.profileData);
  const fetching = reminderStore((store) => store.fetching);
  const endDate = reminderStore((store) => store.endDate);
  const session = reminderStore((store) => store.session);

  const renderer = ({ completed, hours, minutes, seconds, days }: CountdownRenderProps) => {
    if (completed) {
      return null;
    } else {
      return (
        <div>
          <p style={{ lineHeight: '1.5' }}>
            Your next week session booking starts in{' '}
            <b style={{ display: 'inline-block', minWidth: '67px' }}>
              {addPrefixZero(days)}d : {addPrefixZero(hours)}h : {addPrefixZero(minutes)}m :{' '}
              {addPrefixZero(seconds)}s
            </b>{' '}
          </p>
        </div>
      );
    }
  };

  return (
    <BookSessionContainer>
      <div className="pad">
        <BookSessionHeader>
          <div className="flex">
            <div
              onClick={() => navigate(-1)}
              className="pointer"
              style={{ transform: 'rotate(180deg)', marginRight: '15px' }}
            >
              <LeftArrowIcon width={18} height={18} />
            </div>
            <h2 className="section-title">Session</h2>
          </div>
          <BookSessionCategory>
            <div>
              <button
                onClick={() => setSelectedCategory(ICategory.TUTOR_TALK)}
                className={selectedCategory === ICategory.TUTOR_TALK ? 'active' : ''}
              >
                Tutor Talk
              </button>
              {/* <button
                onClick={() => setSelectedCategory(ICategory.CURRICULUM)}
                className={selectedCategory === ICategory.CURRICULUM ? "active" : ""}
              >
                Curriculum
              </button> */}
            </div>
          </BookSessionCategory>
        </BookSessionHeader>
        <p style={{ textAlign: 'center' }} className="mb-20">
          Here are few tutors that can help you .
        </p>
        <BookSessionWrapper />
      </div>
      {!subscriptionData && profileData?.demoClassBooked && <SubscriptionEndedModal isOpen />}
      {(subscriptionData?.bookedSession || 0) + (expiredClass || 0) ===
        subscriptionData?.noOfSession &&
        subscriptionData?.backlogSession === 0 && (
          <Modal isOpen rootClassName="z-90">
            <StyledModalDiv>
              <p>
                You've reached the booking limit. Subscribe now to continue your english journey.
              </p>
              <StyledFlex>
                <Link to="/">
                  <Button variant="secondary">Back</Button>
                </Link>
                <Link to="/subscribe">
                  <Button>Subscribe</Button>
                </Link>
              </StyledFlex>
            </StyledModalDiv>
          </Modal>
        )}
      {!fetching &&
        session <= 0 &&
        subscriptionData?.backlogSession === 0 &&
        (subscriptionData?.bookedSession || 0) + (expiredClass || 0) !==
          subscriptionData?.noOfSession && (
          <Modal isOpen rootClassName="z-90">
            <StyledModalDiv>
              <ReactCountdown date={endDate} renderer={renderer} />
            </StyledModalDiv>
          </Modal>
        )}
    </BookSessionContainer>
  );
};

export const StyledModalDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  gap: 24px;
  padding: 30px;

  p {
    font-size: 18px;
    line-height: 1.2;
    margin-bottom: 15px;
  }
`;

const StyledFlex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export default BookSession;
