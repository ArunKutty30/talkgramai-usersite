import React from "react";
import { Paper, Typography } from "@mui/material";
import Input from "../Input";
import { Form, Formik } from "formik";
import styled from "styled-components";
import CloseIcon from "../../assets/icons/close.svg";

const paperStyle = {
  width: 600,
  padding: "2rem 5rem",
  borderRadius: "8px",
  background: "white",
  border: "1px solid #EDE7DF",
  position: "relative",
};

const headingStyle = {
  fontSize: "24px",
  fontWeight: 600,
  fontFamily: "Inter",
  wordWrap: "break-word",
  textAlign: "center",
};

const ViewDisputeModal = ({
  dispute,
  closeDisputeModal,
}: {
  dispute: any;
  closeDisputeModal: any;
}) => {
  return (
    <Paper sx={paperStyle}>
      <Typography sx={headingStyle}>Your Dispute</Typography>
      <img
        src={CloseIcon}
        alt="close-icon"
        style={{ position: "absolute", top: "20px", right: "20px", cursor: "pointer" }}
        onClick={closeDisputeModal}
      />
      <Formik
        initialValues={{}}
        onSubmit={() => {
          console.log("submitted");
        }}
      >
        {() => (
          <Form>
            <StyledGrid>
              <div>
                <Input
                  name="issues"
                  value={dispute.issues}
                  label="What issues did you face?"
                  readOnly
                />
              </div>
              <DescriptionContainer>
                <p>Description</p>
                <DescriptionInputContainer>
                  <textarea readOnly placeholder={""} value={dispute.description} rows={5} />
                </DescriptionInputContainer>
              </DescriptionContainer>
              {dispute.response ? (
                <Input
                  name="response"
                  label="How we solved it?"
                  value={dispute.response}
                  readOnly
                />
              ) : (
                <div style={{ color: "var(--error)", fontWeight: "500" }}>
                  We are figuring out a way to solve your dispute. We will get back to you soon.
                </div>
              )}
            </StyledGrid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

const StyledGrid = styled.div`
  padding: 2rem 0;
`;

const DescriptionContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  p {
    display: block;
    color: var(--text-primary);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    text-transform: capitalize;
  }
`;

const DescriptionInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #ede7df;

  > textarea {
    border-radius: 8px;
    outline: none;
    border: none;
    color: var(--black, #000);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 8px 15px;
    resize: none;
    font-family: "Inter", sans-serif;

    &:placeholder {
      color: var(--gray-3);
      font-size: 14px;
      line-height: 1.2;
    }
  }

  ol {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    li {
      font-size: 14px;
    }
  }
`;

export default ViewDisputeModal;
