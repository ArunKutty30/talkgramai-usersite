import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { AuthErrorCodes, sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";

import {
  StyledAuthHeader,
  StyledDiv,
  StyledContainer,
  StyledAuthForm,
  FormInput,
  FormInputField,
  FormInputWrapper,
} from "../Login/Login.styled";

import logo from "../../../assets/logo/logo.png";
import { Button } from "../../../components";
import AuthSlider from "../AuthSlider";
import { auth } from "../../../utils/firebase";

const initialState = { email: "" };

const validationSchema = Yup.object({
  email: Yup.string().email("invalid email address").required("This field is required"),
});

const ForgetPassword = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (
    values: typeof initialState,
    actions: FormikHelpers<typeof initialState>
  ) => {
    try {
      setError("");
      await sendPasswordResetEmail(auth, values.email.trim());
      setMessage(
        `Password reset link is sent to ${values.email}.Kindly check the email and reset the password and come again.`
      );
    } catch (error) {
      console.log(error);
      if (error instanceof FirebaseError) {
        if (error.code === AuthErrorCodes.USER_DELETED) {
          console.log("user not found");
          setError("Email is not found");
        }
        actions.setSubmitting(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

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
                  <h2 style={{ marginBottom: "10px" }}>Forget Password</h2>
                  <p className="text-secondary s-16" style={{ marginBottom: "30px" }}>
                    Please enter your email to get password reset link
                  </p>
                  {!message ? (
                    <>
                      <FormInputWrapper>
                        <FormInput>
                          <label htmlFor="email">Email Address</label>
                          <FormInputField>
                            <Field
                              name="email"
                              type="email"
                              placeholder="Enter your email address"
                            />
                          </FormInputField>
                          <ErrorMessage name="email" component="div" className="error-text" />
                        </FormInput>
                        {!isSubmitting && error && <p className="error-text">{error}</p>}
                      </FormInputWrapper>
                      <Button type="submit" size="large" disabled={isSubmitting}>
                        {isSubmitting ? "Please wait..." : "Reset Password"}
                      </Button>
                    </>
                  ) : (
                    <div>
                      <p style={{ marginBottom: "15px" }} className="color-primary">
                        {message}
                      </p>
                      <Link to="/login">
                        <Button>Back to login</Button>
                      </Link>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </>
        </StyledAuthForm>
      </StyledContainer>
      <p className="text-secondary">2023 Talkgram, All Rights Reserved</p>
      <AuthSlider />
    </StyledDiv>
  );
};

export default ForgetPassword;
