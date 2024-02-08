import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import styled from "styled-components";
import { IFluencyFeedback, INewTutorFeedback } from "../../../constants/types";

const analyzeFeedback = (fluency: INewTutorFeedback["fluency"][]) => {
  const feedbackCounts: { [key: string]: number } = {};

  fluency.forEach((flu) => {
    feedbackCounts[flu.feedback] = (feedbackCounts[flu.feedback] || 0) + 1;
  });

  // Find the most common feedback
  const mostCommonFeedback = Object.keys(feedbackCounts).reduce((a, b) =>
    feedbackCounts[a] > feedbackCounts[b] ? a : b
  );

  return mostCommonFeedback;
};

const fluencyFeedbackData = {
  [IFluencyFeedback.LONG_PAUSES]:
    "Practice speaking more fluidly, and consider incorporating pauses strategically for emphasis rather than as moments of hesitation.",
  [IFluencyFeedback.INCOMPLETE_SENTENCES]:
    "Practice expressing your thoughts in a structured manner, ensuring each sentence contributes to the overall flow of your communication.",
  [IFluencyFeedback.FILLER_SOUNDS]:
    "Try replacing filler sounds like 'um,' 'uh,' or 'like' with brief pauses, allowing you to gather your thoughts and speak more confidently.",
};

const Fluency: React.FC<{ data: INewTutorFeedback[] }> = ({ data }) => {
  const groupData = useMemo(() => {
    let description = "";

    if (data.length < 10) {
      return {
        firstGroupData: 0,
        secondGroupData: 0,
      };
    }

    const reminder = data.length % 5;
    const roundOffLength = data.length - reminder;
    const indecies = data.map((_, i) => i);

    const roundOffData1 = data.map((m) => m.fluency).slice(roundOffLength - 5, roundOffLength);
    const roundOffData2 = data.map((m) => m.fluency).slice(roundOffLength - 10, roundOffLength - 5);
    const roundOffIndex1 = indecies.slice(roundOffLength - 5, roundOffLength);
    const roundOffIndex2 = indecies.slice(roundOffLength - 10, roundOffLength - 5);

    const firstGroup = roundOffData1;
    const secondGroup = roundOffData2;

    const analyzeFeedbackGroupOne = analyzeFeedback(firstGroup) as IFluencyFeedback;
    // const analyzeFeedbackGroupTwo = analyzeFeedback(secondGroup) as IFluencyFeedback;

    const firstGroupData = firstGroup.reduce((a, b) => a + b.rating, 0);
    const secondGroupData = secondGroup.reduce((a, b) => a + b.rating, 0);

    const firstGroupRating = firstGroupData / firstGroup.length;
    const secondGroupRating = secondGroupData / secondGroup.length;

    const analyzedFeedback = analyzeFeedbackGroupOne || IFluencyFeedback.INCOMPLETE_SENTENCES;
    const feedbackInfo =
      fluencyFeedbackData[analyzeFeedbackGroupOne || IFluencyFeedback.INCOMPLETE_SENTENCES];

    if (firstGroupRating > secondGroupRating) {
      description = `We have noticed a “noticeable” improvement in your fluency. But there's room for refinement. Focus on avoiding ${analyzedFeedback}. ${feedbackInfo}`;
    } else if (firstGroupRating < secondGroupRating) {
      description = `We have noticed a “slight decrease” in your fluency while speaking. Your immediate area of focus should be on avoiding ${analyzedFeedback}. ${feedbackInfo}`;
    } else {
      description = `We have noticed that your score has remained consistent at (score-5). We appreciate your efforts and practice. To continue improving, concentrate on minimizing ${analyzedFeedback}. ${feedbackInfo}`;

      if (firstGroupRating <= 2) {
        description = `We have noticed that your scores have remained constant at (score-1,2). To enhance your fluency, consciously work on avoiding ${analyzedFeedback}. ${feedbackInfo}`;
      } else if (firstGroupRating <= 4) {
        description = `We have noticed that your scores have remained consistent at (score-3,4). To further enhance your fluency, consciously work on avoiding ${analyzedFeedback}. ${feedbackInfo}`;
      }
    }

    console.log(description);

    return {
      firstGroupData: firstGroupRating,
      secondGroupData: secondGroupRating,
      description,
      firstGroupReversedIndex: roundOffIndex1,
      secondGroupReversedIndex: roundOffIndex2,
    };
  }, [data]);

  console.log(groupData.firstGroupData);

  return (
    <FluencyWrapper>
      <Head>
        <h4>FLUENCY</h4>
      </Head>
      {data.length <= 5 ? (
        <div className="no-data">
          <p>Finish more than 10 sessions to unlock your full analysis.</p>
        </div>
      ) : (
        <>
          <div className="content">
            <p>{groupData?.description}</p>
            <br />
            {/* <p style={{ marginTop: "12px" }}>
              Scores between <b>3-5</b> showcase that you
            </p> */}
          </div>

          <div id="chart">
            <ReactApexChart
              options={{
                chart: {
                  type: "bar",
                  height: 350,
                },
                plotOptions: {
                  bar: {
                    borderRadius: 4,
                    horizontal: true,
                  },
                },
                dataLabels: {
                  enabled: false,
                },
                xaxis: {
                  categories: [
                    `Session ${(groupData.firstGroupReversedIndex?.[0] || 0) + 1}-${
                      (groupData.firstGroupReversedIndex?.[
                        groupData.firstGroupReversedIndex.length - 1
                      ] || 0) + 1
                    }`,
                    `Session ${(groupData.secondGroupReversedIndex?.[0] || 0) + 1}-${
                      (groupData.secondGroupReversedIndex?.[
                        groupData.secondGroupReversedIndex.length - 1
                      ] || 0) + 1
                    }`,
                  ],
                },
                colors: ["rgb(247, 148, 31)", "rgb(247, 148, 31)"],
                tooltip: {
                  y: {
                    title: {
                      formatter() {
                        return "Score";
                      },
                    },
                  },
                },
                yaxis: {
                  min: 0,
                  max: 5,
                },
              }}
              series={[
                {
                  data: [groupData.firstGroupData, groupData.secondGroupData],
                },
              ]}
              type="bar"
              height={150}
            />
          </div>
        </>
      )}
    </FluencyWrapper>
  );
};

const FluencyWrapper = styled.div`
  border-radius: 12px;
  border: 1px solid rgba(206, 206, 206, 0.25);
  background: rgba(217, 217, 217, 0.11);
  padding: 25px;

  .content {
    h5 {
      color: #f7941f;
      font-size: 14px;
      font-weight: 600;
    }
  }
`;

const Head = styled.div`
  margin-bottom: 7px;
  h4 {
    color: var(--text-primary);
    font-size: 18px;
    font-weight: 700;
    line-height: 135.523%;
    text-transform: uppercase;
  }
`;

export default Fluency;
