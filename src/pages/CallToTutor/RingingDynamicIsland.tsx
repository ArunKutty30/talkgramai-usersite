import { CallDismiss, CallInbound } from 'styled-icons/fluentui-system-filled';
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
  isIncoming: boolean;
  onAccept: () => void;
};

const DynamicAction = ({ onReject, callStatus, isIncoming, onAccept }: CallInfoProps) => {
  return (
    <div className="call-position">
      <DynamicIsland id="dynamic-blob">
        <DynamicContainer className="dynamic-container">
          <div className="relative-flex w-100">
            <DynamicTitle className="dynamic-title">
              <Avatar
                className="avatar"
                username={isIncoming ? callStatus.callerName : callStatus.receiverName}
              />
              <div>{isIncoming ? 'Incoming Call from ' + callStatus.callerName : 'ringing...'}</div>
            </DynamicTitle>
            <div className="call-controls">
              <CallDismiss onClick={onReject} className="call-add bg-red" />
              {isIncoming && <CallInbound onClick={onAccept} className="call-add bg-green ml-20" />}
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
