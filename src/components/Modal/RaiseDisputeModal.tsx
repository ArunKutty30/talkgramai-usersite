import React, { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";
import { collection, onSnapshot, query, where, addDoc } from "firebase/firestore";
import { Form, Formik } from "formik";
import styled from "styled-components";

import { DISPUTE_COLLECTION_NAME } from "../../constants/data";
import { db } from "../../utils/firebase";
import Input from "../Input";
import CloseIcon from "../../assets/icons/close.svg";
import Button from "../Button";

const paperStyle = {
  width: 600,
  padding: "2rem",
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

const RaiseDisputeModal = ({
  user,
  sessionId,
  setDisputeStatus,
  closeModal,
}: {
  user: any;
  sessionId: string;
  setDisputeStatus: any;
  closeModal: any;
}) => {
  const [dispute, setDispute] = useState({
    issues: "",
    description: "",
    response: "",
  });
  const [formData, setFormData] = useState({
    issues: dispute.issues,
    description: dispute.description,
    response: dispute.response,
  });

  console.log("mera", user);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const colRef = collection(db, DISPUTE_COLLECTION_NAME);

      // Add the data to the Firestore collection
      await addDoc(colRef, {
        sessionId,
        userId: user,
        ...formData,
        status: "pending",
        dateOfIssue: new Date(),
      });
      closeModal();
      console.log("Data added to the collection.");
    } catch (error) {
      console.error("Error adding data to the collection:", error);
    }
  };

  useEffect(() => {
    const colRef = collection(db, DISPUTE_COLLECTION_NAME);
    const q = query(colRef, where("sessionId", "==", sessionId));

    const getDispute = onSnapshot(
      q,
      (snapshot) => {
        const slots: any[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          slots.push({
            ...data,
          });
        });
        setDispute({
          ...dispute,
          ...slots[0],
        });
        setFormData({
          ...formData,
          ...slots[0],
        });
        setDisputeStatus(dispute.issues && dispute.description ? "View" : "Raise");
      },
      (error) => {
        console.error("Error fetching upcoming sessions:", error);
      }
    );

    return () => {
      getDispute();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={paperStyle}>
      <Typography sx={headingStyle}>
        {dispute.issues && dispute.description ? "View" : "Raise"} Dispute
      </Typography>
      <img
        src={CloseIcon}
        alt="close-icon"
        style={{ position: "absolute", top: "2rem", right: "2rem", cursor: "pointer" }}
        onClick={closeModal}
      />
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <StyledGrid>
              <div>
                <Input
                  name="issues"
                  readOnly={!!(dispute.issues && dispute.description)}
                  label="What issues did you face?"
                  value={formData.issues}
                  onChange={handleInputChange}
                />
              </div>
              <DescriptionContainer>
                <p>Description</p>
                <DescriptionInputContainer>
                  <textarea
                    readOnly={!!(dispute.issues && dispute.description)}
                    placeholder={""}
                    value={formData.description}
                    onChange={handleInputChange}
                    name="description"
                    rows={5}
                  />
                </DescriptionInputContainer>
              </DescriptionContainer>
              {dispute.response ? (
                <Input
                  name="response"
                  label="How we solved it?"
                  value={formData.response}
                  readOnly={!!(dispute.issues && dispute.description)}
                />
              ) : (
                <>
                  {dispute.issues && dispute.description && (
                    <div style={{ color: "var(--error)", fontWeight: "500" }}>
                      We are figuring out a way to solve your dispute. We will get back to you soon.
                    </div>
                  )}
                </>
              )}
            </StyledGrid>
          </Form>
        )}
      </Formik>
      {!(dispute.issues && dispute.description) && (
        <div style={{ textAlign: "center" }}>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{ width: "100%" }}
            disabled={!formData.issues || !formData.description}
          >
            Submit
          </Button>
        </div>
      )}
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

export default RaiseDisputeModal;
