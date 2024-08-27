import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import CloseSvg from '../../assets/icons/x.svg';
import Button from '../Button';

const Banner = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <StyledDiv>
      <div className="mx pad">
        <StyledBanner>
          <div className="content">
            <p>
              15% additional off for students &nbsp;
              <span>
                <sup>*</sup>Terms & Conditions Apply
              </span>
            </p>
            <Button
              onClick={() => window.open('https://forms.gozen.io/lBb4mvDp37aY2PzNbW8Y', '_blank')}
            >
              Apply now
            </Button>
          </div>
          <img
            src={CloseSvg}
            alt="close-icon"
            width={16}
            height={16}
            onClick={() => setShow(false)}
            style={{ cursor: 'pointer' }}
          />
        </StyledBanner>
      </div>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  height: 50px;
  background-color: rgba(255, 241, 224, 1);

  @media (max-width: 768px) {
    height: auto;
  }
`;

const StyledBanner = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  font-size: 14px;

  @media (max-width: 768px) {
    height: auto;
    padding: 10px 0;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 32px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 5px;
      text-align: center;
    }

    button {
      padding: 6px 12px;
    }
  }

  p {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    color: #2e2d2d;

    span {
      font-size: 12px;
      text-transform: capitalize;
    }
  }
`;

export default React.memo(Banner);
