import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { INewTutorFeedback, TGrammar } from '../../../constants/types';
import { config } from '../../../constants/config';

const getGrammarRating = (value: TGrammar): number => {
  if (value === 'too many errors') return 1;
  else if (value === 'noticeable errors') return 2;
  else if (value === 'few errors') return 3;
  else if (value === 'Rarely noticeable') return 4;
  else if (value === 'no errors') return 5;
  return 3;
};

const analyzeFeedback = (
  grammar: INewTutorFeedback['grammar'][],
  key: keyof INewTutorFeedback['grammar']
): TGrammar => {
  const feedbackCounts: { [key: string]: number } = {};

  grammar.forEach((f) => {
    feedbackCounts[f[key]] = feedbackCounts[f[key]] + 1;
  });

  // Find the most common feedback
  const mostCommonFeedback = Object.keys(feedbackCounts).reduce((a, b) =>
    feedbackCounts[a] > feedbackCounts[b] ? a : b
  );

  return (mostCommonFeedback as TGrammar) || 'few errors';
};

const Grammar: React.FC<{ data: INewTutorFeedback[] }> = ({ data }) => {
  const grammarFeedback = useMemo(() => {
    let improveOn = '';
    let description = '';

    if (data.length < 10) {
      return {
        improveOn,
        description,
        rating: 0,
        nextrating: 0,
      };
    }

    const reminder = data.length % 5;
    const roundOffLength = data.length - reminder;
    const indecies = data.map((_, i) => i);
    const roundOffIndex1 = indecies.slice(roundOffLength - 5, roundOffLength);
    const roundOffIndex2 = indecies.slice(roundOffLength - 10, roundOffLength - 5);

    const lastFiveSessionData = data
      .map((m) => m.grammar)
      .slice(roundOffLength - 5, roundOffLength);
    const nextFiveSessionData = data
      .map((m) => m.grammar)
      .slice(roundOffLength - 10, roundOffLength - 5);

    const grammarRatings = {
      tenses: getGrammarRating(analyzeFeedback(lastFiveSessionData, 'tenses')),
      articlesAndPrepositions: getGrammarRating(
        analyzeFeedback(lastFiveSessionData, 'articlesAndPrepositions')
      ),
      mostErrors: analyzeFeedback(lastFiveSessionData, 'mostErrors'),
      subjectVerb: getGrammarRating(analyzeFeedback(lastFiveSessionData, 'subjectVerb')),
      pronounUsage: getGrammarRating(analyzeFeedback(lastFiveSessionData, 'pronounUsage')),
    };

    const nextGrammarRatings = {
      tenses: getGrammarRating(analyzeFeedback(nextFiveSessionData, 'tenses')),
      articlesAndPrepositions: getGrammarRating(
        analyzeFeedback(nextFiveSessionData, 'articlesAndPrepositions')
      ),
      mostErrors: analyzeFeedback(nextFiveSessionData, 'mostErrors'),
      subjectVerb: getGrammarRating(analyzeFeedback(nextFiveSessionData, 'subjectVerb')),
      pronounUsage: getGrammarRating(analyzeFeedback(nextFiveSessionData, 'pronounUsage')),
    };

    if (grammarRatings.pronounUsage <= 3) {
      improveOn = 'Pronouns';
    } else if (grammarRatings.pronounUsage > 3 && grammarRatings.articlesAndPrepositions <= 3) {
      improveOn = 'Articles & Prepositions';
    } else if (grammarRatings.articlesAndPrepositions === 4 && grammarRatings.subjectVerb <= 4) {
      improveOn = 'Subject-Verb Agreement';
    } else {
      improveOn = 'Tenses';
      description = `To enhance your grasp of tenses, focus on reviewing the rules associated with tenses. Work initially on ${grammarRatings.mostErrors} and move to the others later as we have noticed that you make the most errors in ${grammarRatings.mostErrors}`;
    }

    return {
      improveOn,
      description,
      firstGroupReversedIndex: roundOffIndex1,
      secondGroupReversedIndex: roundOffIndex2,
      rating:
        (grammarRatings.tenses +
          grammarRatings.articlesAndPrepositions +
          grammarRatings.pronounUsage +
          grammarRatings.subjectVerb) /
        4,
      nextrating:
        (nextGrammarRatings.tenses +
          nextGrammarRatings.articlesAndPrepositions +
          nextGrammarRatings.pronounUsage +
          nextGrammarRatings.subjectVerb) /
        4,
    };
  }, [data]);

  return (
    <GrammarWrapper>
      <Head>
        <h4>GRAMMAR</h4>
      </Head>
      {data.length <= 5 ? (
        <div className="no-data">
          <p>{config.NO_FEEDBACK_MESSAGE}</p>
        </div>
      ) : (
        <>
          <div className="content">
            <p>
              Effective communication relies on a solid foundation of grammar skills. Our analysis
              highlights that your immediate area of focus should be on {grammarFeedback.improveOn}.
              <br />
              <br />
              {grammarFeedback.description}
            </p>
            {/* <p style={{ marginTop: "12px" }}>
              Scores between <b>3-5</b> showcase that you
            </p> */}
          </div>
          <div id="chart">
            <ReactApexChart
              options={{
                chart: {
                  type: 'bar',
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
                    `Session ${(grammarFeedback.firstGroupReversedIndex?.[0] || 0) + 1}-${
                      (grammarFeedback.firstGroupReversedIndex?.[
                        grammarFeedback.firstGroupReversedIndex.length - 1
                      ] || 0) + 1
                    }`,
                    `Session ${(grammarFeedback.secondGroupReversedIndex?.[0] || 0) + 1}-${
                      (grammarFeedback.secondGroupReversedIndex?.[
                        grammarFeedback.secondGroupReversedIndex.length - 1
                      ] || 0) + 1
                    }`,
                  ],
                },
                colors: ['rgb(247, 148, 31)', 'rgb(247, 148, 31)'],
                tooltip: {
                  y: {
                    title: {
                      formatter() {
                        return 'Score';
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
                  data: [grammarFeedback.rating, grammarFeedback.nextrating],
                },
              ]}
              type="bar"
              height={150}
            />
          </div>
        </>
      )}
    </GrammarWrapper>
  );
};

const GrammarWrapper = styled.div`
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

export default Grammar;
