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

    &:disabled {
      cursor: no-drop;
    }

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

export const StyledAuthHeader = styled.div`
  margin-bottom: 80px;
`;

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
