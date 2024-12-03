import React from 'react';
import useOnlineUsers, { Tutor } from '../../hooks/useOnlineUsers';
import CallIcon from '@mui/icons-material/Call';
import styled from 'styled-components';
import { Button } from '../../components';

function OnlineTutorList({
  initiateCall,
}: {
  initiateCall: (tutor: Tutor) => Promise<string | null>;
}) {
  const onlineUsers = useOnlineUsers();

  return (
    <div>
      {!onlineUsers.length ? (
        <div>
          <p>No online Tutors found</p>
        </div>
      ) : (
        <StyledGrid>
          {onlineUsers.map((tutor) => {
            return (
              <div key={tutor.id} className="card">
                <div className="flex-column">
                  <StyledAvatar>
                    {tutor.photoURL ? (
                      <img src={tutor.photoURL} alt="profile" />
                    ) : (
                      <b>{tutor.name.charAt(0)}</b>
                    )}
                  </StyledAvatar>
                  <div>
                    <strong>{tutor.name}</strong>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    initiateCall(tutor);
                  }}
                  style={{ backgroundColor: '#0bbb14' }}
                  fullWidth
                >
                  <CallIcon />
                  <span style={{ marginLeft: 8, fontSize: 16 }}>Call</span>
                </Button>
              </div>
            );
          })}
        </StyledGrid>
      )}
    </div>
  );
}

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 50px 0px;

  .card {
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgb(255, 255, 255);
    padding: 25px;
    cursor: pointer;
    transition: background-color 200ms linear;
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;

    .flex-column {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
      gap: 8px;
      text-align: center;

      strong {
        font-size: 16px;
      }
    }
  }
`;

const StyledAvatar = styled.div`
  border-radius: 50%;
  background: var(--primary);
  width: 50%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 50px;

  b {
    font-size: 40px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export default OnlineTutorList;
