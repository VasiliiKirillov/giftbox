import { memo, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { Storages } from '../components/Storages';
import { Accounting } from '../components/Accounting';
import { Calendar } from '../components/Calendar';
import { AppDispatch } from '../store/store';
import { SignOutButton } from '../components/SignOutButton';
import { fetchUserData, getNewUserStatus, getUserUID } from '../store/user';

export const MainPage = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const userUID = useSelector(getUserUID);
  const isUserNew = useSelector(getNewUserStatus);

  useEffect(() => {
    if (!userUID) return;

    dispatch(fetchUserData(userUID));
  }, [userUID]);

  const content = useMemo(() => {
    if (isUserNew === true) return <div>create your new storage</div>;
    else if (isUserNew === false)
      return (
        <>
          <Storages />
          <Accounting />
          <Calendar />
        </>
      );
    else return <div>Please stand by</div>;
  }, [isUserNew]);

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
