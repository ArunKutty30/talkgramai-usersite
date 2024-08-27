import styled from 'styled-components';

export const StyledHeader = styled.header`
  height: 70px;
  border: 1px solid #ede7df;
  background: #fff;
  position: relative;
  z-index: 99;
`;

export const StyledHeaderContainer = styled.div`
  height: inherit;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 30px;
  }

  @media (max-width: 576px) {
    padding: 0 20px;
  }
`;

export const StyledHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  height: inherit;
`;

export const StyledHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;

  @media (max-width: 600px) {
    gap: 15px;
  }

  .book-session-link {
    white-space: nowrap;

    @media (max-width: 768px) {
      // display: none;
      transform: scale(0.8);
    }
  }
`;

export const StyledLogo = styled.div`
  padding-right: 30px;
  margin-right: 30px;
  border-right: 1px solid #ede7df;
  height: inherit;
  display: grid;
  place-items: center;

  img {
    height: 40px;
  }
`;

export const StyledNavLinks = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;

  @media (max-width: 968px) {
    display: none;
  }

  li {
    margin-right: 40px;
    height: inherit;

    a {
      font-weight: 400;
      font-size: 14px;
      line-height: 18px;
      color: #62635e;
      height: inherit;
      display: block;
      text-transform: capitalize;
      padding: 8px 0;
      // transition: all 100ms linear;

      &.active {
        color: #0f100e;
        font-weight: 600;
        border-bottom: 2px solid var(--primary);
      }
    }
  }
`;

export const StyledProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const StyledMenu = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 968px) {
    display: flex;
  }
`;

export const StyledMobileMenu = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  z-index: 100;
  border-top: 0.5px solid rgba(120, 120, 120, 0.2);
  background: #fff;
  display: none;

  @media (max-width: 968px) {
    display: flex;
  }

  > div {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 100%;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      svg {
        width: 24px;
        height: 24px;
      }

      &.active {
        svg {
          path {
            fill: var(--primary);
            fill-opacity: 1;
          }
        }
      }
    }
  }
`;
