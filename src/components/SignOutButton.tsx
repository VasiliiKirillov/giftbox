import { memo } from 'react';
import styled from 'styled-components';

import { auth } from '../utils/api';
import { signOut } from 'firebase/auth';

export const SignOutButton = memo(() => {
  const handleSignOut = () => {
    signOut(auth);
  };

  return <SignOutStyled onClick={handleSignOut}>Sign out</SignOutStyled>;
});

// styles
const SignOutStyled = styled.div`
  position: fixed;
  cursor: pointer;
  top: 10px;
  right: 10px;
`;