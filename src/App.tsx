import { useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';

import { auth } from './utils/api';
import { AppDispatch } from './store/store';
import {
  getUserStatus,
  setSingedInUser,
  setSingedOutUser,
  UserStatus,
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

  const userStatus = useSelector(getUserStatus);

  const content = useMemo(() => {
    if (userStatus === UserStatus.idle) return <div>Please stand by</div>;
    else if (userStatus === UserStatus.signedIn) return <MainPage />;
    else if (userStatus === UserStatus.signedOut) return <AuthPage />;
    else return null;
  }, [userStatus]);

  return <AppContainerStyled>{content}</AppContainerStyled>;
};

// styles
const AppContainerStyled = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;
