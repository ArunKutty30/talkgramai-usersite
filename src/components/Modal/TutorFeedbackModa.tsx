import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorMessage, Form, Formik } from "formik";

import Backdrop from "./Backdrop";
import ReactModal from "./ReactModal";

import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ReactComponent as StarIcon } from "../../assets/icons/star.svg";
import { IBookingSession, INewTutorFeedback } from "../../constants/types";
import { grammerFeedback, skillsLable, vocabularyFeedback } from "../../constants/data";
import Button from "../Button";
import {
  fluencyFeedbackItems,
  grammerTitles,
  pronunciationFeedbackItems,
  vocabulary,
} from "../../utils/data";

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

interface ITutorFeedbackModal extends IBookingSession {
  isOpen: boolean;
  handleClose?: () => void;
  id: string;
  feedbackFromTutor?: INewTutorFeedback;
}

const initialValues = {
  status: "COMPLETED",
  confidenceRating: 0,
  fluencyRating: 0,
  pronounciationRating: 0,
  vocabulary: "",
  grammer: { tenses: "", articlesAndPrepositions: "", subjectVerb: "", other: "" },
  skills: {
    confidence: 0,
    passion: 0,
    listeningComprehension: 0,
    conversationBuilding: 0,
  },
};

const TutorFeedbackModal: React.FC<ITutorFeedbackModal> = ({
  isOpen,
  handleClose,
  feedbackFromTutor,
}) => {
  if (!feedbackFromTutor) return null;

  return (
    <ReactModal>
      <Backdrop handleClose={handleClose} isOpen={isOpen}>
        <AnimatePresence>
          {isOpen && (
            <StyledFeedbackModal
              onClick={(e) => e.stopPropagation()}
              variants={modalVaraints}
              animate="animate"
              initial="initial"
              exit="exit"
            >
              <ProfileContainer>
                <div className="flex-between">
                  <div className="flex">
                    <div className="flex-column">
                      <h3>Tutor Feedback</h3>
                    </div>
                  </div>
                  <div role="button" className="pointer" onClick={handleClose}>
                    <CloseIcon />
                  </div>
                </div>
              </ProfileContainer>
              <Formik
                initialValues={feedbackFromTutor}
                onSubmit={() => {
                  return;
                }}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form>
                    <StlyedFeedbackForm>
                      <div className="flex-column">
                        <p className="title">User Status</p>
                        <StyledTagList>
                          <span
                            className={
                              values.status === "COMPLETED"
                                ? "tag-variant-one success"
                                : "tag-variant-one"
                            }
                          >
                            Joined
                          </span>
                          <span
                            className={
                              values.status === "MISSED"
                                ? "tag-variant-one error"
                                : "tag-variant-one"
                            }
                          >
                            Missed
                          </span>
                        </StyledTagList>
                      </div>
                      {values.status === "COMPLETED" && (
                        <>
                          <h4>Interaction Analysis</h4>
                          {Object.keys(initialValues["skills"]).map((k) => (
                            <div className="flex-column" key={k}>
                              <p className="title" style={{ textTransform: "capitalize" }}>
                                {skillsLable[k as keyof typeof skillsLable]}
                              </p>
                              <StyledNumberList>
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <span
                                    className={
                                      values.skills[k as keyof (typeof values)["skills"]] === i + 1
                                        ? "active"
                                        : ""
                                    }
                                    key={i.toString()}
                                  >
                                    {i + 1}
                                  </span>
                                ))}
                              </StyledNumberList>
                              <ErrorMessage
                                name={`skills.${k}`}
                                className="error-text"
                                component="div"
                              />
                            </div>
                          ))}
                          <h4>Language Proficiency</h4>

                          {/** -------- FLUENCY FEEDACK --------*/}

                          <div className="flex-column">
                            <div className="flex-between">
                              <p className="title">Fluency</p>
                              <div>
                                <StyledStarList>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                      className={i + 1 <= values.fluency.rating ? "active" : ""}
                                      key={i.toString()}
                                    >
                                      <StarIcon />
                                    </span>
                                  ))}
                                </StyledStarList>
                                <ErrorMessage
                                  name="fluency.rating"
                                  className="error-text"
                                  component="div"
                                />
                              </div>
                            </div>
                            <div>
                              <StyledEmojiList>
                                {fluencyFeedbackItems.map((data, j) => (
                                  <div
                                    className={values.fluency.feedback === data ? "active" : ""}
                                    key={j.toString()}
                                  >
                                    <p>{data}</p>
                                  </div>
                                ))}
                              </StyledEmojiList>
                            </div>
                          </div>

                          {/** -------- FLUENCY FEEDACK --------*/}

                          {/** -------- PRONUNCIATION FEEDACK --------*/}

                          <div className="flex-column">
                            <div className="flex-between">
                              <p className="title">Pronunciation</p>
                              <div>
                                <StyledStarList>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <span
                                      className={
                                        i + 1 <= values.pronunciation.rating ? "active" : ""
                                      }
                                      key={i.toString()}
                                    >
                                      <StarIcon />
                                    </span>
                                  ))}
                                </StyledStarList>
                                <ErrorMessage
                                  name="pronunciation.rating"
                                  className="error-text"
                                  component="div"
                                />
                              </div>
                            </div>
                            <div>
                              <StyledEmojiList>
                                {pronunciationFeedbackItems.map((data, j) => (
                                  <div
                                    className={
                                      values.pronunciation.feedback === data.name ? "active" : ""
                                    }
                                    key={j.toString()}
                                  >
                                    <p>{data.name}</p>
                                  </div>
                                ))}
                              </StyledEmojiList>
                              <ErrorMessage
                                name="pronunciation.feedback"
                                className="error-text"
                                component="div"
                              />
                            </div>
                          </div>

                          {/** -------- PRONUNCIATION FEEDACK --------*/}

                          {/** -------- VOCABULARY FEEDACK --------*/}

                          <div className="flex-column">
                            <p className="title">Vocabulary</p>
                            <StyledEmojiList>
                              {vocabularyFeedback.map((data, j) => (
                                <div
                                  className={values.vocabulary.general === data ? "active" : ""}
                                  key={j.toString()}
                                >
                                  <p>{data}</p>
                                </div>
                              ))}
                            </StyledEmojiList>
                            <ErrorMessage
                              name="vocabulary.general"
                              className="error-text"
                              component="div"
                            />
                          </div>

                          <div className="flex-column">
                            <p className="title">{vocabulary.vocabularyRange.name}</p>
                            <StyledEmojiList>
                              {vocabulary.vocabularyRange.options.map((data, j) => (
                                <div
                                  className={values.vocabulary.range === data ? "active" : ""}
                                  key={j.toString()}
                                >
                                  <p>{data}</p>
                                </div>
                              ))}
                            </StyledEmojiList>
                            <ErrorMessage
                              name="vocabulary.range"
                              className="error-text"
                              component="div"
                            />
                          </div>

                          <div className="flex-column">
                            <p className="title">{vocabulary.wordChoicePrecision.name}</p>
                            <StyledEmojiList>
                              {vocabulary.wordChoicePrecision.options.map((data, j) => (
                                <div
                                  className={
                                    values.vocabulary.wordChoicePrecision === data ? "active" : ""
                                  }
                                  key={j.toString()}
                                >
                                  <p>{data}</p>
                                </div>
                              ))}
                            </StyledEmojiList>
                            <ErrorMessage
                              name="vocabulary.wordChoicePrecision"
                              className="error-text"
                              component="div"
                            />
                          </div>

                          {/** -------- VOCABULARY FEEDACK --------*/}

                          {/** -------- GRAMMER FEEDACK --------*/}

                          <h5>Grammar</h5>
                          <div className="flex-column" style={{ gap: "20px" }}>
                            <div className="flex-column" style={{ order: 1 }}>
                              <p className="title">Most Errors (Tenses)</p>
                              <StyledEmojiList>
                                {["past", "present", "future"].map((data, j) => (
                                  <div
                                    className={values.grammar.mostErrors === data ? "active" : ""}
                                    key={j.toString()}
                                  >
                                    <p>{data}</p>
                                  </div>
                                ))}
                              </StyledEmojiList>
                            </div>
                            {grammerTitles.map((title, index) => (
                              <div
                                key={index.toString()}
                                className="flex-column"
                                style={{ order: index === 0 ? 0 : index + 1 }}
                              >
                                <p className="title">{title.name}</p>
                                <StyledEmojiList>
                                  {grammerFeedback.map((data, j) => (
                                    <div
                                      className={
                                        values.grammar[
                                          title.value as keyof (typeof values)["grammar"]
                                        ] === data
                                          ? "active"
                                          : ""
                                      }
                                      key={j.toString()}
                                    >
                                      <p>{data}</p>
                                    </div>
                                  ))}
                                </StyledEmojiList>
                                <ErrorMessage
                                  name={`grammar.${title.value}`}
                                  className="error-text"
                                  component="div"
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex-column">
                            <label htmlFor="feedback title">Grammar feedback</label>
                            <textarea readOnly style={{ height: "auto", minHeight: 200 }}>
                              {values.grammar.other}
                            </textarea>
                          </div>

                          {/** -------- GRAMMER FEEDBACK --------*/}

                          {values.generalFeedback && (
                            <div className="flex-column">
                              <h5>General Feedback</h5>
                              <p>{values.generalFeedback}</p>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex-between place-center">
                        {!feedbackFromTutor && (
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting your feedback" : "Submit"}
                          </Button>
                        )}
                      </div>
                    </StlyedFeedbackForm>
                  </Form>
                )}
              </Formik>
            </StyledFeedbackModal>
          )}
        </AnimatePresence>
      </Backdrop>
    </ReactModal>
  );
};

