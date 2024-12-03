
import { CallDismiss } from 'styled-icons/fluentui-system-filled';
import Avatar from '../../components/Avatar';
import {
    DynamicContainer,
    DynamicIsland,
    DynamicIslandProvider,
    DynamicTitle,
} from '../../components/DynamicIsland';
import { CallStatus } from '../../hooks/useCall';
import './styles.css';

type CallInfoProps = {
  onReject: () => void;
  callStatus: CallStatus;
};

const DynamicAction = ({ onReject, callStatus }: CallInfoProps) => {
  return (
    <div className="call-position">
      <DynamicIsland id="dynamic-blob">
        <DynamicContainer className="dynamic-container">
          <div className="relative-flex w-100">
            <DynamicTitle className="dynamic-title">
              <Avatar username={callStatus.receiverName} />
              <div>ringing...</div>
            </DynamicTitle>
            <div className="relative-flex">
              <CallDismiss onClick={onReject} className="call-add bg-red" />
            </div>
          </div>
        </DynamicContainer>
      </DynamicIsland>
    </div>
  );
};

export function RingingDynamicIsland(props: CallInfoProps) {
  return (
    <DynamicIslandProvider initialSize="large">
      <div>
        <DynamicAction {...props} />
      </div>
    </DynamicIslandProvider>
  );
}
