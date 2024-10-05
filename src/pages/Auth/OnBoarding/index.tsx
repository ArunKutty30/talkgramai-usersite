import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import {
  StyledAuthHeader,
  StyledDiv,
  StyledAuthHeaderFlex,
  StyledContainer,
  StyledAuthForm,
} from './Signup.styled';

import logo from '../../../assets/logo/logo.png';
import AuthSlider from '../AuthSlider';
import { db } from '../../../utils/firebase';
import Step2 from './Step2';
import Step3 from './Step3';
import { userStore } from '../../../store/userStore';
import { USER_COLLECTION_NAME } from '../../../constants/data';
import { uploadProfileImage } from '../../../services/storageService';
import { generalStore } from '../../../store/generalStore';
import axios from 'axios';
import { config } from '../../../constants/config';

interface IStep2State {
  username: string;
  gender: string;
  designation: string;
  issues: string[];
  profileImg: string;
}

export const step2State: IStep2State = {
  username: '',
  gender: '',
  designation: '',
  issues: [],
  profileImg: '',
};
export const step3State: { goals: string[]; interests: string[] } = { goals: [], interests: [] };

const OnBoarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(Object.assign({}, step2State, step3State));
  const [step2FormValues, setStep2FormValues] = useState<typeof step2State | null>(null);
  const [step3FormValues, setStep3FormValues] = useState<typeof step3State | null>(null);
  const user = userStore((store) => store.user);
  const setIsSignup = generalStore((store) => store.setIsSignup);
  const [profileImg, setProfileImg] = useState<{ file: File; url: string } | null>(null);

  const handleSubmitStep1 = (values: typeof step2State) => {
    setFormData((f) => ({ ...f, ...values }));
    setStep2FormValues(values);
    setCurrentStep((c) => c + 1);
    setIsSignup(true);
  };

  const handleSubmitStep2 = async (values: typeof step3State) => {
    const data = { ...formData, ...values };
    try {
      if (user) {
        const userDocRef = doc(db, USER_COLLECTION_NAME, user.uid);
        await updateProfile(user, { displayName: data.username });
        let profileUrl = '';
        if (profileImg) {
          profileUrl = await uploadProfileImage(user.uid, profileImg.file);
        }
        await setDoc(userDocRef, {
          displayName: data.username,
          email: user.email,
          profileImg: profileUrl,
          gender: data.gender,
          designation: data.designation,
          issues: data.issues,
          goals: data.goals,
          interests: data.interests,
          isNewUser: true,
          demoClassBooked: false,
          totalClassBooked: 0,
        });

        if (config.BACKEND_URL) {
          axios.post(`${config.BACKEND_URL}/user/welcome-mail`, {
            to: user.email,
            username: data.username,
          });
        }

        window.location.href = '/';
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrev = () => {
    setCurrentStep((p) => p - 1);
  };

  return (
    <StyledDiv>
      <StyledContainer>
        <StyledAuthHeader>
          <img src={logo} alt="logo" className="logo" />
          <StyledAuthHeaderFlex>
            <p
              className={currentStep === 1 ? 'active' : currentStep === 3 ? 'inactive' : undefined}
            >
              Step 1
            </p>
            <span>-</span>
            <p className={currentStep === 2 ? 'active' : undefined}>Step 2</p>
          </StyledAuthHeaderFlex>
        </StyledAuthHeader>
        <StyledAuthForm>
          {currentStep === 1 && (
            <Step2
              handleSubmit={handleSubmitStep1}
              formValues={step2FormValues}
              profileImg={profileImg}
              setProfileImg={setProfileImg}
            />
          )}
          {currentStep === 2 && (
            <Step3
              handleSubmit={handleSubmitStep2}
              handlePrev={handlePrev}
              formValues={step3FormValues}
              setFormValues={setStep3FormValues}
            />
          )}
        </StyledAuthForm>
      </StyledContainer>
      <p className="text-secondary">2023 Talkgram, All Rights Reserved</p>
      {/* <AuthSlider /> */}
    </StyledDiv>
  );
};

export default OnBoarding;
