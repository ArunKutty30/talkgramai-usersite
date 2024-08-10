import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import autoAnimate from '@formkit/auto-animate';
import dayjs from 'dayjs';
import Modal from '@mui/material/Modal';
import ReactCountdown from 'react-countdown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import MuiButton from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import toast from 'react-hot-toast';

import Button from '../Button';
import FeedbackModal from '../Modal/FeedbackModal';
import { IBookingSession, ITutorProfileData, IUserProfileData } from '../../constants/types';
import { customFormat, formatFromToDate, getLocaleDateWithYear } from '../../constants/formatDate';
import ConfirmTutorModal from '../Modal/ConfirmTutorModal';
import Rating from '../Rating';
import { experienceList } from '../../constants/data';
import { getUserDoc } from '../../services/userService';
import { getTutorDoc } from '../../services/tutorService';
import { userStore } from '../../store/userStore';
import RaiseDisputeModal from '../Modal/RaiseDisputeModal';
import { config } from '../../constants/config';
import TutorFeedbackModal from '../Modal/TutorFeedbackModal';
import Recordings from '../Recordings';
import ChatModal from '../Modal/ChatModal';

type ISessionType = 'upcoming' | 'previous' | 'missed';

interface ISessionCardProps extends IBookingSession {
  type: ISessionType;
}

