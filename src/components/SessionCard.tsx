import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import autoAnimate from "@formkit/auto-animate";
import dayjs from "dayjs";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";
import axios from "axios";
import ReactCountdown from "react-countdown";

import Button from "./Button";
import { ReactComponent as UiTimeIcon } from "../assets/icons/uiw_time.svg";
// import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_down.svg";
import FeedbackModal from "./Modal/FeedbackModal";
import {
  IBookingSession,
  IRecordings,
  ITutorProfileData,
  IUserProfileData,
} from "../constants/types";
import { customFormat, formatFromToDate, getLocaleDate } from "../constants/formatDate";
import ConfirmTutorModal from "./Modal/ConfirmTutorModal";
import Rating from "./Rating";

import { experienceList } from "../constants/data";

import { getUserDoc } from "../services/userService";
import { getTutorDoc } from "../services/tutorService";
import { userStore } from "../store/userStore";
import RaiseDisputeModal from "./Modal/RaiseDisputeModal";
import { config } from "../constants/config";
import TutorFeedbackModal from "./Modal/TutorFeedbackModa";
import Recordings from "./Recordings";

type ISessionType = "upcoming" | "previous" | "missed";

interface ISessionCardProps extends IBookingSession {
  type: ISessionType;
}

const SessionCard: React.FC<ISessionCardProps> = (props) => {
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
    topicInfo,
  } = props;

  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [openTutorFeedbackModal, setOpenTutorFeedbackModal] = useState(false);
  const [openFeedbackDropdown, setOpenFeedbackDropdown] = useState(false);
  const [openModal, setOpenModal] = useState<"CANCEL" | "EDIT">();
  const [openDisputeModal, setOpenDisputeModal] = useState<boolean>(false);
  const parent = useRef(null);
  const [tutorData, setTutorData] = useState<ITutorProfileData | null>(null);
  const [userData, setUserData] = useState<IUserProfileData | null>(null);
  const profileData = userStore((store) => store.profileData);
  const subscriptionData = userStore((store) => store.subscriptionData);
  const [disputeStatus, setDisputeStatus] = useState<"Raise" | "View">("Raise");
  const [recordingUrl, setRecordingUrl] = useState<string[]>();
  const [openRecordingModal, setOpenRecordingModal] = useState(false);
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

  const handleGetRecordingsData = useCallback(async () => {
    if (type !== "previous") return;

    const { data } = await axios.get<IRecordings>(config.RECORDING_API, {
      params: {
        roomId: meetingId,
        page: 1,
        perPage: 10,
      },
      headers: {
        Authorization: process.env.REACT_APP_VIDEOSDK_TOKEN,
      },
    });

    if (data.data.length) {
      setRecordingUrl(data.data.map((m) => m.file.fileUrl));
    }
  }, [type, meetingId]);

  useEffect(() => {
    handleGetData();
    handleGetRecordingsData();
  }, [handleGetData, handleGetRecordingsData]);

  const navigate = useNavigate();
  const sessionLink = `https://meet-talkgram.netlify.app/${meetingId}/?username=${profileData?.displayName}&uid=${user}`;

  const redirectToMeet = () => {
    window.open(sessionLink, "_blank");
  };

  const maxCancelSession = subscriptionData?.demoClass ? 1 : 2;

  const isUserCancelSession =
    (cancelledSession !== undefined ? cancelledSession < maxCancelSession : false) &&
    dayjs(startTime).diff(dayjs(), "hour") >= 2;

  const renderLessonPlan = (
    <Button
      style={{ backgroundColor: "transparent" }}
      variant="secondary"
      onClick={() => {
        navigate(`/lesson-plan/?category=${topicInfo?.category}&title=${topicInfo?.title}`);
      }}
    >
      Lesson Plan
    </Button>
  );

  const renderUserCancelledTab = (
    <Button variant="error" style={{ pointerEvents: "none" }}>
      You cancelled session
    </Button>
  );

  const renderTutorCancelledTab = (
    <Button variant="error" style={{ pointerEvents: "none" }}>
      Cancelled by tutor
    </Button>
  );

  return (
    <StyledSessionCard type={type} ref={parent}>
      <StyledSessionHeader>
        <BlockLeft type={type}>
          <div className="align-center" style={{ paddingLeft: 0 }}>
            <p className="s-14" style={{ textTransform: "uppercase" }}>
              {customFormat(startTime, "ddd")}
            </p>
            <h4 style={{ whiteSpace: "nowrap" }}>{getLocaleDate(startTime)}</h4>
          </div>
          <div className="align-start">
            <p className="s-14 flex-center">
              <UiTimeIcon />
              <span style={{ whiteSpace: "nowrap" }} className="ml-8">
                {formatFromToDate(startTime, endTime)}
              </span>
            </p>
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
          <div className="align-start content">
            <h4 className="s-16">
              {topicInfo
                ? `${topicInfo.category} - ${topicInfo.title}`
                : typeof topic === "string"
                ? topic
                : "Random Topic"}
            </h4>
            <p className="s-12 description">{description}</p>
          </div>
        </BlockLeft>
        <BlockRight>
          {/* {type === "upcoming" && (
            <ReactLink to="/">
              <span>Details</span>
              <ArrowIcon />
            </ReactLink>
          )} */}

          {type === "previous" && (
            <StyledSessionControls>
              {status && status === "USER_CANCELLED" ? (
                renderUserCancelledTab
              ) : status && status === "TUTOR_CANCELLED" ? (
                renderTutorCancelledTab
              ) : (
                <>
                  {!userFeedback ? (
                    <Button
                      size="small"
                      style={{ whiteSpace: "nowrap" }}
                      onClick={() => setOpenFeedbackModal(true)}
                    >
                      Rate Experience
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="secondary"
                      style={{ whiteSpace: "nowrap" }}
                      onClick={() => setOpenFeedbackDropdown((f) => !f)}
                    >
                      View Experience
                    </Button>
                  )}
                  {props["feedbackFromTutor"] && (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setOpenTutorFeedbackModal(true)}
                    >
                      View Tutor Feedback
                    </Button>
                  )}
                  {renderLessonPlan}

                  {recordingUrl && (
                    <Button
                      variant="secondary"
                      size="small"
                      style={{ whiteSpace: "nowrap" }}
                      onClick={() => setOpenRecordingModal(true)}
                    >
                      View Recording
                    </Button>
                  )}
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "var(--error)",
                      cursor: "pointer",
                    }}
                    onClick={() => setOpenDisputeModal(true)}
                  >
                    {disputeStatus} Dispute
                  </Typography>
                </>
              )}
            </StyledSessionControls>
          )}
          {type === "missed" && (
            <Button size="small" variant="error">
              Missed Class
            </Button>
          )}
        </BlockRight>
      </StyledSessionHeader>
      {type === "upcoming" && (
        <StyledSessionControls>
          {status && status === "USER_CANCELLED" ? (
            renderUserCancelledTab
          ) : status && status === "TUTOR_CANCELLED" ? (
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
              {renderLessonPlan}
              {!dayjs(startTime).isBefore(new Date()) &&
                dayjs(startTime).diff(dayjs(), "hour") >= 1 && (
                  <Button variant="secondary" size="small" onClick={() => setOpenModal("EDIT")}>
                    Edit Session
                  </Button>
                )}

              {isUserCancelSession && (
                <Button variant="error" size="small" onClick={() => setOpenModal("CANCEL")}>
                  Cancel Session
                </Button>
              )}

              {/* <Typography
                sx={{ fontWeight: 600, color: "#f7941f", cursor: "pointer" }}
                onClick={() => setOpenDisputeModal(true)}
              >
                {disputeStatus} Dispute
              </Typography> */}
            </>
          )}
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
          sx={{ margin: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}
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
      {openModal === "CANCEL" && (
        <ConfirmTutorModal
          type="CANCEL"
          isOpen={openModal === "CANCEL"}
          handleClose={() => setOpenModal(undefined)}
          selectedDate={startTime}
          tutorId={tutor}
          formData={{ id, topic, description, topicInfo: topicInfo || { category: "", title: "" } }}
        />
      )}
      {openModal === "EDIT" && (
        <ConfirmTutorModal
          type="EDIT"
          isOpen={openModal === "EDIT"}
          handleClose={() => setOpenModal(undefined)}
          selectedDate={startTime}
          tutorId={tutor}
          formData={{ id, topic, description, topicInfo: topicInfo || { category: "", title: "" } }}
        />
      )}
      {recordingUrl && openRecordingModal && (
        <Recordings
          isOpen={openRecordingModal}
          handleClose={() => setOpenRecordingModal(false)}
          recordingUrl={recordingUrl}
        />
      )}
      {openTutorFeedbackModal && (
        <TutorFeedbackModal
          isOpen={openTutorFeedbackModal}
          handleClose={() => setOpenTutorFeedbackModal(false)}
          {...props}
          feedbackFromTutor={props.feedbackFromTutor}
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

  ${(props) =>
    props.type === "missed" &&
    `
      border: 0.7px solid #ede7df;
      background: #fff;
  `}

  ${(props) =>
    props.type === "previous" &&
    `
      background: #fff;
  `}
`;

const StyledSessionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BlockLeft = styled.div<{ type: ISessionType }>`
  display: flex;
  gap: 15px 0;

  @media (max-width: 800px) {
    flex-wrap: wrap;
  }

  > div {
    padding: 0 20px;
    border-right: 1px solid #ede7df;

    &:nth-child(1) {
      @media (max-width: 768px) {
        margin-right: 20px;
      }
    }

    &:nth-child(2) {
      @media (max-width: 768px) {
        border-right: none;
        padding-left: 0;
      }
    }

    &:last-child {
      border-right: none;

      @media (max-width: 768px) {
        padding-left: 0;
        margin-top: 0;
      }
    }

    &.align-center {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    &.align-start {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;

      .description {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    &.content {
      @media (max-width: 968px) {
        padding-top: 10px;
        margin-top: 10px;
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
  gap: 1rem;
`;

const StyledSessionControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 32px;
  margin-top: 30px;
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
  gap: 60px;
  flex-wrap: wrap;

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

export default SessionCard;
