import React, { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { ISession } from "../../constants/types";
import PreviousSessions from "./PreviousSessions";
import UpcomingSessions from "./UpcomingSessions";
import MissedSessions from "./MissedSessions";

import { ReactComponent as DownArrowIcon } from "../../assets/icons/arrow_down.svg";
import CancelledSession from "./CancelledSessions";

const sessionTabs = [
  {
    name: "Upcoming Sessions",
    value: ISession.UPCOMING,
  },
  {
    name: "Completed Sessions",
    value: ISession.PREVIOUS,
  },
  {
    name: "Missed Sessions",
    value: ISession.MISSED,
  },
  {
    name: "Cancelled Sessions",
    value: ISession.CANCELLED,
  },
];

const Sessions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionType = searchParams.get("type");

  const [selectedSession, setSelectedSession] = useState<ISession>(() => {
    switch (sessionType) {
      case ISession.UPCOMING:
        return ISession.UPCOMING;
      case ISession.PREVIOUS:
        return ISession.PREVIOUS;
      case ISession.MISSED:
        return ISession.MISSED;
      default:
        return ISession.UPCOMING;
    }
  });

  const renderComponent = useMemo(() => {
    switch (selectedSession) {
      case ISession.MISSED:
        return <MissedSessions />;
      case ISession.PREVIOUS:
        return <PreviousSessions />;
      case ISession.UPCOMING:
        return <UpcomingSessions />;
      case ISession.CANCELLED:
        return <CancelledSession />;
      default:
        return <UpcomingSessions />;
    }
  }, [selectedSession]);

  return (
    <SessionsContainer>
      <div className="pad">
        <div className="back">
          <StyledBackButton to="/">
            <DownArrowIcon />
            <span>Back Home</span>
          </StyledBackButton>
        </div>
        <SessionCategory>
          <div>
            {sessionTabs.map((m) => (
              <button
                key={m.name}
                onClick={() => {
                  setSelectedSession(m.value);
                  setSearchParams({ type: m.value });
                }}
                className={selectedSession === m.value ? "active" : ""}
              >
                {m.name}
              </button>
            ))}
          </div>
        </SessionCategory>
        {renderComponent}
      </div>
    </SessionsContainer>
  );
};

const SessionsContainer = styled.div`
  padding-bottom: 50px;

  .back {
    margin: 40px 0 0;
  }
`;

const SessionCategory = styled.div`
  padding: 20px 0;
  overflow-x: auto;
  border-radius: 8px;

  > div {
    display: flex;
    padding: 5.5px 6px;
    align-items: flex-start;
    gap: 8px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    background: var(--gray-1, #ecf0ef);
    width: fit-content;
    font-size: 14px;

    button {
      all: unset;
      padding: 10.5px 20px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 200ms linear;
      white-space: nowrap;

      @media (max-width: 600px) {
        text-align: center;
      }

      &.active {
        font-weight: 600;
        background: #fff;
        box-shadow: 0px 1px 3px 0px rgba(72, 72, 72, 0.15);
      }
    }
  }
`;

const StyledBackButton = styled(Link)`
  display: flex;
  padding: 5.5px 6px;
  align-items: center;
  width: fit-content;
  gap: 8px;

  color: var(--gray-2, #62635e);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  svg {
    transform: rotate(90deg);
    width: 16px;
    height: 16px;

    path {
      stroke: #62635e;
    }
  }
`;

export default Sessions;
