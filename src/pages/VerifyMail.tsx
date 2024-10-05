import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { auth } from '../utils/firebase';
import { Button } from '../components';
import { userStore } from '../store/userStore';
import { generalStore } from '../store/generalStore';
import { StyledAuthHeader, StyledContainer, StyledDiv } from './Auth/Login/Login.styled';
import AuthSlider from './Auth/AuthSlider';
import logo from '../assets/logo/logo.png';

const VerifyMail = () => {
  const setShowHeader = generalStore((store) => store.setShowHeader);
  const user = userStore((store) => store.user);
  const navigate = useNavigate();
  const [send, setSending] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    setShowHeader(false);
  }, [setShowHeader]);

  useEffect(() => {
    return onAuthStateChanged(auth, (data) => {
      console.log(data);
      if (data) {
        if (data.emailVerified) return navigate('/');
        // updateUser(data);
        // getUserData(data);
      } else {
        navigate('/login');
        // setTimeout(() => {
        //   updateFetching(false);
        // }, 0);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCheckVerify = async () => {
    try {
      if (!user) return;
      await user.reload();
      // if (user.emailVerified) navigate("/onboarding");
      if (user.emailVerified) {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async () => {
    try {
      if (!user) return;
      setSending(true);
      await sendEmailVerification(user);
      console.log('EMAIL SENT');
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.log(error);
    } finally {
      setLogoutLoading(true);
    }
  };

  return (
    <StyledDiv>
      <StyledContainer>
        <StyledAuthHeader>
          <img src={logo} alt="logo" className="logo" />
        </StyledAuthHeader>
        <StyledVerifyMailWrapper>
          <h3>Verify your email address</h3>
          <p style={{ fontSize: '1rem' }}>
            To start using Simple Trade, confirm your email address with the email we sent to <br />
            <strong>{user?.email}</strong>
          </p>
          <Button onClick={() => handleCheckVerify()}>Click here once verified</Button>
          <Button
            disabled={send}
            className="secondary-btn"
            variant="secondary"
            onClick={() => handleResend()}
          >
            {send ? 'Resending...' : 'Resend'}
          </Button>
          <Button
            disabled={logoutLoading}
            className="secondary-btn"
            variant="secondary"
            onClick={() => handleLogout()}
          >
            {logoutLoading ? 'Redirecting...' : 'Back to login'}
          </Button>
        </StyledVerifyMailWrapper>
      </StyledContainer>
      {/* <AuthSlider /> */}
    </StyledDiv>
  );
};

const StyledVerifyMailWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 15px;
  width: 100%;

  .secondary-btn {
    background-color: transparent;
    transition: background-color 200ms ease-in;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;

export default VerifyMail;
