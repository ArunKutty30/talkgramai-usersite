import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as DownArrowIcon } from '../../../assets/icons/arrow_down.svg';
import SpeedometerBg from '../../../assets/images/speedometer-bg.png';
import Speedometer from '../../../assets/images/speedometer.png';
import { INewTutorFeedback } from '../../../constants/types';
import { config } from '../../../constants/config';

const dropdownItems = ['item 1', 'item 2'];

type TRange = INewTutorFeedback['vocabulary']['range'];
type TWordChoicePrecision = INewTutorFeedback['vocabulary']['wordChoicePrecision'];

const positionValue = [
  { left: '-14px', bottom: '-14px' },
  { left: 'calc(20% - 14px)', bottom: 'calc(50% - 14px)' },
  { left: 'calc(50%)', bottom: 'calc(100% - 42px)' },
  { left: 'calc(80% + 14px)', bottom: 'calc(50% - 14px)' },
  { left: 'calc(100% - 14px)', bottom: '-14px' },
];

const analyzeVocabulary = (
  vocabulary: INewTutorFeedback['vocabulary'][]
): { range: TRange; wordChoicePrecision: TWordChoicePrecision } => {
  const range: { [key: string]: number } = {};
  const wordChoicePrecision: { [key: string]: number } = {};

  vocabulary.forEach((voc) => {
    range[voc.range] = (range[voc.range] || 0) + 1;
    wordChoicePrecision[voc.wordChoicePrecision] =
      (wordChoicePrecision[voc.wordChoicePrecision] || 0) + 1;
  });

  // Find the most common feedback
  const mostCommonRange = Object.keys(range).reduce((a, b) => (range[a] > range[b] ? a : b));
  const mostCommonWordChoicePrecision = Object.keys(wordChoicePrecision).reduce((a, b) =>
    wordChoicePrecision[a] > wordChoicePrecision[b] ? a : b
  );

  return {
    range: (mostCommonRange as TRange) || 'moderate',
    wordChoicePrecision: (mostCommonWordChoicePrecision as TWordChoicePrecision) || 'inappropriate',
  };
};

const getVocabularyFeedbackData = (key: string, value?: string) => {
  if (key === 'case1') {
    return `Our analysis indicates that your vocabulary range is “${value}”. To expand your vocabulary, read widely, listen attentively, maintain a regularly updated vocabulary list and actively use new words in communication.`;
  } else if (key === 'case2') {
    return `Our analysis indicates that your word choices are “${value}”. Work on selecting words that precisely convey your intended meaning. Use a thesaurus regularly to explore alternatives and enrich your expressive skills.`;
  } else if (key === 'case3') {
    return `Our analysis indicates that your vocabulary range is moderate and your word choices are occasionally inappropriate. Diversify your vocabulary by incorporating new words daily. Improve word choice precision through careful selection and regular thesaurus use for enhanced expressiveness.`;
  } else if (key === 'case4') {
    return `Your vocabulary range is assessed as “moderate”/”extensive” and the precision of your word choice is appropriate, indicating a keen understanding of selecting words that convey your intended meaning accurately. This is a commendable aspect of your language proficiency. Continue to refine your word choices to add depth and precision to your communication. `;
  }

  return '';
};

const Vocabulary: React.FC<{ data: INewTutorFeedback[] }> = ({ data }) => {
  const [latestSession, setlatestSession] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const groupData = useMemo(() => {
    let description = '';
    // let vocabularyRange: INewTutorFeedback["vocabulary"]["range"] = "moderate";
    // let wordChoicePrecision: INewTutorFeedback["vocabulary"]["wordChoicePrecision"] =
    //   "inappropriate";

    if (data.length <= 5) {
      description = '';
      return {
        points: 1,
        description,
      };
    }

    const reversedData = data.reverse().map((m) => m.vocabulary);
    const lastFiveSessionData = reversedData.slice(0, 5);

    const mostUsedData = analyzeVocabulary(lastFiveSessionData);

    if (mostUsedData.range === 'limited') {
      description = getVocabularyFeedbackData('case1', 'limited');
    } else if (mostUsedData.wordChoicePrecision === 'inappropriate') {
      description = getVocabularyFeedbackData('case2', 'inappropriate');
    } else if (
      mostUsedData.wordChoicePrecision === 'occasionally inappropriate' &&
      mostUsedData.range === 'moderate'
    ) {
      description = getVocabularyFeedbackData('case3', '');
    } else if (mostUsedData.wordChoicePrecision === 'appropriate') {
      description = getVocabularyFeedbackData('case4', '');
    }

    return {
      points: mostUsedData.range === 'limited' ? 2 : mostUsedData.range === 'moderate' ? 3 : 5,
      description,
    };
  }, [data]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSelect = (item: string) => {
    setlatestSession(item);
    setIsDropdownOpen(false);
  };

  const needleValue = positionValue[groupData.points - 1];

  return (
    <VocabularyWrapper>
      <Head>
        <div className="heading">
          <h4>VOCABULARY</h4>
        </div>
        <DropDownContainer>
          <div className="container" style={{ display: 'none' }}>
            <SelectContent onClick={toggleDropdown}>
              <SelectText>{latestSession || 'S-1 to S-5'}</SelectText>
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
          <p>{config.NO_FEEDBACK_MESSAGE}</p>
        </div>
      ) : (
        <>
          <VocabularyContainer>
            <div className="content">
              <p>{groupData?.description}</p>
              <br />
              {/* <p style={{ marginTop: "12px" }}>
                Scores between <b>3-5</b> showcase that you
              </p> */}
            </div>
          </VocabularyContainer>
          <StyledChart className="chart">
            <div className="speedometer">
              <div
                className="pointer"
                style={{ left: needleValue.left, bottom: needleValue.bottom }}
              ></div>
              <h3 className="needle_value">{groupData.points}</h3>
            </div>
          </StyledChart>
        </>
      )}
    </VocabularyWrapper>
  );
};

const VocabularyWrapper = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(206, 206, 206, 0.25);
  background: rgba(217, 217, 217, 0.11);
  padding: 25px;
`;

const VocabularyContainer = styled.div`
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
  .heading {
    h4 {
      color: var(--text-primary);
      font-size: 18px;
      font-weight: 700;
      line-height: 135.523%;
      text-transform: uppercase;
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
    width: 110px;
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
    background-image: url('${SpeedometerBg}');
    background-size: 100% 100%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      background-image: url('${Speedometer}');
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
      content: '';
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

export default Vocabulary;
