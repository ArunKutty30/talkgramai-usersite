import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Circle as CircleIcon, CheckCircle } from "@styled-icons/bootstrap";

import { step2State } from ".";
import {
  FormInput,
  FormInputField,
  FormInputWrapper,
  StyledGenderDiv,
  StyledDropdownWrapper,
  StyledDropdownHeader,
  StyledDropdownList,
  ProfileImageInput,
} from "./Signup.styled";
import { designations, issues } from "../../../utils/data";
import { Button } from "../../../components";
import { useOnClickOutside } from "usehooks-ts";

interface IStep2Props {
  handleSubmit: (values: typeof step2State) => void;
  formValues: typeof step2State | null;
  setProfileImg: React.Dispatch<
    React.SetStateAction<{
      file: File;
      url: string;
    } | null>
  >;
  profileImg: {
    file: File;
    url: string;
  } | null;
}

const step2ValidationSchema = Yup.object({
  username: Yup.string().required("This field is required"),
  profileImg: Yup.string(),
  gender: Yup.string().required("This field is required"),
  designation: Yup.string().required("This field is required"),
  issues: Yup.array()
    .of(Yup.string())
    .min(1, "This field is required")
    .required("This field is required"),
});

const Step2: React.FC<IStep2Props> = ({ handleSubmit, formValues, profileImg, setProfileImg }) => {
  const [openDesignationDropdown, setOpenDesignationDropdown] = useState(false);
  const [openIssueDropdown, setOpenIssueDropdown] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = () => {
    setOpenIssueDropdown(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <Formik
      initialValues={formValues || step2State}
      validationSchema={step2ValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, handleBlur, setFieldError, errors }) => (
        <Form>
          <h2 style={{ marginBottom: "10px" }}>Next up, a few details</h2>
          <p style={{ marginBottom: "30px" }}>Tell us a little bit about yourself . </p>
          <FormInputWrapper>
            <div>
              <p className="mb-10">Profile Image</p>
              <ProfileImageInput className="mb-10">
                {profileImg && (
                  <div className="preview-image">
                    <img src={profileImg.url} alt="" />
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
                            setProfileImg({ file: files[0], url: upload.target?.result as string });
                            setFieldValue("profileImg", upload.target?.result as string);
                          };

                          reader.readAsDataURL(files[0]);
                        } else {
                          setFieldError(
                            "profileImg",
                            "File size exceeds the 5MB limit. Please select a smaller file."
                          );
                        }
                      }
                    }}
                  />
                </label>
              </ProfileImageInput>
              {errors && errors.profileImg && <div className="error-text">{errors.profileImg}</div>}
            </div>
            <FormInput>
              <label htmlFor="username">Name</label>
              <FormInputField>
                <Field name="username" type="text" placeholder="Enter your full name" />
              </FormInputField>
              <ErrorMessage name="username" component="div" className="error-text" />
            </FormInput>
            <FormInput>
              <label htmlFor="gender">What’s your gender</label>
              <StyledGenderDiv>
                <button
                  type="button"
                  className={values.gender === "male" ? "active" : ""}
                  onClick={() => setFieldValue("gender", "male")}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={values.gender === "female" ? "active" : ""}
                  onClick={() => setFieldValue("gender", "female")}
                >
                  Female
                </button>
                <button
                  type="button"
                  className={values.gender === "others" ? "active" : ""}
                  onClick={() => setFieldValue("gender", "others")}
                >
                  Others
                </button>
              </StyledGenderDiv>
              <ErrorMessage name="gender" component="div" className="error-text" />
            </FormInput>
            <FormInput>
              <label htmlFor="designation">Designation</label>
              <StyledDropdownWrapper>
                <StyledDropdownHeader
                  role="button"
                  onClick={() => setOpenDesignationDropdown((d) => !d)}
                  className={openDesignationDropdown ? "active" : ""}
                >
                  <p className="truncate">
                    {values.designation ? values.designation : "Select your designation"}
                  </p>
                </StyledDropdownHeader>
                {openDesignationDropdown && (
                  <StyledDropdownList>
                    {designations.map((des, index) => (
                      <div
                        key={index.toString()}
                        className={
                          des.toLowerCase() === values.designation.toLowerCase() ? "active" : ""
                        }
                        onClick={() => {
                          setFieldValue("designation", des.toLowerCase());
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
              <ErrorMessage name="designation" component="div" className="error-text" />
            </FormInput>
            <FormInput>
              <label htmlFor="issues">What issues do you face in English?</label>
              <StyledDropdownWrapper ref={ref}>
                <StyledDropdownHeader
                  role="button"
                  onClick={() => setOpenIssueDropdown((d) => !d)}
                  className={openIssueDropdown ? "active" : ""}
                >
                  <p className="truncate">
                    {values.issues.length
                      ? values.issues.length === 1
                        ? values.issues.join(",")
                        : `${values.issues[0].slice(0, 35)}... +${values.issues.length - 1}`
                      : "Select the issues that you face with English"}
                  </p>
                </StyledDropdownHeader>
                {openIssueDropdown && (
                  <StyledDropdownList>
                    {issues.map((issue, index) => (
                      <div
                        key={index.toString()}
                        className={
                          values.issues.some((s) => s.toLowerCase() === issue.toLowerCase())
                            ? "active"
                            : ""
                        }
                        onClick={() => {
                          if (values.issues.some((s) => s.toLowerCase() === issue.toLowerCase())) {
                            setFieldValue(
                              "issues",
                              values.issues.filter((f) => f.toLowerCase() !== issue.toLowerCase())
                            );
                          } else {
                            setFieldValue("issues", [...values.issues, issue.toLowerCase()]);
                          }
                          // setOpenIssueDropdown(false);
                        }}
                      >
                        <p>{issue}</p>
                        {values.issues.some((s) => s.toLowerCase() === issue.toLowerCase()) ? (
                          <CheckCircle color="#F7941F" />
                        ) : (
                          <CircleIcon />
                        )}
                      </div>
                    ))}
                  </StyledDropdownList>
                )}
              </StyledDropdownWrapper>
              <ErrorMessage name="issues" component="div" className="error-text" />
            </FormInput>
          </FormInputWrapper>
          <Button>Next</Button>
        </Form>
      )}
    </Formik>
  );
};

export default Step2;
