import React, { useState } from 'react';
import { fetchSignInMethodsForEmail, updateEmail } from 'firebase/auth';

import { StyledAuthHeader, StyledDiv, StyledContainer, StyledAuthForm } from './Signup.styled';
import logo from '../../../assets/logo/logo.png';
import AuthSlider from '../AuthSlider';
import { auth } from '../../../utils/firebase';
import Step1 from './Step1';
import { userStore } from '../../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import toast from 'react-hot-toast';

export const step1State = { email: '', password: '', username: '' };

const UpdateEmailPage: React.FC<{ newUser?: boolean }> = () => {
  const [emailError, setEmailError] = useState<string | null>(null);
  const user = userStore((store) => store.user);
  const navigate = useNavigate();

  const checkEmailRegistered = async (email: string) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      return false;
    }
  };

  const handleSubmitStep1 = async (values: typeof step1State) => {
    try {
      setEmailError(null);

      if (!user) return;

      const isRegistered = await checkEmailRegistered(values.email);
      if (isRegistered) {
        setEmailError('This email is already registered');
      } else {
        await updateEmail(user, values.email);
        navigate('/');
      }
    } catch (error) {
      console.log(error);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/requires-recent-login') {
          toast.error('Login expired. please login and try again');
          await auth.signOut();
          navigate('/');
        }
      }
    }
  };

  return (
    <StyledDiv>
      <StyledContainer>
        <StyledAuthHeader>
          <img src={logo} alt="logo" className="logo" />
        </StyledAuthHeader>
        <StyledAuthForm>
          <Step1 handleSubmit={handleSubmitStep1} emailError={emailError} />
        </StyledAuthForm>
      </StyledContainer>
      <p className="text-secondary">2023 Simple Trade, All Rights Reserved</p>
      {/* <AuthSlider /> */}
    </StyledDiv>
  );
};

export default UpdateEmailPage;
