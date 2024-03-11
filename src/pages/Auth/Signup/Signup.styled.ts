import styled from 'styled-components';

export const StyledDiv = styled.div`
  height: 100vh;
  overflow-y: auto;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  @media (max-width: 768px) {
    text-align: center;
  }

  .logo {
    height: 40px;
  }

  .secondary-auth-btn {
    background: #ffffff;
    border: 1px solid #eae8e5;
    box-shadow: 0px 1px 8px rgba(31, 103, 251, 0.05);
    border-radius: 8px;
    padding: 12px 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    cursor: pointer;

    span {
      margin-left: 10px;
      font-size: 14px;
      line-height: 22px;
      color: var(--text-secondary);
    }
  }
`;

export const StyledContainer = styled.div`
  width: 50%;
  margin-bottom: 150px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const StyledAuthHeader = styled.div``;

export const StyledAuthHeaderFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 30px;

  > p,
  span {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #bfbfbf;

    &.active {
      font-weight: 500;
      color: var(--primary);
    }
    &.inactive {
      font-weight: 400;
      color: #ffca8c;
    }
  }
`;

export const StyledAuthForm = styled.div`
  margin-top: 80px;
  max-width: 480px;
  width: 100%;

  form {
    display: flex;
    flex-direction: column;
  }
`;

export const FormInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 36px;
`;

export const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  label {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: var(--text-secondary);
    text-align: left;
  }

  input {
    margin: 10px 0 5px;
  }

  .error-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    color: var(--text-error);
  }
`;

export const FormInputField = styled.div`
  position: relative;

  input {
    width: 100%;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
    color: var(--text-primary);
    padding: 14px 20px;
    background: #fff4fb;
    border: 1px solid rgba(25, 91, 90, 0.3);
    border-radius: 8px;

    &:focus {
      border: 1px solid transparent;
      outline: 1px solid var(--primary);
    }
  }

  .icon {
    position: absolute;
    top: calc(50%);
    right: 16px;
    width: 18px;
    height: 18px;
    transform: translate(0, -50%);
    cursor: pointer;
  }
`;

export const StyledGenderDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
  margin: 10px 0 5px;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
    border-radius: 8px;
    outline: none;
    background: #ffffff;
    border: 1px solid #eae8e5;
    box-shadow: 0px 1px 8px rgba(31, 103, 251, 0.05);
    transition: all 200ms linear;
    cursor: pointer;

    &.active {
      background: #fddfbc;
      border: 1px solid #f7941f;
    }
  }
`;

export const StyledDropdownWrapper = styled.div`
  margin: 10px 0 5px;
  position: relative;
  font-size: 14px;
`;

export const StyledDropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #ffffff;
  border: 1px solid #eae8e5;
  box-shadow: 0px 1px 8px rgba(31, 103, 251, 0.05);
  cursor: pointer;
  border-radius: 8px;

  &.active {
    border-radius: 8px 8px 0 0;
    border-bottom: none;
  }
`;

export const StyledDropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 0 0 7px;
  background-color: var(--dropdown-bg);
  border: 1px solid #eae8e5;
  border-top: none;
  box-shadow: 0px 1px 8px rgba(31, 103, 251, 0.05);
  z-index: 1;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 20px;
    border-bottom: 0.7px solid #d2d2d2;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 200ms linear;
    font-weight: 400;

    &:hover {
      background-color: #f5f5f5;
    }

    &.active {
      color: var(--text-primary);
      font-weight: 500;
    }

    &:last-child {
      border-bottom: none;
    }

    > p {
      width: 100%;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const FormControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

export const ProfileImageInput = styled.div`
  display: flex;
  gap: 10px;

  .preview-image {
    width: 92px;
    height: 92px;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  label {
    display: block;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    border: 1px solid #ede7df;
    background-color: #f0f7f6;
    text-align: center;
    cursor: pointer;

    span {
      line-height: 92px;
      font-size: 30px;
    }
  }
`;
