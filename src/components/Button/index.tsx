import React, { ReactNode } from 'react';
import styled from 'styled-components';
import Button, { ButtonProps } from '@mui/material/Button';

interface IButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'error' | 'error-filled' | 'primary-outline';
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

const StyledButton = styled(Button)`
  font-family: 'Inter';
  border: 1px solid transparent;
  outline: none;
  border-radius: 8px;
  padding: 11px 24px;
  cursor: pointer;
  box-sizing: border-box;
  font-weight: 500;
  text-transform: capitalize !important;

  &.btn-primary {
    background: var(--btn-primary);
    opacity: 1;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: white;
    border-radius: 8px;
  }

  &.btn-primary-outline {
    background-color: transparent;
    opacity: 1;
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    color: var(--text-primary);
    border-radius: 8px;
    border: 1px solid #59419d;
  }

  &.btn-secondary {
    padding: 11px 24px;
    font-weight: 600;
    line-height: 22px;
    border-radius: 8px;
    // border: 1px solid #000;
    background-color: #eeeded;
    white-space: nowrap;
    color: black;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.02);
  }

  &.btn-error {
    border-radius: 8px;
    // border: 1px solid var(--error);
    color: var(--error);
    background: transparent;
    transition: all 200ms linear;
    line-height: 22px;
    border-radius: 6px;
    border: 1px solid #ff8c8c;
    background: rgba(255, 52, 52, 0.14);
    font-weight: 600;

    &:hover {
      border: 1px solid var(--error);
      color: var(--error);
    }
  }

  &.btn-error-filled {
    border-radius: 8px;
    border: 1px solid var(--error, tomato);
    color: #fff;
    background-color: var(--error, tomato);
    transition: all 200ms linear;
    line-height: 22px;

    &:hover {
      color: var(--error);
    }
  }

  &.btn-small {
    padding: 8px 18px;
  }

  &.btn-medium {
    padding: 11px 24px;
  }

  &.btn-large {
    padding: 11px 36px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: no-drop;
  }
`;

const MyButton: React.FC<IButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  ...rest
}) => {
  return (
    <StyledButton className={`btn-${variant} btn-${size}`} {...rest}>
      {children}
    </StyledButton>
  );
};

export default React.memo(MyButton);
