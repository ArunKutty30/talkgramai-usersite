import { config } from '../constants/config';

export const BACKEND_URL =
  process.env.REACT_APP_MODE === 'DEV'
    ? 'http://localhost:8000'
    : 'https://pink-pigeon-wear.cyclic.cloud';
const API_BASE_URL = 'https://api.videosdk.live';
const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;

export const createMeeting = async (userId: string, date: string, hasRecording: boolean) => {
  if (!VIDEOSDK_TOKEN) throw new Error('Invalid token');
  const url = `${API_BASE_URL}/v2/rooms`;

  const autoStartConfig: { [key: string]: any } = {};

  if (hasRecording) {
    autoStartConfig.recording = {
      config: {
        layout: {
          type: 'GRID',
          priority: 'PIN',
          gridSize: 2,
        },
        quality: 'med',
      },
      awsDirPath: `${userId}/${date}`,
    };
  }

  const options = {
    method: 'POST',
    headers: { Authorization: VIDEOSDK_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      autoCloseConfig: {
        type: 'session-ends',
        duration: Number(config.SESSION_DURATION),
      },
      autoStartConfig: autoStartConfig,
    }),
  };

  const { roomId } = await fetch(url, options)
    .then((response) => response.json())
    .catch((error) => console.error('error', error));

  return roomId;
};
