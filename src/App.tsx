import { useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from './utils/api';
import { AppDispatch } from './store/store';
import {
  getIsUserSignedIn,
  setSingedInUser,
  setSingedOutUser,
} from './store/user';
import { MainPage } from './pages/Main.page';
import { AuthPage } from './pages/Auth.page';

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

  const content = useMemo(() => {
    if (isUserSignedId === true) return <MainPage />;
    else if (isUserSignedId === false) return <AuthPage />;
    else return null;
  }, [isUserSignedId]);

  return <AppContainerStyled>{content}</AppContainerStyled>;
};

// styles
const AppContainerStyled = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;
