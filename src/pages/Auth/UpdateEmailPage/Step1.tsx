import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { step1State } from '.';
import { FormInput, FormInputField, FormInputWrapper } from './Signup.styled';
import { Button } from '../../../components';

interface IStep1Props {
  handleSubmit: (values: typeof step1State) => void;
  emailError: string | null;
}

const step1ValidationSchema = Yup.object({
  email: Yup.string().email('invalid email address').required('This field is required'),
});

const Step1: React.FC<IStep1Props> = ({ handleSubmit, emailError }) => {
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={step1State}
        validationSchema={step1ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <h2 style={{ marginBottom: '10px' }}>Change email address</h2>
            <p className="text-secondary s-16" style={{ marginBottom: '30px', lineHeight: '1.3' }}>
              Enter your new email address.
            </p>
            <FormInputWrapper>
              <FormInput>
                <label htmlFor="email">Email Address</label>
                <FormInputField>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email address"
                  />
                </FormInputField>
                <ErrorMessage name="email" component="div" className="error-text" />
              </FormInput>
              {emailError && <div className="error-text">{emailError}</div>}
            </FormInputWrapper>
            <Button size="large" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Please wait...' : 'Change email'}
            </Button>
            <button
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                marginTop: '20px',
                color: 'var(--primary)',
                padding: '12px 0',
                width: 'fit-content',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            >
              Back To Home
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Step1;
