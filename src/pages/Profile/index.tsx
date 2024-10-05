import React, { useState } from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

import { Button } from '../../components';
import MyDetails from './MyDetails';
import MySubscriptions from './MySubcsriptions';
import Transactions from './Transactions';
import FavouriteTutors from './FavouriteTutors';
import { userStore } from '../../store/userStore';
import EditProfileModal from '../../components/Modal/EditProfileModal';
import Avatar from '../../components/Avatar';
import LogoutModal from '../../components/Modal/LogoutModal';
import FeedbackAnalysis from './FeedbackAnalysis';

const Profile = () => {
  const user = userStore((store) => store.user);
  const profileData = userStore((store) => store.profileData);
  const [editProfile, setEditProfile] = useState(false);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  return (
    <StyledProfile>
      <StyledProfileContainer>
        <div className="banner-image"></div>
        <StyledProfileSection className="pad">
          <div className="flex-between">
            <div className="block-left">
              <Avatar
                size={90}
                profileImg={profileData?.profileImg}
                username={user?.displayName || user?.email}
              />
              <div className="ml-20">
                <h4 className="s-16">{user && user.displayName}</h4>
                {/* <p className="s-14">Designation</p> */}
              </div>
            </div>
            <div className="block-right">
              <Button variant="secondary" onClick={() => setEditProfile(true)}>
                <EditIcon fontSize={'medium'} style={{ marginRight: '8px' }} />
                <span>Edit Details</span>
              </Button>
              <Button variant="error" onClick={() => setOpenLogoutModal(true)}>
                <LogoutIcon fontSize={'medium'} style={{ marginRight: '8px' }} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </StyledProfileSection>
      </StyledProfileContainer>
      <div className="pad">
        <StyledProfileLinks>
          <NavLink to="my-details">My Details</NavLink>
          <NavLink to="my-subscriptions">My Subscriptions</NavLink>
          <NavLink to="transactions">Transactions</NavLink>
          <NavLink to="favourite-tutors">Favourite Tutors</NavLink>
          {/* <NavLink to="feedback-analysis">Feedback Analysis</NavLink> */}
        </StyledProfileLinks>
        <Routes>
          <Route path="/" element={<Navigate to="my-details" />} />
          <Route index path="/my-details" element={<MyDetails />} />
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/favourite-tutors" element={<FavouriteTutors />} />
          <Route path="/feedback-analysis" element={<FeedbackAnalysis />} />
        </Routes>
      </div>
      {user && profileData && editProfile && (
        <EditProfileModal
          isOpen={editProfile}
          handleClose={() => setEditProfile(false)}
          {...profileData}
          displayName={user.displayName}
        />
      )}
      {openLogoutModal && (
        <LogoutModal isOpen={openLogoutModal} handleClose={() => setOpenLogoutModal(false)} />
      )}
    </StyledProfile>
  );
};

const StyledProfile = styled.div`
  background: #fff;
`;

const StyledProfileContainer = styled.div`
  .banner-image {
    background: #fceede;
    height: 150px;
  }
`;

const StyledProfileSection = styled.section`
  .flex-between {
    margin-top: -35px;
    align-items: flex-end;

    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
  }

  .block-left {
    display: flex;
    align-items: center;

    img {
      // width: 190px;
      // height: 190px;
      // border-radius: 50%;
      // border: 1.2px solid #fff;
      // margin-right: 20px;
    }
  }

  .block-right {
    display: flex;
    gap: 15px;
  }
`;

const StyledProfileLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px 0;
  margin-bottom: 30px;
  border-bottom: 1px solid #ecf0ef;
  overflow-x: auto;

  a {
    color: var(--gray-3);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    white-space: nowrap;

    &.active {
      color: var(--primary-1, #f7941f);
      font-weight: 500;
    }
  }
`;

export default Profile;
