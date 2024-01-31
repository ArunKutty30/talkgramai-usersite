import React from "react";
import styled from "styled-components";
import { ITransactionDB } from "../constants/types";
import { customFormat } from "../constants/formatDate";

interface IMySubscriptionCard extends ITransactionDB {
  isFinished: boolean;
}

const MySubscriptionCard: React.FC<IMySubscriptionCard> = ({
  isFinished,
  noOfSession,
  plan,
  createdAt,
  demoClass,
  totalPrice,
}) => {
  return (
    <StyledMySubscriptionCard isFinished={isFinished}>
      <div className="flex-between">
        <h4>{demoClass ? plan : plan}</h4>
        <h3>
          {demoClass ? (
            <>Rs {totalPrice}</>
          ) : (
            <>
              Rs {totalPrice}
              <span>/mo</span>
            </>
          )}
        </h3>
      </div>
      <p>
        No. of Sessions : <span>{noOfSession}</span>
      </p>
      <div className="flex-between">
        <p>
          Date of Purchasing : <span>{customFormat(createdAt.toDate(), "DD/MM/YYYY")}</span>
        </p>
        {/* {!isFinished && <Link to="/">View more</Link>} */}
      </div>
    </StyledMySubscriptionCard>
  );
};

const StyledMySubscriptionCard = styled.div<{ isFinished: boolean }>`
  border-radius: 25px;
  border: 2px solid var(--gray-1, #ecf0ef);
  padding: 12px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity ${(props) => (props.isFinished ? "0.5" : "1")};

  h3 {
    font-size: 20px;

    span {
      color: var(--text-primary);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }

  a {
    color: #f7941f;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-decoration: underline;
  }

  p {
    color: var(--gray-3);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    span {
      color: var(--text-primary);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
`;

export default MySubscriptionCard;
