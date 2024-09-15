import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Timestamp, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Field, Form, Formik } from 'formik';
import _ from 'lodash';
import toast from 'react-hot-toast';

import Backdrop from './Backdrop';
import Button from '../Button';
import CloseIcon from '../../assets/icons/close.svg';
import ClockIcon from '../../assets/icons/clock.svg';
import CalendarIcon from '../../assets/icons/calendar.svg';
import { customFormat } from '../../constants/formatDate';
import Avatar from '../Avatar';
import { EnumTopic, EUserType, ILessonPlanDB, ITutorProfileData } from '../../constants/types';
import { TUTOR_COLLECTION_NAME, topicList } from '../../constants/data';
import { userStore } from '../../store/userStore';
import { getCompletedLessonPlan, updateUserDoc } from '../../services/userService';
import {
  createBookSessionDoc,
  deleteBookSessionDoc,
  deleteDemoBookSessionDoc,
  updateBookSessionDoc,
} from '../../services/bookSessionService';
import { db } from '../../utils/firebase';
import { createMeeting } from '../../utils/api';
import { config } from '../../constants/config';
import { reminderStore } from '../../store/reminderStore';
import {
  sendBookingCancellationMail,
  sendBookingConfirmationMail,
} from '../../services/mailService';
import ReactModal from './ReactModal';
import TopicAccordion from '../TopicAccordion';
import { topicsData } from '../../utils/updatedtopic';
import {
  bookDemoSessionValidationSchema,
  bookSessionValidationSchema,
} from '../../constants/validationSchema';
import { getRandomUniqueTopic } from '../../constants/formatter';
// import { handlePayForDemoClass } from '../../services/paymentService';
import { generalStore } from '../../store/generalStore';
import VerifyPhoneNumberModal from './VerifyPhoneNumberModal';
import { createDemoClassSubscriptionService } from '../../services/subscriptionService';

const modalVaraints = {
  initial: {
    opacity: 0,
    scale: 0.5,
    x: '-50%',
    y: '-50%',
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
    scale: 1,
    x: '-50%',
    y: '-50%',
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: '-50%',
    y: '-50%',
  },
};

interface IConfirmTutorModal {
  isOpen: boolean;
  handleClose?: (showSubscribeModal?: boolean) => void;
  selectedDate: {
    slotTime: Date;
    id: string;
  };
  tutorId: string;
  type?: 'CONFRIM' | 'EDIT' | 'CANCEL';
  formData?: {
    id: string;
    topic: string;
    topicInfo: {
      title: string;
      category: string;
    };
    description: string;
  };
  isDemoClass?: boolean;
}

interface IFormType {
  topic: string;
  topicInfo: {
    title: string;
    category: string;
  };
  description: string;
}

const initialValues: IFormType = {
  topic: '',
  topicInfo: {
    title: '',
    category: '',
  },
  description: '',
};

