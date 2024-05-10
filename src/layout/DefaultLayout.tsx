import React, { ReactNode } from 'react';
import Copyright from '../components/Copyright';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Copyright />
    </>
  );
};

export default DefaultLayout;
