import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  AuthErrorCodes,
} from 'firebase/auth';
import { Link } from 'react-router-dom';
import { EyeFill } from 'styled-icons/bootstrap';
import { EyeSlashFill } from 'styled-icons/bootstrap';
import { FirebaseError } from 'firebase/app';

import {
  StyledAuthHeader,
  StyledDiv,
  StyledContainer,
  StyledAuthForm,
  FormInput,
  FormInputField,
  FormInputWrapper,
} from './Login.styled';

import logo from '../../../assets/logo/logo.png';
import Google from '../../../assets/icons/google.svg';
import { Button } from '../../../components';
import AuthSlider from '../AuthSlider';
import { auth } from '../../../utils/firebase';

const initialState = { email: '', password: '' };

const validationSchema = Yup.object({
  email: Yup.string().email('invalid email address').required('This field is required'),
  password: Yup.string().min(8, 'minimum 8 characters required').required('This field is required'),
});

const Login = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: typeof initialState,
    actions: FormikHelpers<typeof initialState>
  ) => {
    try {
      await signInWithEmailAndPassword(auth, values.email.trim(), values.password.trim());
    } catch (error) {
      console.log(error);
      if (error instanceof FirebaseError) {
        if (error.code === AuthErrorCodes.USER_DELETED) {
          console.log('user not found');
          setError('username or password is invalid');
        }
        if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
          setError('username or password is invalid');
        }
        actions.setSubmitting(false);
      }
    }
  };

  const handleGoogleSignin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const data = await signInWithPopup(auth, provider);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledDiv>
      <StyledContainer>
        <StyledAuthHeader>
          <img src={logo} alt="logo" className="logo" />
        </StyledAuthHeader>
        <StyledAuthForm>
          <>
            <Formik
              initialValues={initialState}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <h2 style={{ marginBottom: '10px' }}>Welcome back!</h2>
                  <p
                    className="text-secondary s-16"
                    style={{ marginBottom: '30px', lineHeight: '1.3' }}
                  >
                    Please enter the credentials to access your account
                  </p>
                  <FormInputWrapper>
                    <FormInput>
                      <label htmlFor="email">Email Address</label>
                      <FormInputField>
                        <Field name="email" type="email" placeholder="Enter your email address" />
                      </FormInputField>
                      <ErrorMessage name="email" component="div" className="error-text" />
                    </FormInput>
                    <FormInput>
                      <label htmlFor="password">Password</label>
                      <FormInputField>
                        <Field
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
                      <div className="flex justify-end">
                        <Link to="/forget-password" className="text-primary">
                          Forgot Password?
                        </Link>
                      </div>
                    </FormInput>
                    {!isSubmitting && error && <p className="error-text">{error}</p>}
                  </FormInputWrapper>
                  <Button size="large" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Please wait...' : 'Login'}
                  </Button>
                </Form>
              )}
            </Formik>
            <p className="text-secondary" style={{ margin: '30px 0', textAlign: 'center' }}>
              or
            </p>
            <div>
              <button
                className="secondary-auth-btn"
                disabled={loading}
                onClick={() => handleGoogleSignin()}
              >
                <img src={Google} alt="google logo" />
                <span style={{ fontWeight: '600' }}>
                  {loading ? 'Loading...' : 'Continue with Google'}
                </span>
              </button>
            </div>
            <p className="text-secondary" style={{ marginTop: '30px', textAlign: 'center' }}>
              Don&#39;t have an account?&nbsp;
              <Link to="/signup" className="primary">
                Create Account
              </Link>
            </p>
          </>
        </StyledAuthForm>
      </StyledContainer>
      <p className="text-secondary">2023 Talkgram, All Rights Reserved</p>
      <AuthSlider />
    </StyledDiv>
  );
};

export default Login;
