import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';

import classes from './Root.module.css';
import { Header } from '../../components/Header/Header.component';

export const Root = memo(() => {
  // const isLoggedIn = window.localStorage.getItem('JWT');
  // if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <>
      <div className={classes.root}>
        <Header />
        <div className={classes.mainContentWrapper}>
          <div className={classes.mainContent}>
            <Outlet />
          </div>
        </div>
        {/*<FileUploadModal />*/}
      </div>
    </>
  );
});
