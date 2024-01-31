import React, { useState } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { StyledAuthHeader, StyledDiv, StyledContainer, StyledAuthForm } from "./Signup.styled";

import logo from "../../../assets/logo/logo.png";
import AuthSlider from "../AuthSlider";
import { auth, db } from "../../../utils/firebase";
import Step1 from "./Step1";
import { useNavigate } from "react-router-dom";
import { USER_COLLECTION_NAME } from "../../../constants/data";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { config } from "../../../constants/config";
import axios from "axios";

export const step1State = { email: "", password: "", username: "" };

const Signup: React.FC<{ newUser?: boolean }> = () => {
  const [emailError, setEmailError] = useState<string | null>(null);
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
    setEmailError(null);
    const isRegistered = await checkEmailRegistered(values.email);
    if (isRegistered) {
      setEmailError("This email is already registered");
    } else {
      const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await updateProfile(user, { displayName: values.username });
      const userDocRef = doc(db, USER_COLLECTION_NAME, user.uid);

      await setDoc(userDocRef, {
        displayName: values.username,
        email: user.email,
        profileImg: "",
        gender: "",
        designation: "",
        issues: [],
        goals: [],
        interests: [],
        isNewUser: true,
        demoClassBooked: false,
        totalClassBooked: 0,
        updatedAt: Timestamp.now(),
      });

      if (config.BACKEND_URL) {
        axios.post(`${config.BACKEND_URL}/user/welcome-mail`, {
          to: user.email,
          username: values.username,
        });
      }

      await sendEmailVerification(user);
      console.log("MAIL SENT");
      navigate("/verify-mail");
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const data = await signInWithPopup(auth, provider);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledDiv>
      <StyledContainer>
        <StyledAuthHeader>
          <img src={logo} alt="logo" className="logo" />
        </StyledAuthHeader>
        <StyledAuthForm>
          <Step1
            handleSubmit={handleSubmitStep1}
            handleGoogleSignin={handleGoogleSignin}
            emailError={emailError}
          />
        </StyledAuthForm>
      </StyledContainer>
      <p className="text-secondary">2023 Talkgram, All Rights Reserved</p>
      <AuthSlider />
    </StyledDiv>
  );
};

export default Signup;
