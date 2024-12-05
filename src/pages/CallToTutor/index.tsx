import './styles.css';
import { useCall } from '../../hooks/useCall';
import { userStore } from '../../store/userStore';
import OnlineTutorList from './OnlineTutorList';

export default function CallToTutor() {
  const user = userStore((state) => state.user);
  const { initiateCall } = useCall(user);

  if (!user) return null;

  return (
    <div className="mx pad">
      <OnlineTutorList userId={user.uid} initiateCall={initiateCall} />
    </div>
  );
}
