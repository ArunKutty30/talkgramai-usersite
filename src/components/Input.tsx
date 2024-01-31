import { ErrorMessage, Field } from "formik";
import React, { InputHTMLAttributes } from "react";
import styled from "styled-components";

interface IFormInput extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const Input: React.FC<IFormInput> = ({ label, name, type = "text", ...rest }) => {
  return (
    <StyledFormInput>
      <label htmlFor={name}>{label}</label>
      <StyledInput id={name} name={name} type={type} {...rest} />
      <ErrorMessage name={name} component="div" className="error-input" />
    </StyledFormInput>
  );
};

const StyledFormInput = styled.div`
  display: flex;
  flex-direction: column;

  label {
    display: block;
    color: var(--text-primary);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 10px;
    text-transform: capitalize;
  }

  .error-input {
    color: tomato;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const StyledInput = styled(Field)`
  border-radius: 8px;
  border: 1px solid #ede7df;
  color: var(--text-primary);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  padding: 10px 20px;
  outline-color: rgba(247, 148, 31, 0.2);
`;

export default Input;
