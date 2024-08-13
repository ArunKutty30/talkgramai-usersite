import React from 'react';
import styled from 'styled-components';
import { Check, CheckCircleFill } from 'styled-icons/bootstrap';

import { ISelectedPlan, TSubscriptionList } from '../constants/types';
import { useMediaQuery } from 'usehooks-ts';
// import tagBg from "../assets/icons/offer-tag.svg";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ISubscriptionCard extends TSubscriptionList {
  sessionPerWeek: number;
  selectedPlan: ISelectedPlan | null;
  setSelectedPlan: React.Dispatch<React.SetStateAction<ISelectedPlan | null>>;
  applyOffer: boolean;
}

const SubscriptionCard: React.FC<ISubscriptionCard> = (props) => {
  const {
    title,
    sessionPerWeek,
    durationInMonth,
    selectedPlan,
    setSelectedPlan,
    offerPrice,
    recommended,
    applyOffer,
    priceForSession,
  } = props;
  const isMobile = useMediaQuery('(max-width:768px)');

  const noOfSessions = durationInMonth * 4 * sessionPerWeek;

  return (
    <StyledSubscriptionCard
      className={selectedPlan?.title === title ? 'active' : ''}
      onClick={() => {
        setSelectedPlan({
          title: props.title,
          noOfSessions: noOfSessions,
          total: noOfSessions * priceForSession,
          durationInMonth,
          sessionPerWeek,
          offerPrice,
          priceForSession,
        });
        if (isMobile) {
          const checkoutElement = document.getElementById('checkout');

          if (checkoutElement) {
            checkoutElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }}
    >
      <div className="flex-between">
        <h4>{title}</h4>
        {recommended && <p className="recommended">Recommended</p>}
        {/* <h3 className="color-primary">
          Rs {pricePerMonth}
          <span style={{ color: "inherit" }}>/mo</span>
        </h3> */}
      </div>
      <div className="benefits">
        {/* {benefits.map((p, i) => (
          <div key={i.toString()}>
            <div style={{ width: "18px", height: "18px" }}>
              <Check />
            </div>
            <span>{p}</span>
          </div>
        ))} */}
        <div>
          <div style={{ width: '18px', height: '18px' }}>
            <Check />
          </div>
          <span>You get a 50% Beta Launch Discount, making the Per-Session Cost ₹125 Only</span>
        </div>
        <div>
          <div style={{ width: '18px', height: '18px' }}>
            <Check />
          </div>
          <span>You get a Total of {noOfSessions} Sessions</span>
        </div>
        <div>
          <div style={{ width: '18px', height: '18px' }}>
            <Check />
          </div>
          <span>30-Minutes Session Duration</span>
        </div>
      </div>
      {/* <p>
        No. of Sessions : <span>{noOfSessions}</span>
      </p> */}
      {/* <p>
        Date of Purchasing : <span>14/07/2023</span>
      </p> */}
      {/* {tag && (
        <div className="flex-between">
          <p className={`tag ${tag.status}`}>{tag.text}</p>
        </div>
      )} */}
      <div className="price">
        {applyOffer ? (
          <>
            <del className="strike">₹{noOfSessions * priceForSession}</del>
            <span className="offer-price">
              ₹{noOfSessions * priceForSession * 0.5}
              {/* <span style={{ fontSize: "75%" }}>mo</span> */}
            </span>
            <span className="price-offer-tag">-{50}% off</span>
          </>
        ) : (
          <>
            <span className="offer-price">
              ₹{noOfSessions * priceForSession}
              {/* /<span style={{ fontSize: "75%" }}>mo</span> */}
            </span>
            <span className="price-offer-tag">-{50}% off applicable</span>
          </>
        )}
      </div>
      <button className="subcription-card-btn">
        {selectedPlan?.title === title ? (
          <>
            <CheckCircleFill />
            <span>Selected</span>
          </>
        ) : (
          'choose plan'
        )}
      </button>
      {/* {offerPrice && <div className="offer-tag">{offerPrice}% Off</div>} */}
    </StyledSubscriptionCard>
  );
};

const StyledSubscriptionCard = styled.div`
  border-radius: 25px;
  border: 2px solid var(--gray-1, #ecf0ef);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  border: 2px solid rgba(248, 145, 32, 0.25);
  background: rgba(217, 217, 217, 0.11);
  box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.18);

  &.active {
    border: 2px solid var(--primary);
  }

  > .flex-between {
    margin-bottom: 30px;

    h4 {
      text-transform: uppercase;
    }

    .recommended {
      border-radius: 6px;
      border: 1px solid #8cacff;
      background: rgba(141, 52, 255, 0.14);
      display: flex;
      padding: 3.5px 14px;
      justify-content: center;
      align-items: center;
      color: #5866e3;
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  .benefits {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 30px;
    border-bottom: 0.6px solid rgba(0, 0, 0, 0.6);

    > div {
      display: grid;
      grid-template-columns: 24px auto;
      gap: 10px;

      svg {
        fill: var(--primary);
      }

      span {
        color: #646464;
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: start;
      }
    }
  }

  .price {
    display: flex;
    align-items: center;
    padding: 15px 0;

    .strike {
      color: var(--text-primary);
      font-family: Inter;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-decoration-line: strikethrough;
      margin-right: 10px;
      opacity: 0.2;
    }

    .offer-price {
      color: var(--primary);
      font-family: Inter;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-decoration-line: strikethrough;
      margin-right: 10px;
    }

    .price-offer-tag {
      color: var(--text-primary);
      font-family: Inter;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      background: #b8ff45;
      padding: 3px 5px;
      border: 1px solid #a1e03a;
      border-radius: 5px;
    }
  }

  .tag {
    border-radius: 8px;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 7px 10px;

    &.successful {
      background: rgba(25, 128, 0, 0.1);
      color: #198000;
    }
    &.failed {
      color: var(--error);
      background: rgba(204, 44, 61, 0.1);
    }
    &.pending {
      color: var(--gray-3);
      background: rgba(120, 120, 120, 0.1);
    }
    &.info {
      background: rgba(0, 133, 208, 0.1);
      color: var(--blue, #0085d0);
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

  .offer-tag {
    border-radius: 8px;
    background: #ffe29a;
    padding: 8px 10px;
    color: #916800;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    position: absolute;
    bottom: 12px;
    right: 30px;
  }

  .subcription-card-btn {
    border-radius: 9px;
    border: 1px solid #e3e3e3;
    background: #fff;
    box-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.18);
    color: var(--text-primary);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding: 12px 15px;
    font-family: 'Inter';
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: center;
    height: 45px;
    text-transform: capitalize;

    svg {
      width: 18px;
      height: 18px;

      path {
        fill: var(--primary);
      }
    }
  }
`;

export default SubscriptionCard;
