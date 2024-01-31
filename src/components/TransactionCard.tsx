import React from "react";
import styled from "styled-components";
import { ITransactionDB } from "../constants/types";
import { customFormat } from "../constants/formatDate";

const TransactionCard: React.FC<ITransactionDB> = ({
  status,
  noOfSession,
  createdAt,
  demoClass,
  totalPrice,
  plan,
}) => {
  return (
    <StyledTransactionCard>
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
      <p>
        Date of Purchasing : <span>{customFormat(createdAt.toDate(), "DD/MM/YYYY")}</span>
      </p>
      <div className="flex-between">
        <p className={`tag ${status}`}>Transaction {status}</p>
        {/* <Link to="/">View invoice</Link> */}
      </div>
    </StyledTransactionCard>
  );
};

const StyledTransactionCard = styled.div`
  border-radius: 25px;
  border: 2px solid var(--gray-1, #ecf0ef);
  padding: 12px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .tag {
    border-radius: 8px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 7px 10px;
    text-transform: uppercase;

    &.SUCCESS {
      background: rgba(25, 128, 0, 0.1);
      color: #198000;
    }
    &.FAILED {
      color: var(--error);
      background: rgba(204, 44, 61, 0.1);
    }
    &.PENDING {
      color: var(--gray-3);
      background: rgba(120, 120, 120, 0.1);
    }
  }

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

export default TransactionCard;
