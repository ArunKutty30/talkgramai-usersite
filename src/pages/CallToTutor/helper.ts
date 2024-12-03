import { useMediaDevice } from '@videosdk.live/react-sdk';
import { useEffect, useState } from 'react';

export function useHandlePermissions() {
  const { checkPermissions, requestPermission } = useMediaDevice();
  const [hasPermissions, setHasPermissions] = useState(true);

  useEffect(() => {
    const checkAndRequestMediaPermission = async () => {
      // @ts-ignore
      const checkAudioPermission = await checkPermissions('audio');

      if (!checkAudioPermission.get('audio')) {
        try {
          // @ts-ignore
          const requestAudioPermission = await requestPermission('audio');
          if (!requestAudioPermission.get('audio')) {
            setHasPermissions(false);
          }
        } catch (ex) {
          console.log('Error in requestPermission ', ex);
          setHasPermissions(false);
        }
      }
    };
    checkAndRequestMediaPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return hasPermissions;
}
