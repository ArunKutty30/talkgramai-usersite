import React, { useMemo } from "react";
import StatsCard from "./StatsCard";
import { IBookingSessionDB } from "../constants/types";
import styled from "styled-components";

const UserSessionStats: React.FC<{
  overallBookedSession: IBookingSessionDB[];
}> = ({ overallBookedSession }) => {
  const sessionLists = useMemo(() => {
    if (!overallBookedSession.length) return [];

    const list = overallBookedSession.map((b) => {
      if (b.feedbackFromTutor) {
        return {
          confidence: b.feedbackFromTutor.skills?.confidence || 0,
          passion: b.feedbackFromTutor.skills?.passion || 0,
          listeningComprehension:
            b.feedbackFromTutor.skills?.listeningComprehension || 0,
          conversationBuilding:
            b.feedbackFromTutor.skills?.conversationBuilding || 0,
        };
      }

      return {
        confidence: 0,
        passion: 0,
        listeningComprehension: 0,
        conversationBuilding: 0,
      };
    });

    return list;
  }, [overallBookedSession]);

  return (
    <StyledUserSessionStats>
      <StatsCard
        title="Confidence"
        tooltipContent="How assured the learner appears while speaking."
        total={
          sessionLists.length
            ? sessionLists
                .slice(sessionLists.length - 1)
                .map((m) => m.confidence)
            : 0
        }
        chartData={sessionLists.map((s, i) => ({
          name: `Session ${i + 1}`,
          score: s.confidence,
        }))}
      />
      <StatsCard
        title="Passion"
        tooltipContent="The level of enthusiasm and interest showed by the learner."
        total={
          sessionLists.length
            ? sessionLists.slice(sessionLists.length - 1).map((m) => m.passion)
            : 0
        }
        chartData={sessionLists.map((s, i) => ({
          name: `Session ${i + 1}`,
          score: s.passion,
        }))}
      />
      <StatsCard
        title="Listening Comprehension"
        tooltipContent="The ability to understand and interpret spoken English effectively."
        total={
          sessionLists.length
            ? sessionLists
                .slice(sessionLists.length - 1)
                .map((m) => m.listeningComprehension)
            : 0
        }
        chartData={sessionLists.map((s, i) => ({
          name: `Session ${i + 1}`,
          score: s.listeningComprehension,
        }))}
      />
      <StatsCard
        title="Conversation Building"
        tooltipContent="How well the learner sustains a conversation."
        total={
          sessionLists.length
            ? sessionLists
                .slice(sessionLists.length - 1)
                .map((m) => m.conversationBuilding)
            : 0
        }
        chartData={sessionLists.map((s, i) => ({
          name: `Session ${i + 1}`,
          score: s.conversationBuilding,
        }))}
      />
    </StyledUserSessionStats>
  );
};

const StyledUserSessionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  @media (max-width: 600px) {
    width: 100%;
    overflow: auto;
    grid-template-columns: repeat(4, 70vw);
    gap: 15px;
    cursor: pointer;
    padding-right: 20;
  }
`;

export default UserSessionStats;
