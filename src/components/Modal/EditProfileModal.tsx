import React, { useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { Circle as CircleIcon, CheckCircle } from '@styled-icons/bootstrap';
import { ErrorMessage, Form, Formik } from 'formik';

import Backdrop from './Backdrop';
import Button from '../Button';

import { ReactComponent as ClockIcon } from '../../assets/icons/close.svg';
import Input from '../Input';
import { IUserProfileData, ITransactionStatus } from '../../constants/types';
import {
  designations,
  goals as goalsData,
  interests as interestsData,
  issues as issuesData,
} from '../../utils/data';
import Avatar from '../Avatar';
import { updateProfile } from 'firebase/auth';
import { userStore } from '../../store/userStore';
import { db } from '../../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { USER_COLLECTION_NAME } from '../../constants/data';
import { uploadProfileImage } from '../../services/storageService';
import {
  FormInput,
  StyledDropdownHeader,
  StyledDropdownList,
  StyledDropdownWrapper,
} from '../../pages/Auth/OnBoarding/Signup.styled';

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

interface IEditProfileModal extends Omit<IUserProfileData, 'displayName'> {
  isOpen: boolean;
  handleClose?: () => void;
  displayName: string | null;
}

const EditProfileModal: React.FC<IEditProfileModal> = ({
  isOpen,
  handleClose,
  displayName,
  goals,
  interests,
  issues,
  designation,
  gender,
  profileImg,
}) => {
  const [step, setStep] = useState(1);
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const updateProfileData = userStore((store) => store.updateProfileData);
  const [status, setStatus] = useState<ITransactionStatus>();
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [openDesignationDropdown, setOpenDesignationDropdown] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      if (!user) return;
      console.log(values);
      let profileUrl = '';

      setStatus(ITransactionStatus.PENDING);
      if (displayName) {
        await updateProfile(user, { displayName: values.displayName });
      }

      if (image) {
        profileUrl = await uploadProfileImage(user.uid, image.file);
      } else {
        profileUrl = profileImg;
      }

      const userDocRef = doc(db, USER_COLLECTION_NAME, user.uid);

      await updateDoc(userDocRef, {
        gender: values.gender,
        designation: values.designation,
        issues: values.issues,
        goals: values.goals,
        interests: values.interests,
        displayName: values.displayName,
        profileImg: profileUrl,
      });

      const updatedDoc = await getDoc(userDocRef);
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data() as IUserProfileData;
        updateProfileData(updatedData);
      }

      user.reload();

      setStatus(ITransactionStatus.SUCCESSFUL);
      setTimeout(() => {
        if (handleClose) handleClose();
      }, 3000);
    } catch (error) {
      console.log(error);
      setStatus(ITransactionStatus.FAILED);
    }
  };

  return (
    <Backdrop handleClose={handleClose} isOpen={isOpen}>
      <AnimatePresence>
        {isOpen && (
          <StyledEditProfileModal
            onClick={(e) => e.stopPropagation()}
            variants={modalVaraints}
            animate="animate"
            initial="initial"
            exit="exit"
          >
            <Container>
              <div className="header flex-between">
                <div className="flex">
                  <Avatar username={displayName} size={60} />
                  <div className="flex-column ml-20">
                    <h5>{user?.displayName}</h5>
                    {/* <p>Qualification</p> */}
                  </div>
                </div>
                <div role="button" className="pointer" onClick={handleClose}>
                  <ClockIcon />
                </div>
              </div>
              <Formik
                initialValues={{
                  designation: designation,
                  gender: gender,
                  goals: goals,
                  interests: interests,
                  issues: issues,
                  displayName,
                  profileImg,
                  phoneNumber: profileData?.phoneNumber || '',
                }}
                onSubmit={handleSubmit}
              >
                {({ values, setFieldValue, isSubmitting, handleBlur }) => (
                  <Form>
                    <StyledFormContainer>
                      {step === 1 && (
                        <div className="flex-column">
                          <div className="input-container">
                            <ProfileImageInput className="mb-10">
                              {(profileImg || image) && (
                                <div className="preview-image">
                                  {image ? (
                                    <img src={image.url} alt="" />
                                  ) : (
                                    <img src={profileImg} alt="" />
                                  )}
                                </div>
                              )}
                              <label htmlFor="profileImg">
                                <span>+</span>
                                <input
                                  id="profileImg"
                                  name="profileImg"
                                  onBlur={handleBlur}
                                  type="file"
                                  hidden
                                  accept=".png,.jpeg,.jpg,.svg,.webp"
                                  onChange={(e) => {
                                    const files = e.target.files;

                                    if (files && files.length) {
                                      if (files[0].size <= 5 * 1024 * 1024) {
                                        const reader = new FileReader();

                                        reader.onload = (upload) => {
                                          setImage({
                                            file: files[0],
                                            url: upload.target?.result as string,
                                          });
                                          setFieldValue(
                                            'profileImg',
                                            upload.target?.result as string
                                          );
                                        };

                                        reader.readAsDataURL(files[0]);
                                      } else {
                                        // setFieldError(
                                        //   "profileImg",
                                        //   "File size exceeds the 5MB limit. Please select a smaller file."
                                        // );
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </ProfileImageInput>
                            <Input label={'Full Name'} name={'displayName'} />
                            {/* <Input label={'Designation'} name={'designation'} /> */}
                            <FormInput>
                              <label
                                htmlFor="designation"
                                style={{
                                  color: ' var(--text-primary)',
                                  fontSize: '16px',
                                  fontWeight: 500,
                                }}
                              >
                                Designation
                              </label>
                              <StyledDropdownWrapper>
                                <StyledDropdownHeader
                                  role="button"
                                  onClick={() => setOpenDesignationDropdown((d) => !d)}
                                  className={openDesignationDropdown ? 'active' : ''}
                                  style={{ padding: '10px 20px' }}
                                >
                                  <p className="truncate" style={{ fontSize: '1rem' }}>
                                    {values.designation
                                      ? values.designation
                                      : 'Select your designation'}
                                  </p>
                                </StyledDropdownHeader>
                                {openDesignationDropdown && (
                                  <StyledDropdownList>
                                    {designations.map((des, index) => (
                                      <div
                                        key={index.toString()}
                                        className={
                                          des.toLowerCase() === values.designation.toLowerCase()
                                            ? 'active'
                                            : ''
                                        }
                                        onClick={() => {
                                          setFieldValue('designation', des.toLowerCase());
                                          setOpenDesignationDropdown(false);
                                        }}
                                      >
                                        <p>{des}</p>
                                        {des.toLowerCase() === values.designation.toLowerCase() ? (
                                          <CheckCircle color="#F7941F" />
                                        ) : (
                                          <CircleIcon />
                                        )}
                                      </div>
                                    ))}
                                  </StyledDropdownList>
                                )}
                              </StyledDropdownWrapper>
                              <ErrorMessage
                                name="designation"
                                component="div"
                                className="error-text"
                              />
                            </FormInput>
                            <Input
                              label={'Phone Number'}
                              name={'phoneNumber'}
                              readOnly
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <Button onClick={() => setStep(2)}>Next</Button>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="flex-column">
                          <h6 className="mb-10">My Interests</h6>
                          <p className="mb-20">Select your area of interest</p>
                          <StyledTagList>
                            {interestsData.map((mappedData, i) => (
                              <span
                                key={i.toString()}
                                className={
                                  values.interests.some(
                                    (s) => s.toLowerCase() === mappedData.toLowerCase()
                                  )
                                    ? 'tag-variant-one active'
                                    : 'tag-variant-one'
                                }
                                onClick={() => {
                                  if (
                                    values.interests.some(
                                      (s) => s.toLowerCase() === mappedData.toLowerCase()
                                    )
                                  ) {
                                    setFieldValue(
                                      'interests',
                                      values.interests.filter(
                                        (f) => f.toLowerCase() !== mappedData.toLowerCase()
                                      )
                                    );
                                  } else {
                                    setFieldValue('interests', [
                                      ...values.interests,
                                      mappedData.toLowerCase(),
                                    ]);
                                  }
                                }}
                              >
                                {mappedData}
                              </span>
                            ))}
                          </StyledTagList>
                          <Button onClick={() => setStep(3)}>Next</Button>
                        </div>
                      )}
                      {step === 3 && (
                        <div className="flex-column">
                          <h6 className="mb-10">My Current Goals</h6>
                          <p className="mb-20">Select your current goals</p>
                          <StyledTagList>
                            {goalsData.map((mappedData, i) => (
                              <span
                                key={i.toString()}
                                className={
                                  values.goals.some(
                                    (s) => s.toLowerCase() === mappedData.toLowerCase()
                                  )
                                    ? 'tag-variant-one active'
                                    : 'tag-variant-one'
                                }
                                onClick={() => {
                                  if (
                                    values.goals.some(
                                      (s) => s.toLowerCase() === mappedData.toLowerCase()
                                    )
                                  ) {
                                    setFieldValue(
                                      'goals',
                                      values.goals.filter(
                                        (f) => f.toLowerCase() !== mappedData.toLowerCase()
                                      )
                                    );
                                  } else {
                                    setFieldValue('goals', [
                                      ...values.goals,
                                      mappedData.toLowerCase(),
                                    ]);
                                  }
                                }}
                              >
                                {mappedData}
                              </span>
                            ))}
                          </StyledTagList>
                          <Button onClick={() => setStep(4)}>Next</Button>
                        </div>
                      )}
                      {step === 4 && (
                        <div className="flex-column">
                          <h6 className="mb-10">My Current Issues</h6>
                          <p className="mb-20">Select the issues you are currently facing</p>
                          <StyledTagList>
                            {issuesData.map((mappedData, i) => (
                              <span
                                key={i.toString()}
                                className={
                                  values.issues.some(
                                    (s) => s.toLowerCase() === mappedData.toLowerCase()
                                  )
                                    ? 'tag-variant-one active'
                                    : 'tag-variant-one'
                                }
                                onClick={() => {
                                  if (
                                    values.issues.some(
                                      (s) => s.toLowerCase() === mappedData.toLowerCase()
                                    )
                                  ) {
                                    setFieldValue(
                                      'issues',
                                      values.issues.filter(
                                        (f) => f.toLowerCase() !== mappedData.toLowerCase()
                                      )
                                    );
                                  } else {
                                    setFieldValue('issues', [
                                      ...values.issues,
                                      mappedData.toLowerCase(),
                                    ]);
                                  }
                                }}
                              >
                                {mappedData}
                              </span>
                            ))}
                          </StyledTagList>
                          {status === ITransactionStatus.SUCCESSFUL ? (
                            <p className="successful-toaster">Your Profile has been Updated !!</p>
                          ) : (
                            <Button type="submit" disabled={isSubmitting}>
                              Confirm Changes
                            </Button>
                          )}
                        </div>
                      )}
                    </StyledFormContainer>
                  </Form>
                )}
              </Formik>
            </Container>
          </StyledEditProfileModal>
        )}
      </AnimatePresence>
    </Backdrop>
  );
};

const StyledEditProfileModal = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--card-background);
  max-width: 900px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #ede7df;

  @media (max-width: 576px) {
    max-width: 90%;
  }
`;

const Container = styled.div`
  padding: 20px;

  .header {
    align-items: flex-start;
  }
`;

const StyledFormContainer = styled.div`
  max-width: 580px;
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;

  .flex-column {
    display: flex;
    flex-direction: column;

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    > button {
      margin-top: 20px;
    }
  }

  h6 {
    color: var(--text-primary);
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .successful-toaster {
    color: var(--primary-1, #f7941f);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    padding: 12px 24px;
    text-align: center;
    margin-top: 20px;
  }
`;

const StyledTagList = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;

  .tag-variant-one {
    border-radius: 8px;
    border: 1px solid rgba(204, 204, 204, 0.8);
    background: var(--white, #fff);
    box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    color: var(--text-primary);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 10px 20px;
    transition: all 200ms linear;
    cursor: pointer;

    &.active {
      border: 1px solid var(--primary-1, #f7941f);
      background: var(--primary-2, #fff1e0);
      box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    }
  }
`;

export const ProfileImageInput = styled.div`
  display: flex;
  gap: 10px;

  .preview-image {
    width: 92px;
    height: 92px;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  label {
    display: block;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    border: 1px solid #ede7df;
    background-color: #f0f7f6;
    text-align: center;
    cursor: pointer;

    span {
      line-height: 92px;
      font-size: 30px;
    }
  }
`;

export default EditProfileModal;
