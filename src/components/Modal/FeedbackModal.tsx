import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { Field, Form, Formik } from "formik";

import Backdrop from "./Backdrop";
import Button from "../Button";
import ReactModal from "./ReactModal";

import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock.svg";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { IBookingSession, ITutorProfileData } from "../../constants/types";
import { customFormat, formatFromToDate } from "../../constants/formatDate";
import { updateFeedback } from "../../services/bookSessionService";
import Rating from "../Rating";
import { experienceList } from "../../constants/data";
import { getTutorDoc } from "../../services/tutorService";

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

interface IFeedbackModal extends IBookingSession {
  isOpen: boolean;
  handleClose: () => void;
}

const initialValues = { feedback: "", experience: "", rating: 0 };

const FeedbackModal: React.FC<IFeedbackModal> = ({
  isOpen,
  handleClose,
  startTime,
  endTime,
  topic,
  id,
  tutor,
  topicInfo,
}) => {
  const [tutorData, setTutorData] = useState<ITutorProfileData | null>(null);

  const handleGetData = useCallback(async () => {
    try {
      const tutorData = await getTutorDoc(tutor);
      setTutorData(tutorData);
    } catch (error) {
      console.log(error);
    }
  }, [tutor]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      console.log(values);
      await updateFeedback(
        id,
        {
          userFeedback: {
            ...values,
          },
        },
        values.rating
      );
      handleClose();
      console.log("---USER FEEDBACK UPDATED---");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ReactModal>
      <Backdrop handleClose={handleClose} isOpen={isOpen}>
        <AnimatePresence>
          {isOpen && (
            <StyledFeedbackModal
              onClick={(e) => e.stopPropagation()}
              variants={modalVaraints}
              animate="animate"
              initial="initial"
              exit="exit"
            >
              <ProfileContainer>
                <div className="flex-between">
                  <div className="flex">
                    {tutorData && <img src={tutorData.profileImg} alt="" className="profile_img" />}
                    <div className="flex-column">
                      <h5>
                        {topicInfo
                          ? `${topicInfo.category} - ${topicInfo.title}`
                          : typeof topic === "string"
                          ? topic
                          : "Random Topic"}
                      </h5>
                      <p className="s-14">By Tutor Name</p>
                    </div>
                  </div>
                  <div role="button" className="pointer" onClick={handleClose}>
                    <CloseIcon />
                  </div>
                </div>
                <div className="flex-center">
                  <div className="flex-center">
                    <ClockIcon />
                    <span className="s-14 ml-10">{formatFromToDate(startTime, endTime)}</span>
                  </div>
                  <div className="flex-center">
                    <CalendarIcon />
                    <span className="s-14 ml-10">{customFormat(startTime, "DD MMM YYYY")}</span>
                  </div>
                </div>
              </ProfileContainer>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue, isSubmitting }) => (
                  <Form>
                    <StlyedFeedbackForm>
                      <div className="flex-column">
                        <p>How was your experience?</p>
                        <StyledEmojiList>
                          {experienceList.map((exp, index) => (
                            <div
                              className={exp.title === values.experience ? "active" : ""}
                              key={index.toString()}
                              onClick={() => setFieldValue("experience", exp.title)}
                            >
                              <p>{exp.title}</p>
                              <exp.Icon />
                            </div>
                          ))}
                        </StyledEmojiList>
                      </div>
                      <div className="flex-column">
                        <p>Rate Your Tutor</p>
                        <Rating
                          rating={values.rating}
                          onClick={(rating) => setFieldValue("rating", rating)}
                        />
                      </div>
                      <div className="flex-column">
                        <label htmlFor="feedback">Give us some feedback</label>
                        <StyledInput
                          name="feedback"
                          id="feedback"
                          placeholder="give us some feedback to improve ourself"
                        />
                      </div>
                      <div className="flex-between place-center">
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Submiting..." : "Submit"}
                        </Button>
                      </div>
                    </StlyedFeedbackForm>
                  </Form>
                )}
              </Formik>
            </StyledFeedbackModal>
          )}
        </AnimatePresence>
      </Backdrop>
    </ReactModal>
  );
};

const StyledFeedbackModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  max-width: 550px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ede7df;

  @media (max-width: 576px) {
    max-width: 90%;
  }
`;

const ProfileContainer = styled.div`
  padding: 20px;
  background: #fceede;

  .flex-between {
    align-items: flex-start;
    margin-bottom: 30px;

    > .flex {
      display: inline-flex;
      align-items: flex-start;

      .profile_img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        margin-right: 20px;
      }
    }
  }

  > .flex-center {
    gap: 30px;
  }
`;

const StlyedFeedbackForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  padding: 30px;

  .flex-column {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .flex-between {
    width: 100%;
  }
`;

const StyledInput = styled(Field)`
  border-radius: 8px;
  border: 1px solid #ede7df;
  color: var(--text-primary);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  padding: 10px 20px;
  outline-color: rgba(247, 148, 31, 0.2);
`;

const StyledEmojiList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    border: 1px solid var(--gray-2, #62635e);
    padding: 5px 14px;
    cursor: pointer;
    text-transform: capitalize;
    background-color: transparent;
    transition: background-color 100ms linear;

    &.active {
      background-color: #fceede;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export default FeedbackModal;
