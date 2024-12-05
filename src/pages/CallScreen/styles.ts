import styled from 'styled-components';

export const Container = styled.div`
  height: calc(100vh - 70px);
  @media (max-width: 768px) {
    height: calc(100vh - 70px - 60px);
  }
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

export const VideoGrid = styled.div`
  flex: 1;
  padding: 1rem;
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const ParticipantContainer = styled.div`
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(217, 217, 217, 0.11);
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(217, 217, 217, 0.11);
`;

export const Avatar = styled.span`
  font-size: 3rem;
  color: #ffffff;
  background-color: #1a73e8;
  border-radius: 50%;
  width: 6rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ParticipantInfo = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ParticipantName = styled.span`
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
`;

export const StatusIcons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const StatusIcon = styled.span`
  background-color: rgba(220, 53, 69, 0.9);
  padding: 0.25rem;
  border-radius: 4px;
  color: #ffffff;
`;

export const ControlBarContainer = styled.div`
  background: rgba(217, 217, 217, 0.11);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
`;

export const ControlsWrapper = styled.div`
  max-width: 64rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const ControlButton = styled.button<{ $variant?: 'danger' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  border-radius: 50%;
  background-color: ${({ $variant }) =>
    $variant === 'danger' ? "#dc3545" : "#404144"};
  color: #ffffff;
  transition: all 0.3s ease-in-out;
  border: none;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 1rem ${({ $variant }) =>
      $variant === 'danger'
        ? 'rgba(220, 53, 69, 0.25)'
        : 'rgba(48, 49, 52, 0.25)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const DurationDisplay = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  width: 75px;
  text-align: center;
`;