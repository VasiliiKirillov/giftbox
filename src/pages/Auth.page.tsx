import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/api';
import styled from 'styled-components';

const provider = new GoogleAuthProvider();

export const AuthPage = () => {
  const handleSignIn = () => {
    signInWithPopup(auth, provider);
  };

  return (
    <SignInStyled onClick={handleSignIn}>Sign in with google</SignInStyled>
  );
};

// styles
const SignInStyled = styled.div`
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid gainsboro;
  padding: 4px;
`;