const DashboardSessionCard: React.FC<ISessionCardProps> = (props) => {
  const {
    type,
    description,
    topic,
    startTime,
    endTime,
    id,
    userFeedback,
    tutor,
    user,
    meetingId,
    status,
    feedbackFromTutor,
    topicInfo,
    chats,
    demoClass,
  } = props;

  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openTutorFeedbackModal, setOpenTutorFeedbackModal] = useState(false);
  const [openFeedbackDropdown, setOpenFeedbackDropdown] = useState(false);
  const [openModal, setOpenModal] = useState<'CANCEL' | 'EDIT'>();
  const [openDisputeModal, setOpenDisputeModal] = useState<boolean>(false);
  const parent = useRef(null);
  const [tutorData, setTutorData] = useState<ITutorProfileData | null>(null);
  const [userData, setUserData] = useState<IUserProfileData | null>(null);
  const profileData = userStore((store) => store.profileData);
  const subscriptionData = userStore((store) => store.subscriptionData);
  const [disputeStatus, setDisputeStatus] = useState<'Raise' | 'View'>('Raise');
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
  const [openChatModal, setOpenChatModal] = useState(false);
  const cancelledSession = userStore((store) => store.userCancelledSession);

  const handleGetData = useCallback(async () => {
    try {
      const userData = await getUserDoc(user);
      const tutorData = await getTutorDoc(tutor);
      setUserData(userData);
      setTutorData(tutorData);
    } catch (error) {
      console.log(error);
    }
  }, [tutor, user]);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  useEffect(() => {
    handleGetData();
  }, [handleGetData]);

  const navigate = useNavigate();
  const sessionLink = `https://meet.talkgram.in/${meetingId}/?username=${profileData?.displayName}&uid=${user}`;

  const redirectToMeet = () => {
    window.open(sessionLink, '_blank');
  };

  const maxCancelSession = subscriptionData?.demoClass
    ? Number(config.CANCEL_DEMO_SESSION_COUNT)
    : Number(config.CANCEL_SESSION_COUNT);

  const handleCancelSession = () => {
    const canUserCancelSession =
      cancelledSession !== undefined ? cancelledSession < maxCancelSession : false;
    if (!canUserCancelSession) {
      toast.error(
        `You can only cancel ${maxCancelSession} session${
          maxCancelSession === 1 ? '' : 's'
        } on your plan`
      );
      return;
    }

    const timeCheck =
      dayjs(startTime).diff(dayjs(), 'hour') >= config.CANCEL_SESSION_DURATION_IN_HRS;
    if (!timeCheck) {
      toast.error(`You can only cancel 2 hours before the session start time`);
      return;
    }
    setOpenModal('CANCEL');
  };

  const handleEditSession = () => {
    const canUserEdit =
      dayjs(startTime).diff(dayjs(), 'hour') >= config.EDIT_SESSION_DURATION_IN_HRS;

    if (!canUserEdit) {
      toast.error(
        `You can only make edits ${config.EDIT_SESSION_DURATION_IN_HRS} hour${
          config.EDIT_SESSION_DURATION_IN_HRS === 1 ? '' : 's'
        } before the session starts.`
      );
      return;
    }

    setOpenModal('EDIT');
  };

  const renderUserCancelledTab = (
    <Button variant="error" size="small" style={{ pointerEvents: 'none' }}>
      You cancelled session
    </Button>
  );

  const renderTutorCancelledTab = (
    <Button variant="error" size="small" style={{ pointerEvents: 'none' }}>
      Cancelled by tutor
    </Button>
  );

  const renderUserMissedTab = (
    <Button variant="error" size="small" style={{ pointerEvents: 'none' }}>
      You missed session
    </Button>
  );

  const renderTutorMissedTab = (
    <Button variant="error" size="small" style={{ pointerEvents: 'none' }}>
      Tutor missed
    </Button>
  );

  return (
    <StyledSessionCard type={type} ref={parent}>
      {demoClass && (
        <StyledTag variant="info">
          <p>
            <InfoIcon color="info" />
            Demo class
          </p>
        </StyledTag>
      )}
      <StyledSessionHeader>
        <BlockLeft className="section-one" type={type}>
          <div className="flex">
            <div className="align-center" style={{ paddingLeft: 0 }}>
              <p className="s-14 flex">
                <CalendarTodayIcon className="session-card-icon" /> {customFormat(startTime, 'ddd')}
                , {getLocaleDateWithYear(startTime)}
              </p>
            </div>
            <div className="align-center">
              <p className="s-14 flex">
                <AccessTimeIcon className="session-card-icon" />
                <span style={{ whiteSpace: 'nowrap' }}>{formatFromToDate(startTime, endTime)}</span>
              </p>
            </div>
          </div>
          {(type === 'previous' || status === 'TUTOR_MISSED') && (
            <Button
              variant="error"
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                padding: 0,
                whiteSpace: 'nowrap',
                fontSize: 12,
              }}
              size="small"
              onClick={() => setOpenDisputeModal(true)}
            >
              {disputeStatus} Dispute
            </Button>
          )}
        </BlockLeft>

        {/* row-2 */}
        <BlockLeft type={type}>
          <div className="align-start">
            <div className="profiles">
              {userData && userData.profileImg ? (
                <img src={userData.profileImg} alt="" title={userData?.displayName} />
              ) : (
                <span className="avatar-fallback-text" title={userData?.displayName}>
                  {userData?.displayName.slice(0, 1)}
                </span>
              )}
              {tutorData && <img src={tutorData.profileImg} alt="" title={tutorData.username} />}
            </div>
          </div>
          {topicInfo && topicInfo.title && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'start',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => {
                navigate(`/lesson-plan/?category=${topicInfo?.category}&title=${topicInfo?.title}`);
              }}
            >
              <ImportContactsIcon className="session-card-icon" /> Lesson Plan
            </div>
          )}
          {chats && (
            <MuiButton
              onClick={() => setOpenChatModal(true)}
              style={{ textTransform: 'capitalize' }}
              startIcon={<ChatOutlinedIcon />}
            >
              view chat
            </MuiButton>
          )}
        </BlockLeft>

        {/* row-3 */}
        <BlockLeft type={type}>
          <div className="align-start content">
            <h4 className="s-16 mb-8">
              {Boolean(demoClass)
                ? 'Demo Class'
                : topicInfo
                ? `${topicInfo.category} - ${topicInfo.title}`
                : typeof topic === 'string'
                ? topic
                : 'Random Topic'}
            </h4>
            <p className="s-12 description">{description}</p>
          </div>
        </BlockLeft>

        {/* row-4 */}
        <BlockRight>
          {type === 'previous' && (
            <StyledSessionControls>
              {status && status === 'USER_CANCELLED' ? (
                renderUserCancelledTab
              ) : status && status === 'TUTOR_CANCELLED' ? (
                renderTutorCancelledTab
              ) : (
                <>
                  {!userFeedback ? (
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => setOpenFeedbackModal(true)}
                    >
                      Rate Experience
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setOpenFeedbackDropdown((f) => !f)}
                    >
                      View Experience
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setOpenRecordingModal(true)}
                  >
                    View Recording
                  </Button>
                  {feedbackFromTutor && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setOpenTutorFeedbackModal(true)}
                    >
                      View Tutor Feedback
                    </Button>
                  )}
                </>
              )}
            </StyledSessionControls>
          )}
        </BlockRight>
      </StyledSessionHeader>
      {type === 'upcoming' && (
        <StyledSessionControls>
          {status && status === 'USER_CANCELLED' ? (
            renderUserCancelledTab
          ) : status && status === 'TUTOR_CANCELLED' ? (
            renderTutorCancelledTab
          ) : (
            <>
              <ReactCountdown
                date={startTime}
                renderer={({ completed }) => {
                  if (completed) {
                    return (
                      <Button
                        size="small"
                        onClick={() => {
                          redirectToMeet();
                        }}
                      >
                        Join Session
                      </Button>
                    );
                  } else {
                    return (
                      <Button size="small" disabled>
                        Join Session
                      </Button>
                    );
                  }
                }}
              />
              <Button variant="primary-outline" size="small" onClick={handleEditSession}>
                Edit Session
              </Button>
              <Button variant="error" size="small" onClick={handleCancelSession}>
                Cancel Session
              </Button>
            </>
          )}
        </StyledSessionControls>
      )}
      {type === 'missed' && (
        <StyledSessionControls>
          {status && status === 'MISSED'
            ? renderUserMissedTab
            : status && status === 'TUTOR_MISSED'
            ? renderTutorMissedTab
            : null}
        </StyledSessionControls>
      )}
      {userFeedback && openFeedbackDropdown && (
        <StyledFeedbackDropdown>
          <div className="flex">
            <p>Your Experience was </p>
            {experienceList
              .filter((f) => f.title === userFeedback.experience)
              .map((exp, index) => (
                <div className="experience-tag" key={index.toString()}>
                  <p>{exp.title}</p>
                  <exp.Icon />
                </div>
              ))}
          </div>
          <div className="flex">
            <p>You rated your tutor </p>
            <Rating rating={userFeedback.rating} iconSize={24} />
          </div>
        </StyledFeedbackDropdown>
      )}
      {openDisputeModal && (
        <Modal
          sx={{ margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          open={openDisputeModal}
          onClose={() => {
            setOpenDisputeModal(!openDisputeModal);
          }}
        >
          <RaiseDisputeModal
            user={user}
            sessionId={id}
            setDisputeStatus={setDisputeStatus}
            closeModal={() => {
              setOpenDisputeModal(!openDisputeModal);
            }}
          />
        </Modal>
      )}
      {openFeedbackModal && (
        <FeedbackModal
          isOpen={openFeedbackModal}
          handleClose={() => setOpenFeedbackModal(false)}
          {...props}
        />
      )}
      {openModal === 'CANCEL' && (
        <ConfirmTutorModal
          type="CANCEL"
          isOpen={openModal === 'CANCEL'}
          handleClose={() => setOpenModal(undefined)}
          selectedDate={startTime}
          tutorId={tutor}
          formData={{ id, topic, description, topicInfo: topicInfo || { category: '', title: '' } }}
        />
      )}
      {openModal === 'EDIT' && (
        <ConfirmTutorModal
          type="EDIT"
          isOpen={openModal === 'EDIT'}
          handleClose={() => setOpenModal(undefined)}
          selectedDate={startTime}
          tutorId={tutor}
          formData={{ id, topic, description, topicInfo: topicInfo || { category: '', title: '' } }}
        />
      )}
      {meetingId && openRecordingModal && (
        <Recordings
          isOpen={openRecordingModal}
          handleClose={() => setOpenRecordingModal(false)}
          meetingId={meetingId}
        />
      )}
      {openTutorFeedbackModal && (
        <TutorFeedbackModal
          isOpen={openTutorFeedbackModal}
          handleClose={() => setOpenTutorFeedbackModal(false)}
          {...props}
        />
      )}
      {openChatModal && chats && (
        <ChatModal
          isOpen={openChatModal}
          handleClose={() => setOpenChatModal(false)}
          chats={chats.filter((f) => f.topic === 'CHAT')}
        />
      )}
    </StyledSessionCard>
  );
};