const StyledFeedbackModal = styled(motion.div)`
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

const ProfileContainer = styled.div`
  padding: 20px;
  background: #fceede;

  .flex-between {
    align-items: flex-start;

    > .flex {
      display: inline-flex;
      align-items: flex-start;

      .profile_img {
        width: 46px;
        height: 46px;
        border-radius: 50%;
        margin-right: 20px;
      }
    }
  }

  > .flex-center {
    gap: 30px;
  }
`;

const StlyedFeedbackForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  padding: 30px;
  // pointer-events: none;

  .flex-column {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .title {
      font-weight: 600;
    }
  }

  .flex-between {
    width: 100%;
  }

  textarea {
    border-radius: 8px;
    border: 1px solid #ede7df;
    color: var(--text-primary);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    width: 100%;
    padding: 10px 20px;
    outline-color: rgba(247, 148, 31, 0.2);
    resize: none;
    font-family: Inter;
    overflow-y: auto;
  }
`;

const StyledEmojiList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  > div {
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 20px;
    border: 1px solid var(--gray-2, #62635e);
    padding: 5px 14px;
    text-transform: capitalize;
    background-color: transparent;
    transition: background-color 100ms linear;

    &.active {
      background-color: #fceede;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const StyledStarList = styled.div`
  display: flex;

  > span {
    &.active {
      svg path {
        fill: var(--primary);
      }
    }
  }
`;

const StyledNumberList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  > span {
    font-size: 14px;
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 50%;
    border: 1px solid var(--primary);

    &.active {
      background-color: var(--primary);
    }
  }
`;

const StyledTagList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex-wrap: wrap;
  gap: 15px;
  width: 100%;

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
    text-align: center;
    font-weight: 600;

    &.active {
      border: 1px solid var(--primary-1, #f7941f);
      background: var(--primary-2, #fff1e0);
      box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    }

    &.success {
      border: 1px solid var(--primary-1, #f7941f);
      background: var(--primary-2, #fff1e0);
      box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    }

    &.error {
      border: 1px solid var(--error, #f7941f);
      background: rgba(204, 44, 61, 0.3);
      box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    }
  }
`;

export default TutorFeedbackModal;
