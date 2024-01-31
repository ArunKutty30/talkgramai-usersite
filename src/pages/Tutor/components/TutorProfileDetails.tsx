import React from "react";
import styled from "styled-components";

import Avatar from "../../../components/Avatar";
import { ITutorProfileData } from "../../../constants/types";

const TutorProfileDetails: React.FC<{ data: ITutorProfileData | null }> = ({ data }) => {
  return (
    <StyledProfileDetails>
      <StyledProfile>
        <Avatar size={90} profileImg={data?.profileImg} username={data?.username} />
        <div className="tutor-details">
          <h4 className="s-16 mb-10">{data?.username}</h4>
          {/* <p className="s-14">Designation</p> */}
        </div>
      </StyledProfile>
      <div className="ratings mb-24">{/* <span>4.5</span> */}</div>
      <div className="flex-column">
        <h5>Description</h5>
        <p className="s-14">{data?.description}</p>
      </div>
      <div className="flex-column">
        <h5>Interests</h5>
        <StyledTagList>
          {data?.interests.map((interest, i) => (
            <span key={i.toString()} className="tag-variant-one">
              {interest}
            </span>
          ))}
        </StyledTagList>
      </div>
    </StyledProfileDetails>
  );
};

const StyledProfileDetails = styled.div`
  margin-top: calc(-70px - 90px);
  .flex-column {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 24px;

    h5 {
      color: var(--text-primary);
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    p {
      color: var(--gray-3);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 130%;
    }
  }
`;

const StyledProfile = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 15px;

  > .tutor-details {
    display: flex;
    flex-direction: column;
    padding-top: 100px;
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
`;

export default TutorProfileDetails;
