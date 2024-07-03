import React, { useEffect, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from '../utils/api';
import { AppDispatch } from '../store/store';
import {
  getIsUserSignedIn,
  setSingedInUser,
  setSingedOutUser,
} from '../store/user';
import { Outlet, useNavigate } from 'react-router-dom';

const useHandleAuthChanges = () => {
  const dispatch: AppDispatch = useDispatch();

  useLayoutEffect(() => {
    const unsubscribeAuthState = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setSingedInUser({ name: user.displayName, uid: user.uid }));
      } else {
        dispatch(setSingedOutUser());
      }
    });
    return () => {
      unsubscribeAuthState();
    };
  }, []);
};

export const App = () => {
  useHandleAuthChanges();

  const isUserSignedId = useSelector(getIsUserSignedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserSignedId === true) {
      navigate('/');
    } else if (isUserSignedId === false) {
      navigate('/login');
    }
  }, [isUserSignedId]);

  return (
    <AppContainerStyled>
      <Outlet />
    </AppContainerStyled>
  );
};

// styles
const AppContainerStyled = styled.div`
  width: 100vw;
  height: 100vh;
`;
