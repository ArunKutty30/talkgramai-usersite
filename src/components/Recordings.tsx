import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ArrowRightCircle, ArrowLeftCircle } from 'styled-icons/bootstrap';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { CloseCircleOutline } from 'styled-icons/evaicons-outline';

import CustomModal from './Modal';
import { IRecordings } from '../constants/types';
import { config } from '../constants/config';
// import RecordingVideoPlayer from './RecordingVideoPlayer';

interface IRecordingsProps {
  isOpen: boolean;
  handleClose: () => void;
  meetingId: string;
}

const Recordings: React.FC<IRecordingsProps> = ({ isOpen, handleClose, meetingId }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [recordingUrl, setRecordingUrl] = useState<string[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(false);
  const [isFileUrl, setIsFileUrl] = useState(true);

  const handleGetRecordingsData = useCallback(async () => {
    try {
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

      console.log(data.data);

      if (data.data.length) {
        const isUrl = data.data.every((m) => Boolean(m.file.fileUrl));

        if (isUrl) {
          setRecordingUrl(data.data.map((m) => m.file.fileUrl as string));
        } else {
          setIsFileUrl(false);
          setRecordingUrl(data.data.map((m) => m.file.filePath));
        }
      }
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setFetching(false);
    }
  }, [meetingId]);

  useEffect(() => {
    handleGetRecordingsData();
  }, [handleGetRecordingsData]);

  const handlePrev = () => {
    if (activeIndex === 0) return;
    setActiveIndex((a) => a - 1);
  };

  const handleNext = () => {
    if (activeIndex === recordingUrl.length - 1) return;
    setActiveIndex((a) => a + 1);
  };

  return (
    <CustomModal
      isOpen={isOpen}
      handleClose={handleClose}
      style={{ maxWidth: '90%', padding: '24px', backgroundColor: 'transparent', height: '100%' }}
    >
      <StyledCloseIcon onClick={handleClose}>
        <CloseCircleOutline color="tomato" />
      </StyledCloseIcon>
      <VideoModal>
        {fetching ? (
          <StyledNoRecordingsFound>
            <CircularProgress />
          </StyledNoRecordingsFound>
        ) : error ? (
          <StyledNoRecordingsFound>
            <h4>Something went wrong</h4>
          </StyledNoRecordingsFound>
        ) : !recordingUrl.length ? (
          <StyledNoRecordingsFound>
            <h4>No Recordings Found</h4>
          </StyledNoRecordingsFound>
        ) : isFileUrl ? (
          <>
            <StyledVideo>
              {recordingUrl?.map((m, index) => (
                <video
                  controls
                  key={index}
                  style={{ display: index === activeIndex ? 'block' : 'none' }}
                >
                  <source src={m} type="video/mp4" />
                  <source src={m} type="video/ogg" />
                </video>
              ))}
            </StyledVideo>
            {activeIndex !== 0 && (
              <button className="arrow-btn prev" onClick={() => handlePrev()}>
                <ArrowLeftCircle />
              </button>
            )}
            {activeIndex !== recordingUrl.length - 1 && (
              <button className="arrow-btn" onClick={() => handleNext()}>
                <ArrowRightCircle />
              </button>
            )}
          </>
        ) : (
          <>
            <StyledVideo>
              {recordingUrl?.map((m, index) => (
                <video
                  controls
                  key={index}
                  style={{ display: index === activeIndex ? 'block' : 'none' }}
                >
                  <source
                    src={`https://talkgram-videosdk-recordings.s3.ap-south-1.amazonaws.com/${encodeURIComponent(
                      m
                    )}`}
                    type="video/mp4"
                  />
                </video>
              ))}
            </StyledVideo>
            {activeIndex !== 0 && (
              <button className="arrow-btn prev" onClick={() => handlePrev()}>
                <ArrowLeftCircle />
              </button>
            )}
            {activeIndex !== recordingUrl.length - 1 && (
              <button className="arrow-btn" onClick={() => handleNext()}>
                <ArrowRightCircle />
              </button>
            )}
          </>
        )}
      </VideoModal>
    </CustomModal>
  );
};

const VideoModal = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  video {
    width: 100%;
    aspect-ratio: 16/9;
  }

  .arrow-btn {
    all: unset;
    position: absolute;
    top: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transform: translateY(-50%);

    &.prev {
      right: 100%;
    }
    &.next {
      left: 100%;
    }
  }
`;

const StyledNoRecordingsFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-align: center;
  height: 100%;
`;

const StyledCloseIcon = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const StyledVideo = styled.div`
  margin: auto;
`;

export default Recordings;
