import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import CloseSvg from '../../assets/icons/x.svg';

const Banner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
  }, []);

  if (!show) return null;

  return (
    <StyledDiv>
      <div className="mx pad">
        <StyledBanner>
          <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora ip</div>
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
`;

const StyledBanner = styled.div`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  font-size: 14px;
`;

export default Banner;
