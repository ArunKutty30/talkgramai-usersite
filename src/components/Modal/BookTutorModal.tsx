import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import Calendar from "react-calendar";

import Backdrop from "./Backdrop";

import CloseIcon from "../../assets/icons/close.svg";
import ClockIcon from "../../assets/icons/clock.svg";
import CalendarIcon from "../../assets/icons/calendar.svg";

const modalVaraints = {
  initial: {
    opacity: 0,
    scale: 0.5,
    x: "-50%",
    y: "-50%",
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
    scale: 1,
    x: "-50%",
    y: "-50%",
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: "-50%",
    y: "-50%",
  },
};

interface IBookTutorModal {
  isOpen: boolean;
  handleClose?: () => void;
}

const BookTutorModal: React.FC<IBookTutorModal> = ({ isOpen, handleClose }) => {
  return (
    <Backdrop handleClose={handleClose} isOpen={isOpen}>
      <AnimatePresence>
        {isOpen && (
          <StyledBookTutorModal
            onClick={(e) => e.stopPropagation()}
            variants={modalVaraints}
            animate="animate"
            initial="initial"
            exit="exit"
          >
            <Container>
              <TutorDiv>
                <Profile>
                  <img src="" alt="" />
                  <div>
                    <h4>Tutor Name</h4>
                    <p>Qualification</p>
                  </div>
                </Profile>
                <SessionDetails>
                  <h3>Mentor Session</h3>
                  <div>
                    <p>Session Duration</p>
                    <p className="head">30 Minutes</p>
                  </div>
                  <div>
                    <p>Session Duration</p>
                    <p className="head">30 Minutes</p>
                  </div>
                </SessionDetails>
              </TutorDiv>
              <ConfirmBookingSection>
                <div className="flex-between">
                  <h3>Select Date</h3>
                  <img src={CloseIcon} alt="" className="pointer" onClick={handleClose} />
                </div>
                <div className="flex-parent">
                  <div className="flex">
                    <img src={CalendarIcon} alt="" />
                    <p>21 June 2023</p>
                  </div>
                  <div className="flex">
                    <img src={ClockIcon} alt="" />
                    <p>10:30 AM - 11:00 AM</p>
                  </div>
                </div>
                <Calendar />
              </ConfirmBookingSection>
            </Container>
          </StyledBookTutorModal>
        )}
      </AnimatePresence>
    </Backdrop>
  );
};

const StyledBookTutorModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  max-width: 900px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ede7df;

  @media (max-width: 576px) {
    max-width: 90%;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  padding: 20px;
  border-radius: 8px;
`;

const TutorDiv = styled.div`
  padding: 0 20px 0;
  border-right: 1px solid #ecf0ef;

  p {
    font-size: 14px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ecf0ef;

  > img {
    width: 72px;
    height: 72px;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const SessionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .head {
    font-size: 16px;
    font-weight: 500;
    margin-top: 15px;
  }

  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const ConfirmBookingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 20px;

  .flex-parent {
    display: flex;
    align-items: center;
    gap: 30px;
  }

  .flex {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export default BookTutorModal;
