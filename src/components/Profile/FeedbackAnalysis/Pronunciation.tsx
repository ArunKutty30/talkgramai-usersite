import React, { useMemo, useState } from "react";
import styled from "styled-components";

import { ReactComponent as DownArrowIcon } from "../../../assets/icons/arrow_down.svg";
import SpeedometerBg from "../../../assets/images/speedometer-bg.png";
import Speedometer from "../../../assets/images/speedometer.png";
import { INewTutorFeedback } from "../../../constants/types";

const dropdownItems = ["item 1", "item 2"];

const positionValue = [
  { left: "-14px", bottom: "-14px" },
  { left: "calc(20% - 14px)", bottom: "calc(50% - 14px)" },
  { left: "calc(50%)", bottom: "calc(100% - 42px)" },
  { left: "calc(80% + 14px)", bottom: "calc(50% - 14px)" },
  { left: "calc(100% - 14px)", bottom: "-14px" },
];

const Pronuciation: React.FC<{ data: INewTutorFeedback[] }> = ({ data }) => {
  const [latestSession, setlatestSession] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const rating = useMemo(() => {
    if (data.length <= 5) {
      return 1;
    }

    const reversedData = data.reverse().map((m) => m.pronunciation.rating);
    const lastFiveSessionData = reversedData.slice(0, 5);

    const originalRating =
      lastFiveSessionData.reduce((a, b) => a + b, 0) / lastFiveSessionData.length;

    return Math.round(originalRating);
  }, [data]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSelect = (item: string) => {
    setlatestSession(item);
    setIsDropdownOpen(false);
  };

  const needleValue = positionValue[rating - 1];

  return (
    <PronuciationWrapper>
      <Head>
        <div className="heading">
          <h4>PRONUNCIATION</h4>
        </div>
        <DropDownContainer>
          <div className="container" style={{ display: "none" }}>
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
      </Head>
      {data.length <= 5 ? (
        <div className="no-data">
          <p>Finish more than 10 sessions to unlock your full analysis.</p>
        </div>
      ) : (
        <>
          <PronuciationContainer>
            <div className="content">
              <p>
                Correct pronunciation is fundamental to clear and comprehensible communication.
                <br />
                <br />
                Your overall pronunciation has been rated with {rating} star{rating > 1 ? "s" : ""},
                indicating that your pronunciation of words{" "}
                {rating <= 2 ? "needs improvement" : rating <= 4 ? "is good" : "is excellent"}.
                <br />
                <br />
                {/* NOTE: Specific sounds where mistakes are made can be included when we have teaching
                content/activities/games and ability/manpower to teach and correct it specifically. */}
              </p>
              {/* <p style={{ marginTop: "12px" }}>
                Scores between <b>3-5</b> showcase that you
              </p> */}
            </div>
          </PronuciationContainer>
          <StyledChart className="chart">
            <div className="speedometer">
              <div
                className="pointer"
                style={{ left: needleValue.left, bottom: needleValue.bottom }}
              ></div>
              <h3 className="needle_value">{rating}</h3>
            </div>
          </StyledChart>
        </>
      )}
    </PronuciationWrapper>
  );
};

const PronuciationWrapper = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(206, 206, 206, 0.25);
  background: rgba(217, 217, 217, 0.11);
  padding: 25px;
`;

const PronuciationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .content {
    h5 {
      color: #f7941f;
      font-size: 14px;
      font-weight: 600;
    }
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  @media (max-width: 450px) {
    display: block;
  }
  .heading {
    h4 {
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 700;
      line-height: 135.523%;
      text-transform: uppercase;
      @media (max-width: 450px) {
        margin-bottom: 12px;
      }
    }
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

const StyledChart = styled.div`
  max-width: 300px;
  width: 100%;
  aspect-ratio: 2/1;
  margin: 20px auto 0;

  .speedometer {
    width: 100%;
    height: 100%;
    background-image: url("${SpeedometerBg}");
    background-size: 100% 100%;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      background-image: url("${Speedometer}");
      background-size: 100% 100%;
    }
  }

  .pointer {
    width: 28px;
    height: 28px;
    background-color: #fff;
    box-shadow: 0px 0px 5.075px 0px rgba(0, 0, 0, 0.25);
    position: absolute;
    border-radius: 50%;
    bottom: 0;
    left: 0;
    z-index: 1;
    transform: translate(-50%, -50%);

    &::after {
      content: "";
      position: absolute;
      width: 75%;
      height: 75%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--primary);
      border-radius: 50%;
    }
  }

  .needle_value {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: fit-content;
    transform: translate(-50%, -50%);
  }
`;

export default Pronuciation;
