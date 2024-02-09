import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import { userStore } from "../../../store/userStore";
import TutorCard from "../../../components/TutorCard";
import { ITutorProfileData } from "../../../constants/types";
import { getTutorDoc } from "../../../services/tutorService";
import TutorCardLoader from "../../../components/Loader/TutorCardLoader";
import TutorProfile from "../../Tutor/TutorProfile";
// import TutorCard from "../../../components/TutorCard";

const FavouriteTutors = () => {
  const profileData = userStore((store) => store.profileData);
  const [tutorsData, setTutorsData] = useState<ITutorProfileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const tutorId = searchParams.get("tutor");

  const handleGetTutorData = useCallback(async () => {
    try {
      setLoading(true);
      if (profileData?.favouriteTutors) {
        setTutorsData(
          await Promise.all(
            profileData?.favouriteTutors.map(async (tutor) => {
              return await getTutorDoc(tutor);
            })
          )
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [profileData]);

  useEffect(() => {
    handleGetTutorData();
  }, [handleGetTutorData]);

  return (
    <StyledContainer>
      {!profileData ||
      !profileData["favouriteTutors"] ||
      !profileData["favouriteTutors"]?.length ? (
        <StyledNoFavouriteTutors>
          <p>No Favourite tutors</p>
        </StyledNoFavouriteTutors>
      ) : loading ? (
        <TutorCardLoader />
      ) : (
        <StyledTutorCardWrapper>
          {tutorsData?.map((tutor) => (
            <TutorCard key={tutor.id} {...tutor} />
          ))}
        </StyledTutorCardWrapper>
      )}
      {tutorId && <TutorProfile tutorId={tutorId} />}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  padding-bottom: 30px;
`;

const StyledTutorCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 270px));
  gap: 20px 90px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const StyledNoFavouriteTutors = styled.div`
  min-height: 300px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default FavouriteTutors;
