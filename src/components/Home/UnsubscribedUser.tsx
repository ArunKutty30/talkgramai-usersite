import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';

import TemporaryPaymentModal from '../Modal/TemporaryPaymentModal';
import Button from '../Button';
import doodle1 from '../../assets/icons/doodle1.svg';
import doodle2 from '../../assets/icons/doodle2.svg';
import doodle3 from '../../assets/icons/doodle3.svg';
import doodle4 from '../../assets/icons/doodle4.svg';
import illustration from '../../assets/images/unsubscribed_hero_illustration.png';
import illustration1 from '../../assets/images/book_another_session.png';
import { userStore } from '../../store/userStore';
import StickyNotesCard from '../StickyNotesCard';
import CustomModal from '../Modal';
import { EUserType } from '../../constants/types';

const SectionHeader = styled.div`
  padding: 40px 0 15px;
`;

const HeroSection = styled.div`
  border-radius: 8px;
  background: var(--primary-2, #fff1e0);
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  margin-bottom: 40px;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }

  .block-one {
    padding: 70px 90px;

    @media (max-width: 968px) {
      padding: 50px 70px;
    }

    @media (max-width: 768px) {
      padding: 30px;
    }

    h1 {
      position: relative;

      &::after {
        position: absolute;
        content: '';
        top: 0;
        left: 100%;
        width: 80px;
        height: 110px;
        background: url(${doodle1});
        transform: translate(calc(-50% - 20px), -50%);
      }
    }

    .flex {
      display: flex;
      align-items: center;
      gap: 25px;
      margin-top: 20px;
    }
  }

  .block-two {
    display: flex;
    justify-content: flex-end;
    padding: 0 90px;

    @media (max-width: 968px) {
      padding: 0 70px;
    }

    @media (max-width: 768px) {
      padding: 0 30px;
    }

    img {
      max-width: 100%;
      height: auto;
      object-fit: contain;
    }
  }

  .illustration1 {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: -1;
  }

  .illustration2 {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: -1;
  }

  .illustration3 {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }
`;

const UnsubscribedUser = () => {
  const user = userStore((store) => store.user);
  const [payemntModalOpen, setPaymentModalOpen] = useState(false);
  const userType = userStore((store) => store.userType);

  return (
    <>
      <div className="pad">
        <SectionHeader>
          <div>
            <h5 className="section-title mb-8">Welcome {user && user.displayName}!</h5>
            <p className="s-14">Let today be the reason you look back and smile on tomorrow. </p>
          </div>
        </SectionHeader>
        <HeroSection>
          <div className="block-one">
            <h1 className="mb-15">Ready to take your English to the next level?</h1>
            <p className="s-14">
              Daily practice gradually leads to the mastery of fluency, step by step.
            </p>
            <div className="flex">
              {userType === EUserType.NEW_USER ? (
                <>
                  <Link to="/book-session">
                    <Button>Try Demo Class</Button>
                  </Link>
                  <Link to="/subscribe">
                    <Button variant="primary-outline">Subscribe</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/subscribe">
                    <Button>Subscribe</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="block-two">
            <img src={illustration} alt="" />
          </div>
          <img src={doodle2} alt="" className="illustration1" />
          <img src={doodle3} alt="" className="illustration2" />
          <img src={doodle4} alt="" className="illustration3" />
        </HeroSection>
        <Modal
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
          }}
          open={payemntModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
          }}
        >
          <TemporaryPaymentModal amount={'99'} />
        </Modal>
        <StyledGridTwo>
          <StickyNotesCard
            title="Know our Subscription Plans"
            description="Elevate your skills by choosing the perfect plan that aligns with your needs today!"
            image={illustration1}
            backgroundColor="#FDB3B3"
            to="/subscribe"
          />
          <StickyNotesCard
            title="Need help?"
            description="For assistance or inquiries, we're here to help—your language learning journey is our priority."
            image={illustration1}
            backgroundColor="#FEE5C7"
            to="https://wa.me/918122092030"
            openOnNextpage
          />
          <StickyNotesCard
            title="Refer a Friend"
            description="Invite Friends to Talkgram and Expand Your Learning Circle!"
            image={illustration1}
            backgroundColor="#D3ECD3"
            to="/refer-and-earn"
          />
        </StyledGridTwo>
        {/* <HelpFulVideos>
          <h5 className="section-title mb-15">Helpful Videos</h5>
          <CardWrapper>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <div className="card-video"></div>
                <p>How to Use Talkgram?</p>
              </Card>
            ))}
          </CardWrapper>
        </HelpFulVideos> */}
        <CustomModal isOpen={false}>
          <StyledPaymentProcessing>
            <h5>Payment processing please wait...</h5>
          </StyledPaymentProcessing>
        </CustomModal>
      </div>
    </>
  );
};

const StyledGridTwo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding-bottom: 50px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
  }
`;

const StyledPaymentProcessing = styled.div`
  padding: 20px;
  text-align: center;
`;

export default UnsubscribedUser;
