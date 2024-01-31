import React, { useState } from "react";
import styled from "styled-components";

import { ReactComponent as DownArrowIcon } from "../../../assets/icons/arrow_down.svg";
import Fluency from "../../../components/Profile/FeedbackAnalysis/Fluency";
import Vocabulary from "../../../components/Profile/FeedbackAnalysis/Vocabulary";
import Pronuciation from "../../../components/Profile/FeedbackAnalysis/Pronunciation";
import Grammar from "../../../components/Profile/FeedbackAnalysis/Grammar";
import { userStore } from "../../../store/userStore";
import { INewTutorFeedback } from "../../../constants/types";

const dropdownItems = ["item 1", "item 2"];

const FeedbackAnalysis: React.FC = () => {
  const [latestSession, setlatestSession] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [latestSessionDrop, setlatestSessionDrop] = useState<string | null>(null);
  const [isDropdown, setIsDropdown] = useState<boolean>(false);
  const overallBookedSession = userStore((store) => store.overallBookedSession);
  const isAllSessionFetching = userStore((store) => store.isAllSessionFetching);
  const subscriptionData = userStore((store) => store.subscriptionData);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSelect = (item: string) => {
    setlatestSession(item);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdown((prevState) => !prevState);
  };

  const handleSelectDropDown = (item: string) => {
    setlatestSessionDrop(item);
    setIsDropdown(false);
  };

  return (
    <>
      <FeedbackAnalysisWrapper>
        <Heading>
          <h3>Feedback From Tutors</h3>
        </Heading>
        <div className="drop-down-wrapper" style={{ display: "none" }}>
          <DropDownContainer>
            <div className="container">
              <SelectContent onClick={toggleDropdown}>
                <SelectText>{latestSession || "Latest Session (15-20)"}</SelectText>
                <div>
                  <DownArrowIcon width={14} height={14} />
                </div>
              </SelectContent>
              {isDropdownOpen && (
                <SelectDropDownList>
                  {dropdownItems.map((item, index) => (
                    <div key={index} onClick={() => handleSelect(item)}>
                      <SelectListText>{item}</SelectListText>
                    </div>
                  ))}
                </SelectDropDownList>
              )}
            </div>
          </DropDownContainer>
          <DropDownContainer>
            <div className="container">
              <SelectContent onClick={handleDropdownToggle} className="drop">
                <SelectText>{latestSessionDrop || "Latest Session (15-20)"}</SelectText>
                <div>
                  <DownArrowIcon width={14} height={14} />
                </div>
              </SelectContent>
              {isDropdown && (
                <SelectDropDownList>
                  {dropdownItems.map((item, index) => (
                    <div key={index} onClick={() => handleSelectDropDown(item)}>
                      <SelectListText>{item}</SelectListText>
                    </div>
                  ))}
                </SelectDropDownList>
              )}
            </div>
          </DropDownContainer>
        </div>
      </FeedbackAnalysisWrapper>
      {!subscriptionData ? (
        <div
          style={{ height: "300px", display: "grid", placeItems: "center", textAlign: "center" }}
        >
          <p>Subscribe to see your analytics</p>
        </div>
      ) : isAllSessionFetching ? (
        <div
          style={{ height: "300px", display: "grid", placeItems: "center", textAlign: "center" }}
        >
          <p>Fetching Analytics of your sessions</p>
        </div>
      ) : (
        <FeedbackAnalysisContainer>
          <Fluency
            data={
              overallBookedSession
                .filter((m) => m.feedbackFromTutor !== undefined)
                .map((m) => m.feedbackFromTutor) as INewTutorFeedback[]
            }
          />
          <Vocabulary
            data={
              overallBookedSession
                .filter((m) => m.feedbackFromTutor !== undefined)
                .map((m) => m.feedbackFromTutor) as INewTutorFeedback[]
            }
          />
          <Pronuciation
            data={
              overallBookedSession
                .filter((m) => m.feedbackFromTutor !== undefined)
                .map((m) => m.feedbackFromTutor) as INewTutorFeedback[]
            }
          />
          <Grammar
            data={
              overallBookedSession
                .filter((m) => m.feedbackFromTutor !== undefined)
                .map((m) => m.feedbackFromTutor) as INewTutorFeedback[]
            }
          />
        </FeedbackAnalysisContainer>
      )}
    </>
  );
};

const FeedbackAnalysisWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  @media (max-width: 600px) {
    display: block;
  }
  .drop-down-wrapper {
    display: flex;
    align-items: center;
    gap: 5px;
    @media (max-width: 600px) {
      margin-top: 16px;
    }
    @media (max-width: 450px) {
      display: block;
    }
  }
`;

const FeedbackAnalysisContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }

  .no-data {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
`;

const Heading = styled.div`
  h3 {
    font-size: 18px;
    line-height: 135.523%;
    color: var(--text-primary);
    font-weight: 700;
  }
`;

const DropDownContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-between;
  gap: 8px;
  position: relative;

  .container {
    width: 192px;
    .drop {
      @media (max-width: 450px) {
        margin-top: 8px;
      }
    }
  }
`;

const SelectContent = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  border-radius: 6px;
  border: 1px solid #eee;
  background: #f6f6f6;
  gap: 5px;
  cursor: pointer;
`;

const SelectText = styled.p`
  color: var(--gray3, #787878);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
`;

const SelectDropDownList = styled.div`
  border-radius: 6px;
  border: 1px solid #eee;
  background: #f6f6f6;
  padding-top: 4px;
  padding-bottom: 4px;
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
`;

const SelectListText = styled.p`
  font-size: 14px;
  padding: 7px 12px;
  cursor: pointer;
`;

export default FeedbackAnalysis;
