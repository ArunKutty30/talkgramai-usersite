import React from "react";
import styled from "styled-components";
import { Circle as CircleIcon, CheckCircle } from "@styled-icons/bootstrap";
import { ArrowIosDownward } from "@styled-icons/evaicons-solid";

import { ILessonPlanDB, ITopic } from "../constants/types";

interface ITopicAccordionProps {
  topicData: {
    category: string;
    topics: ITopic[];
  };
  openAccordion: string;
  completedLessonPlan: ILessonPlanDB[];
  setOpenAccordion: React.Dispatch<React.SetStateAction<string>>;
  selectedTopicInterest:
    | {
        title: string;
        category: string;
      }
    | undefined;
  setSelectedTopicInterest: ({ title, category }: { title: string; category: string }) => void;
}

const TopicAccordion: React.FC<ITopicAccordionProps> = ({
  topicData,
  openAccordion,
  setOpenAccordion,
  selectedTopicInterest,
  setSelectedTopicInterest,
  completedLessonPlan,
}) => {
  return (
    <Accordion>
      <p
        className="title"
        onClick={() => {
          if (openAccordion === topicData.category) {
            setOpenAccordion("");
          } else {
            setOpenAccordion(topicData.category);
          }
        }}
      >
        <span> {topicData.category}</span>
        <ArrowIosDownward className={openAccordion === topicData.category ? "active" : ""} />
      </p>
      {openAccordion === topicData.category && (
        <div className="title-dropdown">
          {topicData.topics.map((topic, index) => (
            <div key={index.toString()}>
              {completedLessonPlan.some((s) => s.title.some((p) => p === topic.title)) ? (
                <div className="title-dropdown-content" style={{ cursor: "no-drop" }}>
                  <del>
                    <CheckCircle color="#F7941F" />
                    <span style={{ marginLeft: "5px" }}> {topic.title}</span>
                  </del>
                </div>
              ) : (
                <div
                  className="title-dropdown-content"
                  onClick={() =>
                    setSelectedTopicInterest({
                      category: topicData.category,
                      title: topic.title,
                    })
                  }
                >
                  <>
                    {selectedTopicInterest?.title === topic.title &&
                    selectedTopicInterest.category === topicData.category ? (
                      <CheckCircle color="#F7941F" />
                    ) : (
                      <CircleIcon />
                    )}{" "}
                    {topic.title}
                  </>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Accordion>
  );
};

const Accordion = styled.div`
  .title {
    font-size: 14px;
    padding: 8px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
    transition: all 200ms linear;
    display: flex;
    align-items: center;
    justify-content: space-between;

    svg {
      width: 14px;
      height: 14px;
      transition: all 200ms linear;

      &.active {
        transform: rotate(180deg);
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  .title-dropdown {
    font-size: 14px;
    padding: 8px 15px;
    border-bottom: 1px solid #ccc;

    .title-dropdown-content {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 5px 0;

      svg {
        width: 14px;
        height: 14px;
      }
    }
  }
`;

export default TopicAccordion;
