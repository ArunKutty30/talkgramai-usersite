import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { Formik, Form } from "formik";
import PhoneInput from "react-phone-input-2";
import VerificationInput from "react-verification-input";

import "react-phone-input-2/lib/style.css";
import ReactModal from "./ReactModal";
import Backdrop from "./Backdrop";
import Button from "../Button";

const modalVaraints = {
  initial: {
    opacity: 0,
    scale: 0.5,
    x: "-50%",
    y: "-50%",
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
    scale: 1,
    x: "-50%",
    y: "-50%",
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: "-50%",
    y: "-50%",
  },
};

interface IVerifyPhoneNumberModalProps {
  isOpen: boolean;
}

const initialValues = { phone: "" };

const VerifyPhoneNumberModal: React.FC<IVerifyPhoneNumberModalProps> = ({ isOpen }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);

  const handleSubmit = async (values?: typeof initialValues) => {
    try {
      console.log(values);
      setShowVerification(true);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyOtp = async () => {
    try {
      console.log(verificationCode);
      // const newuser = await confirmationResult?.confirm(verificationCode);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ReactModal>
      <Backdrop isOpen={isOpen}>
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
                <h3>Verify Mobile Number</h3>

                {!showVerification ? (
                  <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                    {({ values, setFieldValue }) => (
                      <Form className="flex-column">
                        <PhoneInput
                          country={"us"}
                          value={values.phone}
                          onChange={(phone) => setFieldValue("phone", phone)}
                          countryCodeEditable={false}
                          inputProps={{
                            name: "phone",
                            required: true,
                            autoFocus: true,
                          }}
                          isValid={(value, country: any) => {
                            console.log(value, country);
                            if (value.match(/12345/)) {
                              return "Invalid value: " + value + ", " + country.name;
                            } else if (value.match(/1234/)) {
                              return false;
                            } else {
                              return true;
                            }
                          }}
                        />
                        <div id="sign-in-button"></div>
                        <Button type="submit">Sent OTP</Button>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <div className="flex-column">
                    <div className="verification-input">
                      <VerificationInput
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e)}
                      />
                      <div>
                        <span>Resend</span>
                      </div>
                    </div>
                    <Button onClick={verifyOtp}>Verify</Button>
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

export default VerifyPhoneNumberModal;
