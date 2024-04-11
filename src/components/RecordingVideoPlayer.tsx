import React, { useState, useEffect } from 'react';
import { config } from '../constants/config';
import styled from 'styled-components';

const RecordingVideoPlayer = ({ videoKey }: { videoKey: string }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `${config.BACKEND_URL}/meeting/recording?key=${encodeURIComponent(videoKey)}`
        );
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();

    // Clean up the URL object when the component is unmounted
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoKey]);

  return (
    <StyledDiv>
      {videoUrl && (
        <video controls width="500" height="auto">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  margin: auto;
`;

export default RecordingVideoPlayer;
