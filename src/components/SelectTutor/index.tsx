import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";

import SelectInput from "../SelectInput";
import SearchIcon from "../../assets/icons/search.svg";
import { ReactComponent as FilterIcon } from "../../assets/icons/filter.svg";
import { bookSessionFilters } from "../../constants/data";
import TutorProfile from "../../pages/Tutor/TutorProfile";
import TutorCard from "../TutorCard";
import { useBookingFilterStore } from "../../store/useBookingFilterStore";
import { getTutorDoc } from "../../services/tutorService";
import { ITutorProfileData } from "../../constants/types";
import TutorCardLoader from "../Loader/TutorCardLoader";

const SessionCard = styled.div`
  border-radius: 20px;
  border: 0.7px solid #ede7df;
  background: var(--white, #fff);
  padding: 25px;
`;

const SessionHeader = styled.div`
  margin-bottom: 30px;
`;

const SelectTutorFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
  min-height: 45px;
  gap: 15px;

  .input_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 8px;
    border: 1px solid rgba(25, 91, 90, 0.3);
    background: var(--white, #fff);
    max-width: 500px;
    width: 100%;
    gap: 20px;
    padding: 0 16px;

    input {
      padding: 11px 0;
      width: 100%;
      color: var(--text-primary);
      font-size: 14px;
      outline: none;
      border: none;
    }

    img {
      width: 24px;
      height: 24px;
    }
  }
`;

const SelectTutorFilterContainer = styled.div`
  position: relative;

  button {
    display: flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 8px;
    border: 1px solid var(--text-primary);
    background: #fff;
    box-shadow: 0px 1px 3px 0px rgba(72, 72, 72, 0.15);
    cursor: pointer;
  }
`;

const SelectTutorCardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px 60px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const HeaderBlockRight = styled.div`
  display: flex;
  gap: 32px;
  align-items: center;
`;

const StyledDataNotFound = styled.div`
  height: 300px;
  display: grid;
  place-items: center;
  text-align: center;
`;

interface ISelectTutorProps {
  tutors: { tutorId: string; isReserved: boolean }[];
  loading: boolean;
}

const SelectTutor: React.FC<ISelectTutorProps> = ({ tutors, loading }) => {
  const [searchParams] = useSearchParams();
  const tutorId = searchParams.get("tutor");
  const selectedFilter = useBookingFilterStore((store) => store.selectedFilter);
  const searchText = useBookingFilterStore((store) => store.searchText);
  const setSelectedFilter = useBookingFilterStore((store) => store.setSelectedFilter);
  const setSearchText = useBookingFilterStore((store) => store.setSearchText);
  const [tutorsData, setTutorsData] = useState<ITutorProfileData[]>([]);
  const [filteredTutorsData, setFilteredTutorsData] = useState<ITutorProfileData[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleGetTutorData = useCallback(async () => {
    try {
      setIsFetching(true);
      const result = await Promise.all(
        tutors.map(async (tutor) => {
          return await getTutorDoc(tutor.tutorId);
        })
      );

      console.log(result);
      setTutorsData(result);
      setFilteredTutorsData(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  }, [tutors]);

  useEffect(() => {
    handleGetTutorData();
  }, [handleGetTutorData]);

  useMemo(() => {
    if (!searchText) return setFilteredTutorsData(tutorsData);

    setFilteredTutorsData(
      tutorsData
        .map((t) => {
          if (t.username.toLowerCase().includes(searchText.toLowerCase())) {
            return t;
          }
          return null;
        })
        .filter((f) => f !== null) as ITutorProfileData[]
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <SessionCard>
      <SessionHeader>
        <div>
          <h5 className="section-title mb-8">Select your tutor</h5>
          <p className="s-14 mb-20">Start booking your session by selecting your tutor</p>
        </div>
      </SessionHeader>
      <SelectTutorFilterHeader>
        <div className="input_container">
          <input
            type="text"
            placeholder="Search a tutor"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <img src={SearchIcon} alt="search-icon" />
        </div>
        <HeaderBlockRight>
          <SelectTutorFilterContainer>
            <SelectInput
              label={
                <>
                  <span>{selectedFilter ? selectedFilter : "Apply Filter"}</span>
                  <FilterIcon />
                </>
              }
              lists={bookSessionFilters}
              setSelectedList={(value) => setSelectedFilter(value)}
            />
          </SelectTutorFilterContainer>
        </HeaderBlockRight>
      </SelectTutorFilterHeader>
      {loading || isFetching ? (
        <TutorCardLoader />
      ) : !filteredTutorsData.length ? (
        <StyledDataNotFound>
          <p>No Tutors found</p>
        </StyledDataNotFound>
      ) : (
        <SelectTutorCardWrapper>
          {filteredTutorsData.map((tutor, index) => (
            <TutorCard key={index.toString()} {...tutor} />
          ))}
        </SelectTutorCardWrapper>
      )}
      {tutorId && <TutorProfile tutorId={tutorId} />}
    </SessionCard>
  );
};

export default SelectTutor;
