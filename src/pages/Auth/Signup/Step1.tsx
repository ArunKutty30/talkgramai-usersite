import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { EyeFill } from 'styled-icons/bootstrap';
import { EyeSlashFill } from 'styled-icons/bootstrap';

import { step1State } from '.';
import { FormInput, FormInputField, FormInputWrapper } from './Signup.styled';
import { Button } from '../../../components';
import Google from '../../../assets/icons/google.svg';

interface IStep1Props {
  handleSubmit: (values: typeof step1State) => void;
  handleGoogleSignin: () => Promise<void>;
  emailError: string | null;
}

const step1ValidationSchema = Yup.object({
  username: Yup.string().max(30, 'maximum 30 characters').required('This field is required'),
  email: Yup.string().email('invalid email address').required('This field is required'),
  password: Yup.string().min(8, 'minimum 8 characters required').required('This field is required'),
});

const Step1: React.FC<IStep1Props> = ({ handleSubmit, handleGoogleSignin, emailError }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Formik
        initialValues={step1State}
        validationSchema={step1ValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <h2 style={{ marginBottom: '10px' }}>Welcome!</h2>
            <p className="text-secondary s-16" style={{ marginBottom: '30px', lineHeight: '1.3' }}>
              Create an account on Talkgram & start your journey fluent English on the go{' '}
            </p>
            <FormInputWrapper>
              <FormInput>
                <label htmlFor="username">Username</label>
                <FormInputField>
                  <Field
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                  />
                </FormInputField>
                <ErrorMessage name="username" component="div" className="error-text" />
              </FormInput>
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
              <FormInput>
                <label htmlFor="password">Password</label>
                <FormInputField>
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                  />
                  {showPassword ? (
                    <div className="icon" onClick={() => setShowPassword(false)}>
                      <EyeFill />
                    </div>
                  ) : (
                    <div className="icon" onClick={() => setShowPassword(true)}>
                      <EyeSlashFill />
                    </div>
                  )}
                </FormInputField>
                <ErrorMessage name="password" component="div" className="error-text" />
              </FormInput>
              {emailError && <div className="error-text">{emailError}</div>}
            </FormInputWrapper>
            <Button size="large" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verifing mail...' : 'Lets Start Creating Your Account'}
            </Button>
          </Form>
        )}
      </Formik>
      <p className="text-secondary" style={{ margin: '30px 0', textAlign: 'center' }}>
        or
      </p>
      <div>
        <button className="secondary-auth-btn" onClick={() => handleGoogleSignin()}>
          <img src={Google} alt="google logo" />
          <span>Google</span>
        </button>
      </div>
      <p className="text-secondary" style={{ marginTop: '30px', textAlign: 'center' }}>
        Already have an account?&nbsp;
        <Link to="/login" className="primary">
          Login here
        </Link>
      </p>
    </>
  );
};

export default Step1;
