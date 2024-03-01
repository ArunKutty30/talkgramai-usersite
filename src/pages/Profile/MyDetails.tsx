import React from 'react';
import { Form, Formik } from 'formik';
import styled from 'styled-components';
import Input from '../../components/Input';
import { userStore } from '../../store/userStore';

const MyDetails = () => {
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);

  if (!user || !profileData) return null;

  const handleSubmit = async (values: any) => {
    try {
      console.log(values);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <StyledContainer>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <StyledGrid>
              <GridOne>
                <Input
                  name="fullname"
                  value={user.displayName as string}
                  label="Full name"
                  readOnly
                />
                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  value={profileData?.phoneNumber || ''}
                  placeholder="+91 9876543210"
                  readOnly
                />
                <Input
                  name="email"
                  label="email"
                  type="email"
                  value={user.email as string}
                  readOnly
                />
                <StyledTagContainer>
                  {profileData.interests.length ? (
                    <>
                      <label>Interests</label>
                      <StyledTagList>
                        {profileData.interests.map((int, i) => (
                          <span key={i.toString()} className="tag-variant-one">
                            {int}
                          </span>
                        ))}
                      </StyledTagList>
                    </>
                  ) : null}
                </StyledTagContainer>
              </GridOne>
              <GridTwo>
                <StyledTagContainer>
                  {profileData.issues.length ? (
                    <>
                      <label>Issues I’m Currently Facing</label>
                      <StyledTagList>
                        {profileData.issues.map((issue, i) => (
                          <span key={i.toString()} className="tag-variant-two">
                            {issue}
                          </span>
                        ))}
                      </StyledTagList>
                    </>
                  ) : null}
                </StyledTagContainer>
                <StyledTagContainer>
                  {profileData.goals.length ? (
                    <>
                      <label>My Goals</label>
                      <StyledTagList>
                        {profileData.goals.map((goal, i) => (
                          <span key={i.toString()} className="tag-variant-two">
                            {goal}
                          </span>
                        ))}
                      </StyledTagList>
                    </>
                  ) : null}
                </StyledTagContainer>
              </GridTwo>
            </StyledGrid>
          </Form>
        )}
      </Formik>
    </StyledContainer>
  );
};

const StyledContainer = styled.section`
  padding-bottom: 50px;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

const GridOne = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const GridTwo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StyledTagContainer = styled.div`
  display: flex;
  flex-direction: column;

  label {
    display: block;
    color: var(--text-primary);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    margin-bottom: 15px;
    text-transform: capitalize;
  }
`;

const StyledTagList = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;

  .tag-variant-one {
    border-radius: 30px;
    border: 1.5px solid #b4b4b3;
    background: var(--white, #fff);
    color: var(--text-primary);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 10px 20px;
    text-transform: capitalize;
  }

  .tag-variant-two {
    border-radius: 8px;
    border: 1px solid var(--primary-1, #f7941f);
    background: var(--primary-2, #fff1e0);
    box-shadow: 0px 1px 8px 0px rgba(31, 103, 251, 0.05);
    color: var(--text-primary);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 10px 20px;
    text-transform: capitalize;
  }
`;

export default MyDetails;
