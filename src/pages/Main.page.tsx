import React, { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { AppDispatch } from '../store/store';
import { SignOutButton } from '../components/SignOutButton';
import { fetchUserData, getIsUserHasDB, getUserUID } from '../store/user';
import { FirstStorage } from '../components/FirstStorage';
import { MainContent } from '../components/MainContent';

export const MainPage = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const userUID = useSelector(getUserUID);
  const isUserHasDB = useSelector(getIsUserHasDB);

  useEffect(() => {
    if (!userUID) return;

    dispatch(fetchUserData(userUID));
  }, [userUID]);

  const content = useMemo(() => {
    if (isUserHasDB === true) return <MainContent />;
    else if (isUserHasDB === false) return <FirstStorage />;
    else return <div>Please stand by</div>;
  }, [isUserHasDB]);

  return (
    <MainContentStyled>
      <SignOutButton />
      {content}
    </MainContentStyled>
  );
});

// styles
const MainContentStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
