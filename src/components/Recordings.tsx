import React, { useState } from "react";
import styled from "styled-components";
import { ArrowRightCircle, ArrowLeftCircle } from "styled-icons/bootstrap";

import CustomModal from "./Modal";

interface IRecordingsProps {
  isOpen: boolean;
  handleClose: () => void;
  recordingUrl: string[];
}

const Recordings: React.FC<IRecordingsProps> = ({ isOpen, handleClose, recordingUrl }) => {
  const [activeIndex, setActiveIndex] = useState(0);

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
      style={{ maxWidth: "90%", padding: "24px", backgroundColor: "transparent" }}
    >
      <VideoModal>
        {recordingUrl?.map((m, index) => (
          <video controls key={index} style={{ display: index === activeIndex ? "block" : "none" }}>
            <source src={m} type="video/mp4" />
            <source src={m} type="video/ogg" />
          </video>
        ))}
        {activeIndex !== 0 && (
          <button className="prev" onClick={() => handlePrev()}>
            <ArrowLeftCircle />
          </button>
        )}
        {activeIndex !== recordingUrl.length - 1 && (
          <button className="next" onClick={() => handleNext()}>
            <ArrowRightCircle />
          </button>
        )}
      </VideoModal>
    </CustomModal>
  );
};

const VideoModal = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 10px;

  video {
    width: 100%;
    height: 100%;
  }
  button {
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

export default Recordings;
