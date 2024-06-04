import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import VerificationInput from 'react-verification-input';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

import ReactModal from './ReactModal';
import Backdrop from './Backdrop';
import Button from '../Button';
import { sendMailOtpService, verifyMailOtpService } from '../../services/otpService';
import { userStore } from '../../store/userStore';

const modalVaraints = {
  initial: {
    opacity: 0,
    scale: 0.5,
    x: '-50%',
    y: '-50%',
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
    scale: 1,
    x: '-50%',
    y: '-50%',
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: '-50%',
    y: '-50%',
  },
};

interface IEmailVerificationModalProps {
  isOpen: boolean;
}

const initialValues = { phone: '' };

const EmailVerificationModal: React.FC<IEmailVerificationModalProps> = ({ isOpen }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const user = userStore((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Timer countdown logic
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(intervalId); // Stop the timer when it reaches 0
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleSubmit = async () => {
    try {
      if (!user) return;
      setLoading(true);
      await sendMailOtpService(user.uid, user?.email || '');
      setShowVerification(user?.email);
      setTimer(60);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data['error']) {
          toast.error(error.response?.data['error'].message);
        } else {
          toast.error('Something went wrong.Please try again later');
        }
      } else {
        toast.error('Something went wrong.Please try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      if (!user) return;
      console.log(verificationCode);
      setLoading(true);
      await verifyMailOtpService(user.uid, verificationCode);

      toast.success('Email verified successfully');

      setTimeout(() => {
        window.location.reload();
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        if (error.response?.data['error']) {
          toast.error(error.response?.data['error'].message);
        } else {
          toast.error('Something went wrong.Please try again later');
        }
      } else {
        toast.error('Something went wrong.Please try again later');
      }
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!user) return;
      setResendLoading(true);
      await sendMailOtpService(user.uid, user?.email || '');
      setTimer(60);
      setResendLoading(false);
    } catch (error) {
      console.log(error);
      setResendLoading(false);
      if (error instanceof AxiosError) {
        if (error.response?.data['error']) {
          toast.error(error.response?.data['error'].message);
        } else {
          toast.error('Something went wrong.Please try again later');
        }
      } else {
        toast.error('Something went wrong.Please try again later');
      }
    }
  };

  return (
    <ReactModal>
      <Backdrop isOpen={isOpen} className="z-90">
        <AnimatePresence>
          {isOpen && (
            <StyledModal
              onClick={(e) => e.stopPropagation()}
              variants={modalVaraints}
              animate="animate"
              initial="initial"
              exit="exit"
            >
              <StyledFormOne>
                <h3>{!showVerification ? 'Please verify your email' : 'Enter the OTP sent to'}</h3>
                {!showVerification && (
                  <p style={{ textAlign: 'center' }}>
                    click the "Get OTP" tab to get OTP to your mail id <b>{user?.email}</b>
                  </p>
                )}
                {!showVerification ? (
                  <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }) => (
                      <Form className="flex-column">
                        <Grid container spacing={2}>
                          <Grid item sm={6} xs={6}>
                            <Button
                              variant="primary-outline"
                              type="button"
                              onClick={() => navigate('/update-email')}
                              fullWidth
                            >
                              Update Email
                            </Button>
                          </Grid>
                          <Grid item sm={6} xs={6}>
                            <Button type="submit" fullWidth disabled={loading}>
                              Get OTP
                            </Button>
                          </Grid>
                        </Grid>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="flex-column">
                    <p style={{ textAlign: 'center' }} className="s-16">
                      {showVerification}
                    </p>
                    <div className="verification-input">
                      <VerificationInput
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e)}
                      />
                    </div>
                    <StyledResendDiv>
                      <p>
                        {timer > 0 ? (
                          `Resend OTP in ${timer} seconds`
                        ) : (
                          <span
                            style={{
                              cursor: resendLoading ? 'no-drop' : 'pointer',
                              pointerEvents: resendLoading ? 'none' : 'auto',
                            }}
                            className="text-primary"
                            onClick={handleResend}
                          >
                            {resendLoading ? 'Resending OTP' : 'Resend OTP'}
                          </span>
                        )}
                      </p>
                    </StyledResendDiv>

                    <Button onClick={verifyOtp} disabled={loading}>
                      Verify
                    </Button>
                  </div>
                )}
              </StyledFormOne>
            </StyledModal>
          )}
        </AnimatePresence>
      </Backdrop>
    </ReactModal>
  );
};

const StyledModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  max-width: 550px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ede7df;
  max-height: 75vh;
  overflow-y: auto;

  @media (max-width: 576px) {
    max-width: 90%;
  }
`;

const StyledFormOne = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h3 {
    text-align: center;
  }

  .flex-column {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .form-control {
      width: 100%;
      height: 44px;
    }
  }

  .vi__container {
    margin: 0 auto;

    @media (max-width: 600px) {
      transform: scale(0.7) translateX(-35px);
    }
  }

  .vi__character {
    border-radius: 8px;
    border: 1px solid #ede7df;
    color: var(--text-primary);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    outline-color: rgba(247, 148, 31, 0.2);

    &.vi__character--inactive {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;

const StyledResendDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export default EmailVerificationModal;