const ConfirmTutorModal: React.FC<IConfirmTutorModal> = ({
  isOpen,
  handleClose,
  selectedDate,
  tutorId,
  type = 'CONFRIM',
  formData,
  isDemoClass,
}) => {
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('');
  const navigate = useNavigate();
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const userType = userStore((store) => store.userType);
  const subscriptionData = userStore((store) => store.subscriptionData);
  const refetchUser = userStore((store) => store.refetchUser);
  const sessionLeft = userStore((store) => store.sessionLeft);
  const [tutorData, setTutorData] = useState<ITutorProfileData>();
  const session = reminderStore((store) => store.session);
  const [completedLessonPlan, setCompletedLessonPlan] = useState<ILessonPlanDB[]>([]);
  const tempValues = useRef<IFormType | null>(null);
  const updateSubscriptionDataOutdated = userStore((state) => state.updateSubscriptionDataOutdated);
  const setOpenVerifyPhoneNoModal = generalStore((store) => store.setOpenVerifyPhoneNoModal);
  const openVerifyPhoneNoModal = generalStore((store) => store.openVerifyPhoneNoModal);

  const handleGetTutorData = useCallback(async () => {
    try {
      const userDocRef = doc(db, TUTOR_COLLECTION_NAME, tutorId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        setTutorData(userSnapshot.data() as ITutorProfileData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [tutorId]);

  const handleGetCompletedLessonPlan = useCallback(async () => {
    if (!user) return;

    try {
      const lessonData = await getCompletedLessonPlan(user.uid);
      console.log(lessonData);
      setCompletedLessonPlan(lessonData);
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    handleGetTutorData();
    handleGetCompletedLessonPlan();
  }, [handleGetTutorData, handleGetCompletedLessonPlan]);

  const handleCancelSession = async () => {
    try {
      if (!user || !profileData) return;
      if (!formData) return;
      console.log('ENTER');
      setLoading(true);

      if (subscriptionData?.demoClass === true) {
        await deleteDemoBookSessionDoc(formData.id, formData.topicInfo);
      } else {
        await deleteBookSessionDoc(formData.id, formData.topicInfo);
      }

      setMessage('Your Session has been Cancelled !!');
      updateSubscriptionDataOutdated(true);

      setTimeout(() => {
        if (handleClose) handleClose();
      }, 1500);

      sendBookingCancellationMail({
        userId: user.uid,
        tutorId: tutorId,
        date: dayjs(selectedDate.slotTime).format('DD-MM-YYYY'),
        time: dayjs(selectedDate.slotTime).format('hh-mm a'),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSession = async (values: IFormType) => {
    try {
      if (!user || !profileData) return;
      if (!formData) return;

      setLoading(true);

      await updateBookSessionDoc(
        formData.id,
        {
          topic: values.topic,
          topicInfo: values.topicInfo,
          description: values.description,
          updatedAt: Timestamp.now(),
        },
        formData.topicInfo,
        user.uid
      );
      setMessage('Your Changes have been made !!');
      setTimeout(() => {
        if (handleClose) handleClose();
      }, 2000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // const handleConfirmClass = (tempSubscriptionData: any) => {
  //   console.log('ssss');
  //   if (!tempValues.current) return;
  //   console.log('ddd');

  //   handleConfirmSession(tempValues.current, tempSubscriptionData);
  // };

  console.log(selectedDate);

  const handleConfirmSession = async (
    values: IFormType,
    tempSubscriptionData?: any,
    tempPhoneNumber?: string
  ) => {
    try {
      if (!user || !profileData) return;

      if (!subscriptionData && userType === EUserType.EXISTING_USER) {
        handleClose?.(true);
        return;
      }

      if (!Boolean(tempPhoneNumber) && !Boolean(profileData?.phoneNumberVerified)) {
        setOpenVerifyPhoneNoModal(true);
        tempValues.current = values;
        return;
      }

      console.log('sessionLeft', sessionLeft);

      if (!tempSubscriptionData) {
        if (!subscriptionData && userType === EUserType.NEW_USER) {
          setLoading(true);
          tempValues.current = values;
          try {
            // await handlePayForDemoClass(user, handleConfirmClass, tempPhoneNumber);
          } catch (error) {
            toast.error('something went wrong');
            setLoading(false);
          }
          return;
        }
      }

      setLoading(true);

      let cost = config.TUTOR_FEE_PER_SESSION;

      if (values.topic === EnumTopic.RANDOM_TOPIC) {
        const uniqTopics: Set<string> = new Set();
        completedLessonPlan.forEach((m) => {
          uniqTopics.add(`${m.category}-${m.title}`);
        });
        const randomTopic = getRandomUniqueTopic(topicsData, uniqTopics);
        values.topicInfo = {
          category: randomTopic?.category || '',
          title: randomTopic?.title || '',
        };
      }

      const currentSubscriptionData = tempSubscriptionData || subscriptionData;
      const currentSubscriptionId = tempSubscriptionData
        ? tempSubscriptionData.id
        : subscriptionData?.id;

      const meetDuration = isDemoClass ? 15 : 30;

      const endTime = dayjs(selectedDate.slotTime).add(meetDuration, 'minute').toDate();

      const meetingId = await createMeeting(
        user.uid,
        dayjs(selectedDate.slotTime).format(),
        Boolean(currentSubscriptionData?.recording)
      );

      const remainingBacklogSessions = subscriptionData?.backlogSession ?? 0;
      const useBacklogSession = session <= 0 && remainingBacklogSessions > 0;

      const bookSessionData: { [key: string]: any } = {
        startTime: Timestamp.fromDate(selectedDate.slotTime),
        endTime: Timestamp.fromDate(endTime),
        slotId: selectedDate.id,
        user: user.uid,
        tutor: tutorId,
        subscriptionId: currentSubscriptionId,
        topic: values.topic,
        topicInfo: values.topicInfo,
        description: values.description,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'UPCOMING',
        meetingId,
        cost: cost,
        demoClass: isDemoClass,
        timelogs: null,
      };

      if (sessionLeft === 1 && !useBacklogSession) bookSessionData.isLastSession = true;
      if (sessionLeft === 0 && remainingBacklogSessions === 1) bookSessionData.isLastSession = true;

      await createBookSessionDoc(tutorId, Boolean(isDemoClass), useBacklogSession, bookSessionData);

      setLoading(false);
      setMessage('Your Session has been Booked !!');
      updateSubscriptionDataOutdated(true);

      setTimeout(() => {
        refetchUser();
        navigate('/');
      }, 2000);

      sendBookingConfirmationMail({
        userId: user.uid,
        tutorId: tutorId,
        date: dayjs(selectedDate.slotTime).format('DD-MM-YYYY'),
        time: dayjs(selectedDate.slotTime).format('hh-mm a'),
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  const handleConfirmDemoSession = async (values: IFormType, tempPhoneNumber?: string) => {
    try {
      if (!user || !profileData) return;

      if (!Boolean(tempPhoneNumber) && !Boolean(profileData?.phoneNumberVerified)) {
        setOpenVerifyPhoneNoModal(true);
        tempValues.current = values;
        return;
      }

      if (values.topic === EnumTopic.RANDOM_TOPIC) {
        const uniqTopics: Set<string> = new Set();
        completedLessonPlan.forEach((m) => {
          uniqTopics.add(`${m.category}-${m.title}`);
        });
        const randomTopic = getRandomUniqueTopic(topicsData, uniqTopics);
        values.topicInfo = {
          category: randomTopic?.category || '',
          title: randomTopic?.title || '',
        };
      }

      setLoading(true);

      const meetingId = await createMeeting(
        user.uid,
        dayjs(selectedDate.slotTime).format(),
        true,
        true
      );

      let subscriptionId = subscriptionData?.id;

      if (!subscriptionData) {
        subscriptionId = await createDemoClassSubscriptionService(user.uid);
      }
      await updateUserDoc(user.uid, { demoClassBooked: true });
      const endTime = dayjs(selectedDate.slotTime).add(15, 'minutes').toDate();

      const bookSessionData: { [key: string]: any } = {
        startTime: Timestamp.fromDate(selectedDate.slotTime),
        endTime: Timestamp.fromDate(endTime),
        slotId: selectedDate.id,
        user: user.uid,
        tutor: tutorId,
        subscriptionId: subscriptionId,
        topic: values.topic,
        topicInfo: values.topicInfo,
        description: values.description,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'UPCOMING',
        meetingId,
        cost: 0,
        demoClass: true,
        timelogs: null,
      };
      await createBookSessionDoc(tutorId, true, false, bookSessionData);

      setLoading(false);
      setMessage('Your Session has been Booked !!');
      updateSubscriptionDataOutdated(true);

      setTimeout(() => {
        refetchUser();
        navigate('/');
      }, 2000);

      sendBookingConfirmationMail({
        userId: user.uid,
        tutorId: tutorId,
        date: dayjs(selectedDate.slotTime).format('DD-MM-YYYY'),
        time: dayjs(selectedDate.slotTime).format('hh-mm a'),
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error('something went wrong');
    }
  };

  const handleSubmit = async (values: IFormType) => {
    if (!user || !profileData) return;

    if (Boolean(isDemoClass)) {
      values.topic = 'Demo Class';
    }

    if (type === 'EDIT') return handleEditSession(values);
    if (type === 'CANCEL') return handleCancelSession();
    if (type === 'CONFRIM') {
      if (Boolean(profileData.demoClassBooked)) {
        handleConfirmSession(values);
      } else {
        handleConfirmDemoSession(values);
      }
    }
  };

  const getQuestions = (category: string, title: string) => {
    const questionData = topicsData.find((f) => f.category === category && f.title === title);

    if (!questionData) return [];

    const questions: string[] = [];

    questionData.pointers.forEach((p) => {
      p.questions.forEach((q) => {
        if (questions.length < 5) {
          questions.push(q);
        }
      });
    });

    return questions;
  };

  return (
    <>
      <ReactModal>
        <Backdrop handleClose={handleClose} isOpen={isOpen}>
          <AnimatePresence>
            {isOpen && (
              <StyledConfirmTutorModal
                onClick={(e) => e.stopPropagation()}
                variants={modalVaraints}
                animate="animate"
                initial="initial"
                exit="exit"
              >
                <Container>
                  <TutorDiv>
                    <Profile>
                      {tutorData ? (
                        <>
                          <Avatar
                            size={72}
                            profileImg={tutorData.profileImg}
                            username={tutorData.username}
                          />
                          <div>
                            <h4>{tutorData.username}</h4>
                            {/* <p>Qualification</p> */}
                          </div>
                        </>
                      ) : null}
                    </Profile>
                    <SessionDetails>
                      <h3>Mentor Session</h3>
                      <div>
                        <p>Session Duration</p>
                        <p className="head">{isDemoClass ? '15 minutes' : '30 Minutes'}</p>
                      </div>
                      <div>
                        <p>About</p>
                        <p className="head">
                          {isDemoClass ? 'Demo Session' : 'Subscription Session'}
                        </p>
                      </div>
                    </SessionDetails>
                  </TutorDiv>
                  <Formik
                    initialValues={formData || initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={
                      isDemoClass ? bookDemoSessionValidationSchema : bookSessionValidationSchema
                    }
                    enableReinitialize
                  >
                    {({ values, setValues, errors, setFieldValue, touched }) => (
                      <Form>
                        <ConfirmBookingSection
                          style={{ pointerEvents: type === 'CANCEL' ? 'none' : 'auto' }}
                        >
                          <div className="flex-between">
                            <h3>
                              {type === 'CONFRIM'
                                ? 'Confirm Booking'
                                : type === 'EDIT'
                                ? 'Edit your Session Details'
                                : 'Cancel Your Session'}
                            </h3>
                          </div>
                          <div className="flex-parent">
                            <div className="flex">
                              <img src={CalendarIcon} alt="" />
                              <p>{customFormat(selectedDate.slotTime, 'DD MMM YYYY')}</p>
                            </div>
                            <div className="flex">
                              <img src={ClockIcon} alt="" />
                              <p>
                                {customFormat(selectedDate.slotTime, 'hh:mm A')} -{' '}
                                {dayjs(selectedDate.slotTime)
                                  .add(isDemoClass ? 15 : 30, 'minutes')
                                  .format('hh:mm A')}
                              </p>
                            </div>
                          </div>
                          {!Boolean(isDemoClass) && (
                            <>
                              <SelectTopic>
                                {/* <p>Select a Topic</p> */}
                                <div className="timedropdown">
                                  <Field as="select" name="topic">
                                    <option value="">Select a topic</option>
                                    {topicList.map((m, i) => (
                                      <option key={i} value={m.value}>
                                        {m.name}
                                      </option>
                                    ))}
                                  </Field>
                                </div>
                                {errors.topic && touched.topic && (
                                  <p className="text-error">{errors.topic}</p>
                                )}
                              </SelectTopic>
                              {values.topic === EnumTopic.CUSTOM_TOPIC && (
                                <SelectTopicWrapper>
                                  <div className="topic-header">
                                    <p style={{ borderRight: '1px solid #ccc' }}>Choose a Topic</p>
                                    <p>Questions</p>
                                  </div>
                                  <div className="topic-content">
                                    <div className="topic-content-left">
                                      {_.chain(topicsData)
                                        .groupBy('category')
                                        .map((value, key) => ({ category: key, topics: value }))
                                        .value()
                                        .map((topic, index) => (
                                          <TopicAccordion
                                            key={index.toString()}
                                            topicData={topic}
                                            completedLessonPlan={completedLessonPlan}
                                            openAccordion={openAccordion}
                                            setOpenAccordion={setOpenAccordion}
                                            selectedTopicInterest={values.topicInfo}
                                            setSelectedTopicInterest={(value) =>
                                              setValues((v) => ({ ...v, topicInfo: value }))
                                            }
                                          />
                                        ))}
                                    </div>
                                    <div className="topic-content-right">
                                      <ol>
                                        {getQuestions(
                                          values.topicInfo.category,
                                          values.topicInfo.title
                                        ).map((m, index) => (
                                          <li key={index}>{m}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  </div>
                                </SelectTopicWrapper>
                              )}
                              {(errors.topicInfo?.title || errors.topicInfo?.category) && (
                                <p className="text-error">Please select one topic</p>
                              )}

                              <AddDescriptionContainer>
                                <p>Add some description to make your session more effective</p>
                                <DescriptionInputContainer>
                                  <textarea
                                    readOnly={type === 'CANCEL'}
                                    // placeholder="Keep your description crisp and short. Here are few tips:"
                                    placeholder={`1. Keep your doubts specific\n2. Make sure you have your doubts ready before the session\n3. Share your goal for the session`}
                                    value={values.description}
                                    onChange={(e) => setFieldValue('description', e.target.value)}
                                    rows={5}
                                  />
                                  {/* <ol>
                              <li>Keep your doubts specific</li>
                              <li>Make sure you have your doubts ready before the session</li>
                              <li>Share your goal for the session</li>
                            </ol> */}
                                </DescriptionInputContainer>
                              </AddDescriptionContainer>
                            </>
                          )}
                          {message ? (
                            <StyledSessionConfirmed
                              style={{
                                color: type === 'CANCEL' ? 'var(--error)' : 'var(--primary)',
                              }}
                              className="session-confirmed"
                            >
                              {message}
                            </StyledSessionConfirmed>
                          ) : (
                            <Button
                              variant={type === 'CANCEL' ? 'error' : 'primary'}
                              disabled={loading}
                              type="submit"
                              style={{ pointerEvents: 'auto' }}
                            >
                              {loading
                                ? type === 'CONFRIM'
                                  ? 'Confirming session...'
                                  : 'Loading...'
                                : type === 'CONFRIM'
                                ? 'Confirm Session'
                                : type === 'EDIT'
                                ? 'Confirm Changes'
                                : 'Cancel  Session'}
                            </Button>
                          )}
                        </ConfirmBookingSection>
                      </Form>
                    )}
                  </Formik>
                </Container>
                <img
                  src={CloseIcon}
                  alt=""
                  className="modal-close-icon pointer"
                  onClick={() => handleClose?.()}
                />
              </StyledConfirmTutorModal>
            )}
          </AnimatePresence>
        </Backdrop>
      </ReactModal>
      {openVerifyPhoneNoModal && (
        <VerifyPhoneNumberModal
          handleCallback={(phoneNumber: string) => {
            if (!tempValues.current) return;

            if (isDemoClass) {
              handleConfirmDemoSession(tempValues.current, phoneNumber);
            } else {
              handleConfirmSession(tempValues.current, undefined, phoneNumber);
            }
          }}
          isOpen
        />
      )}
    </>
  );
};

const StyledConfirmTutorModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  max-width: 900px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ede7df;

  @media (max-width: 768px) {
    max-width: 90%;
    height: 75%;
    overflow-y: auto;
  }

  .modal-close-icon {
    position: absolute;
    top: 20px;
    right: 20px;
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  padding: 20px;
  border-radius: 8px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TutorDiv = styled.div`
  padding: 0 20px 0;
  border-right: 1px solid #ecf0ef;

  @media (max-width: 768px) {
    border-right: none;
    padding: 0;
  }

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

  @media (max-width: 768px) {
    padding-left: 0px;
    margin-top: 20px;
  }

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

const SelectTopic = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .timedropdown {
    position: relative;
    padding-right: 20px;
    background: #ffffff;
    border: 1px solid #eae8e5;
    box-shadow: 0px 1px 8px rgba(31, 103, 251, 0.05);
    border-radius: 8px;

    select {
      padding: 14px 20px;
      cursor: pointer;
      outline: none;
      border: none;
      background-color: transparent;
      width: 100%;
    }
  }
`;

const AddDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DescriptionInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #ede7df;
  background: var(--white, #fff);
  // padding: 14px;

  > textarea {
    border-radius: 15px;
    outline: none;
    border: none;
    color: var(--black, #000);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 8px 15px;
    background: rgba(229, 229, 229, 0.3);
    resize: none;
    font-family: 'Inter', sans-serif;

    &:placeholder {
      color: var(--gray-3);
      font-size: 14px;
      line-height: 1.2;
    }
  }

  ol {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      font-size: 14px;
    }
  }
`;

const StyledSessionConfirmed = styled.p`
  color: var(--primary-1, #f7941f);
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding: 12px 24px;
`;

const SelectTopicWrapper = styled.div`
  border-radius: 9px;
  border: 1px solid #ccc;
  overflow: hidden;

  .topic-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-bottom: 1px solid #ccc;
    font-size: 16px;
    text-align: center;
    background: #fff;

    p {
      padding: 10px;
    }
  }

  .topic-content {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .topic-content-left {
      border-right: 1px solid #ccc;
      max-height: 240px;
      overflow-y: auto;
    }

    .topic-content-right {
      padding: 10px;
      max-height: 240px;
      overflow-y: auto;

      ol {
        margin-left: 15px;
        li {
          font-size: 13px;
          margin-bottom: 10px;
        }
      }
    }
  }
`;

export default ConfirmTutorModal;
