import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import PhoneInput from 'react-phone-input-2';
import VerificationInput from 'react-verification-input';

import 'react-phone-input-2/lib/style.css';
import ReactModal from './ReactModal';
import Backdrop from './Backdrop';
import Button from '../Button';
import { countOccurrences } from '../../utils/helpers';
import { sendOtpService, verifyOtpService } from '../../services/otpService';
import { userStore } from '../../store/userStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

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

interface IVerifyPhoneNumberModalProps {
  isOpen: boolean;
}

const initialValues = { phone: '' };

const VerifyPhoneNumberModal: React.FC<IVerifyPhoneNumberModalProps> = ({ isOpen }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState<string | null>(null);
  const isError = useRef(true);
  const [timer, setTimer] = useState(0);
  const user = userStore((store) => store.user);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

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

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (!user) return;
      console.log(values);
      setLoading(true);
      await sendOtpService(user.uid, `+${values.phone}`);
      setShowVerification(values.phone);
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
      await verifyOtpService(user.uid, verificationCode);

      toast.success('Phone number verified successfully');

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
      await sendOtpService(user.uid, `+${showVerification}`);
      setTimer(60);
      setResendLoading(false);
    } catch (error) {
      console.log(error);
      setResendLoading(false);
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
                <h3>{!showVerification ? 'Verify Mobile Number' : 'Enter the OTP sent to'}</h3>

                {!showVerification ? (
                  <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }) => (
                      <Form className="flex-column">
                        <PhoneInput
                          country={'in'}
                          value={values.phone}
                          onChange={(phone) => setFieldValue('phone', phone)}
                          countryCodeEditable={false}
                          inputProps={{
                            name: 'phone',
                            required: true,
                            autoFocus: true,
                          }}
                          isValid={(value, country: any) => {
                            const stringLength = countOccurrences(country['format'], '.');

                            if (value.length === stringLength) {
                              isError.current = false;
                              return true;
                            } else {
                              isError.current = true;
                              return false;
                            }
                          }}
                        />
                        <Button type="submit" disabled={isError.current || loading}>
                          SEND OTP
                        </Button>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="flex-column">
                    <p style={{ textAlign: 'center' }} className="s-16">
                      +{showVerification}
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

export default VerifyPhoneNumberModal;
