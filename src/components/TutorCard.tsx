import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg';

import { ITutorProfileData } from '../constants/types';
import { updateUserFavouriteTutorsDoc } from '../services/userService';
import { userStore } from '../store/userStore';
import Rating from './Rating';

const TutorCard: React.FC<ITutorProfileData> = ({
  id: tutorId,
  username,
  profileImg,
  totalRatings,
  totalRatingsCount,
}) => {
  const [, setSearchParams] = useSearchParams();

  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const refetchUser = userStore((store) => store.refetchUser);
  const [loading, setLoading] = useState(false);
  const [isFavouriteTutor, setIsFavouriteTutor] = useState(
    Boolean(
      profileData &&
        profileData['favouriteTutors'] &&
        profileData.favouriteTutors.some((s) => s === tutorId)
    )
  );

  const handleAddFavouriteTutor = async () => {
    try {
      if (!user) return;
      setLoading(true);
      if (!isFavouriteTutor) setIsFavouriteTutor(true);
      else setIsFavouriteTutor(false);
      await updateUserFavouriteTutorsDoc(user.uid, tutorId);
      console.log('FAVOURITE TUTOR ADDED');
      refetchUser();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        setSearchParams({ tutor: tutorId });
      }}
    >
      <SelectTutorCard>
        <div className="card-image mb-10">
          {profileImg ? (
            <img src={profileImg} alt="profile" className="card-avatar" />
          ) : (
            <div className="profile-text">{username?.slice(0, 1)}</div>
          )}
        </div>
        <h6 className="mb-8">{username}</h6>
        {/* <p className="s-14 mb-15 truncate">M.A, M.Phil, PHD, Professor... </p> */}
        <div className="flex-between">
          <Rating
            rating={Math.ceil((totalRatings || 0) / (totalRatingsCount || 0))}
            iconSize={20}
          />
          <button
            disabled={loading}
            type="button"
            className="standard-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleAddFavouriteTutor();
            }}
          >
            <HeartIcon fill={isFavouriteTutor ? 'rgb(204, 44, 61)' : 'none'} />
          </button>
        </div>
        {/* <div className={i.toString() === selectedTutor ? "radio active" : "radio"}></div> */}
      </SelectTutorCard>
    </div>
  );
};

const SelectTutorCard = styled.div`
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #ede7df;
  background: var(--white, #fff);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  position: relative;
  cursor: pointer;

  &:hover {
    border: 1px solid #ffdcb3;
    background: #fff6e9;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }

  .card-image {
    width: 100%;
    aspect-ratio: 16/12;
    border-radius: 6px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 6px;
      object-position: center;
    }

    .profile-text {
      background: var(--primary);
      border-radius: 8px;
      display: grid;
      height: 100%;
      place-items: center;
      font-size: 48px;
      color: var(--white, #fff);
    }
  }

  h6 {
    color: #000;
    font-size: 16px;
    font-weight: 500;
  }

  p {
    color: var(--gray-2, #62635e);
    font-size: 14px;
  }

  .flex-between {
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: 24px;
      height: 24px;
    }

    .standard-icon {
      all: unset;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;

      svg {
        width: 20px;
        height: 20px;
      }

      &:hover {
        background-color: var(--white, #fff);
      }
    }
  }

  .viewmore-link {
    color: var(--primary-1, #f7941f);
    font-size: 14px;
    text-decoration-line: underline;
  }

  .radio {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #62635e;

    &.active {
      border: 5px solid var(--primary);
    }
  }
`;

export default TutorCard;
