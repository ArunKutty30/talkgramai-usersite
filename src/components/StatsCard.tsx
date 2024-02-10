import React, { useMemo } from "react";
import styled from "styled-components";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";

import { useNavigate } from "react-router-dom";

import Tooltip from "./Tooltip";
import AreaChart from "./Chart/AreaChart";

const StyledSessionStatsCard = styled.div`
  border-radius: 12px;
  border: 1px solid #cecece40;
  background: #d9d9d91c;
  padding: 25px;
  cursor: pointer;

  .stats-topics {
    display: flex;
    justify-content: start;
    align-item: center;

    .stats-info-icon {
      margin: 0 10px 0 8px;
      font-size: 18px;
    }
  }

  .block-right {
    height: 100px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border-radius: 50%;

    @media (max-width: 600px) {
      height: 100px;
    }

    img {
      width: 50px;
      height: 50px;
      object-fit: contain;

      @media (max-width: 600px) {
        width: 25px;
        height: 25px;
      }
    }
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .stats {
      display: flex;
      justify-content: start;
      align-items: center;

      .stats-value-red {
        font-size: 18px;
        color: red;
      }

      .stats-value-green {
        font-size: 18px;
        color: #00c45a;
      }

      .arrow-green {
        border-radius: 50%;
        padding: 5px 6px 3px 6px;
        margin: 5px 10px;
        font-size: 1rem;
        color: #00c45a;
        background: #04de0026;
      }

      .arrow-red {
        border-radius: 50%;
        padding: 5px 6px 3px 6px;
        margin: 5px 10px;
        font-size: 1rem;
        color: red;
        background: #ffefef;
      }

      .icon {
        font-size: 20px;
      }
    }

    .sub-title {
      color: grey;
    }
  }
`;

interface IStatsCardProps {
  title: string;
  tooltipContent?: string;
  chartData: {
    name: string;
    score: number;
  }[];
  total: number | number[];
}

const StatsCard: React.FC<IStatsCardProps> = ({ title, tooltipContent, total, chartData }) => {
  const navigate = useNavigate();

  const percent = useMemo(() => {
    if (!chartData || chartData.length <= 1) {
      return 0;
    }

    const [lastSessionScore, lastPreviousSessionScore] = [
      chartData[chartData.length - 1].score,
      chartData[chartData.length - 2].score,
    ];

    const score = (lastSessionScore - lastPreviousSessionScore) / 10;

    return Math.floor(score * 100);
  }, [chartData]);

  return (
    <StyledSessionStatsCard onClick={() => navigate("/profile/feedback-analysis")}>
      <h6 className="s-16 mb-8 stats-topics">
        {title}
        {tooltipContent && (
          <Tooltip title={tooltipContent}>
            <InfoOutlinedIcon className="stats-info-icon" />
          </Tooltip>
        )}
      </h6>
      <div className="flex-between">
        <div className="flex-column">
          <div className="stats">
            <h3>{Array.isArray(total) ? total.map((t) => t) : total}</h3>
            {percent >= 0 ? (
              <>
                <div className="arrow-green">
                  <NorthIcon className="icon" />
                </div>
                <p className="stats-value-green">{percent}%</p>
              </>
            ) : (
              <>
                <div className="arrow-red">
                  <SouthIcon className="icon" />
                </div>
                <p className="stats-value-red">{Math.abs(percent)}%</p>
              </>
            )}
          </div>
          <p className="sub-title">compared to last session</p>
        </div>
        <div className="block-right">
          {/* <img src={checked} alt="" /> */}
          <AreaChart data={chartData} />
        </div>
      </div>
    </StyledSessionStatsCard>
  );
};

export default StatsCard;