const StyledSessionCard = styled.div<{ type: ISessionType }>`
  border-radius: 8px;
  border: 0.7px solid #ede7df;
  background: #fceede;
  padding: 20px;
  z-index: 1;
  position: relative;

  @media (max-width: 600px) {
    padding: 15px;
  }

  ${(props) =>
    props.type === 'missed' &&
    `
      border: 0.7px solid #ede7df;
      background: #fff;
  `}

  ${(props) =>
    props.type === 'previous' &&
    `
      background: #fff;
  `}
`;

const StyledSessionHeader = styled.div`
  display: flex;
  // align-items: flex-start;
  // justify-content: space-between;
  flex-direction: column;
  gap: 15px;

  .session-card-icon {
    font-size: 17px;
    color: #f7941f;
    margin: 0 5px 0 2px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BlockLeft = styled.div<{ type: ISessionType }>`
  display: flex;
  gap: 15px 30px;
  align-items: center;

  &.section-one {
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .flex {
      flex-wrap: wrap;
    }
  }

  > .flex {
    display: flex;
    align-items: center;
    white-space: nowrap;
    padding: 0;
    gap: 15px;

    .align-center {
      .flex {
        gap: 8px;
      }
    }
  }

  .lesson-plan {
    display: flex;
    justify-content: start;
    align-items: center;
  }

  @media (max-width: 800px) {
    flex-wrap: wrap;
  }

  > div {
    // padding: 0 20px;
    // border-right: 1px solid #ede7df;

    &.align-center {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    &.align-start {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: flex-start;
      padding: 0;

      .description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    &.content {
      @media (max-width: 968px) {
        width: 100%;
      }
    }

    h4 {
      line-height: 120%;
    }

    .profiles {
      display: flex;
      align-items: flex-start;
      --size: 24px;

      img {
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        object-fit: cover;

        &:nth-child(2) {
          margin-left: -5px;
        }
      }

      .avatar-fallback-text {
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        background-color: var(--primary);
        color: #fff;
        line-height: 24px;
        text-align: center;
        text-transform: uppercase;
        font-size: 16px;
      }
    }
  }
`;

const BlockRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 14px;
`;

const StyledSessionControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px;
    margin-top: 0px;
  }
`;

// const ReactLink = styled(Link)`
//   display: inline-flex;
//   align-items: center;
//   gap: 5px;
//   color: var(--gray-2, #62635e);
//   font-size: 14px;
//   font-style: normal;
//   font-weight: 400;
//   line-height: normal;

//   svg {
//     transform: rotate(270deg);
//     width: 16px;
//     height: 16px;
//   }
// `;

const StyledFeedbackDropdown = styled.div`
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 20px;
  }

  .flex {
    gap: 24px;

    .experience-tag {
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
  }
`;

const StyledTag = styled.div<{ variant: 'info' | 'error' | 'success' }>`
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 5px 7px;
  border-radius: 8px;

  ${(props) =>
    props.variant === 'info' &&
    `border: 1px solid #0288d1;
    background: rgb(2 136 209 / 10%);
    
  `}

  ${(props) =>
    props.variant === 'error' &&
    `border: 1px solid rgb(255, 140, 140);
  background: rgba(255, 52, 52, 0.14);
  `}

  p {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: uppercase;
  }
`;

export default React.memo(DashboardSessionCard);
