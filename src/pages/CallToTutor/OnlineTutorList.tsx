import useOnlineUsers, { Tutor } from '../../hooks/useOnlineUsers';
import { SelectTutorCardWrapper } from '../../components/SelectTutor';
import { SelectTutorCard } from '../../components/TutorCard';

export default function OnlineTutorList({
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
        <SelectTutorCardWrapper>
          {onlineUsers.map((tutor) => {
            return (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  initiateCall(tutor);
                }}
                key={tutor.id}
              >
                <SelectTutorCard>
                  <div className="card-image mb-10">
                    {tutor.photoURL ? (
                      <img src={tutor.photoURL} alt="profile" className="card-avatar" />
                    ) : (
                      <div className="profile-text">{tutor.name?.slice(0, 1)}</div>
                    )}
                  </div>
                  <h6 className="mb-8">{tutor.name}</h6>
                </SelectTutorCard>
              </div>
            );
          })}
        </SelectTutorCardWrapper>
      )}
    </div>
  );
}

