import React, { useRef, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Circle as CircleIcon, CheckCircle } from "@styled-icons/bootstrap";

import { step3State } from ".";
import {
  FormInput,
  FormInputWrapper,
  StyledDropdownWrapper,
  StyledDropdownHeader,
  StyledDropdownList,
  FormControls,
} from "./Signup.styled";
import { Button } from "../../../components";
import { goals, interests } from "../../../utils/data";
import { useOnClickOutside } from "usehooks-ts";

interface IStep3Props {
  handleSubmit: (values: typeof step3State) => void;
  formValues: typeof step3State | null;
  setFormValues: React.Dispatch<
    React.SetStateAction<{
      goals: string[];
      interests: string[];
    } | null>
  >;
  handlePrev: () => void;
}

const step3ValidationSchema = Yup.object({
  goals: Yup.array()
    .of(Yup.string())
    .min(1, "This field is required")
    .required("This field is required"),
  interests: Yup.array()
    .of(Yup.string())
    .min(1, "This field is required")
    .required("This field is required"),
});

const Step3: React.FC<IStep3Props> = ({ handleSubmit, handlePrev, setFormValues, formValues }) => {
  const [openGoalsDropdown, setOpenGoalsDropdown] = useState(false);
  const [openInterestsDropdown, setOpenInterestsDropdown] = useState(false);
  const goalsRef = useRef(null);
  const interestsRef = useRef(null);

  const handleGoalsClickOutside = () => {
    setOpenGoalsDropdown(false);
  };
  const handleInterestsClickOutside = () => {
    setOpenInterestsDropdown(false);
  };

  useOnClickOutside(goalsRef, handleGoalsClickOutside);
  useOnClickOutside(interestsRef, handleInterestsClickOutside);

  return (
    <Formik
      initialValues={formValues || step3State}
      validationSchema={step3ValidationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <h2 style={{ marginBottom: "10px" }}>Finally, a last step</h2>
          <p style={{ marginBottom: "30px" }}>Getting to know you more. </p>
          <FormInputWrapper>
            <FormInput>
              <label htmlFor="goals">What are your goals</label>
              <StyledDropdownWrapper ref={goalsRef}>
                <StyledDropdownHeader
                  role="button"
                  onClick={() => setOpenGoalsDropdown((d) => !d)}
                  className={openGoalsDropdown ? "active" : ""}
                >
                  <p className="truncate">
                    {values.goals.length
                      ? values.goals.length === 1
                        ? values.goals.join(",")
                        : `${values.goals[0].slice(0, 35)}... +${values.goals.length - 1}`
                      : "Select your goals"}
                  </p>
                </StyledDropdownHeader>
                {openGoalsDropdown && (
                  <StyledDropdownList>
                    {goals.map((goal, index) => (
                      <div
                        key={index.toString()}
                        className={
                          values.goals.some((s) => s.toLowerCase() === goal.toLowerCase())
                            ? "active"
                            : ""
                        }
                        onClick={() => {
                          if (values.goals.some((s) => s.toLowerCase() === goal.toLowerCase())) {
                            setFieldValue(
                              "goals",
                              values.goals.filter((f) => f.toLowerCase() !== goal.toLowerCase())
                            );
                          } else {
                            setFieldValue("goals", [...values.goals, goal.toLowerCase()]);
                          }
                        }}
                      >
                        <p>{goal}</p>
                        {values.goals.some((s) => s.toLowerCase() === goal.toLowerCase()) ? (
                          <CheckCircle color="#F7941F" />
                        ) : (
                          <CircleIcon />
                        )}
                      </div>
                    ))}
                  </StyledDropdownList>
                )}
              </StyledDropdownWrapper>
              <ErrorMessage name="goals" component="div" className="error-text" />
            </FormInput>
          </FormInputWrapper>
          <FormInputWrapper>
            <FormInput>
              <label htmlFor="interests">Choose your interests</label>
              <StyledDropdownWrapper ref={interestsRef}>
                <StyledDropdownHeader
                  role="button"
                  onClick={() => setOpenInterestsDropdown((d) => !d)}
                  className={openInterestsDropdown ? "active" : ""}
                >
                  <p className="truncate">
                    {values.interests.length
                      ? values.interests.length === 1
                        ? values.interests.join(",")
                        : `${values.interests[0].slice(0, 35)}... +${values.interests.length - 1}`
                      : "Select your interests"}
                  </p>
                </StyledDropdownHeader>
                {openInterestsDropdown && (
                  <StyledDropdownList>
                    {interests.map((interest, index) => (
                      <div
                        key={index.toString()}
                        className={
                          values.interests.some((s) => s.toLowerCase() === interest.toLowerCase())
                            ? "active"
                            : ""
                        }
                        onClick={() => {
                          if (
                            values.interests.some((s) => s.toLowerCase() === interest.toLowerCase())
                          ) {
                            setFieldValue(
                              "interests",
                              values.interests.filter(
                                (f) => f.toLowerCase() !== interest.toLowerCase()
                              )
                            );
                          } else {
                            setFieldValue("interests", [
                              ...values.interests,
                              interest.toLowerCase(),
                            ]);
                          }
                        }}
                      >
                        <p>{interest}</p>
                        {values.interests.some(
                          (s) => s.toLowerCase() === interest.toLowerCase()
                        ) ? (
                          <CheckCircle color="#F7941F" />
                        ) : (
                          <CircleIcon />
                        )}
                      </div>
                    ))}
                  </StyledDropdownList>
                )}
              </StyledDropdownWrapper>
              <ErrorMessage name="interests" component="div" className="error-text" />
            </FormInput>
          </FormInputWrapper>
          <FormControls>
            <Button
              variant="secondary"
              style={{ backgroundColor: "transparent" }}
              onClick={() => {
                setFormValues({
                  goals: values.goals,
                  interests: values.interests,
                });
                handlePrev();
              }}
            >
              Back
            </Button>
            <Button disabled={isSubmitting}>
              {isSubmitting ? "Signing in... Please wait" : "Next"}
            </Button>
          </FormControls>
        </Form>
      )}
    </Formik>
  );
};

export default Step3;
