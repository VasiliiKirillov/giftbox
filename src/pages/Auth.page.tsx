import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/api';
import styled from 'styled-components';
// import axios from 'axios';

export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets'); // Add Sheets API scope

export const AuthPage = () => {
  const handleSignIn = async () => {
    const result = await signInWithPopup(auth, provider);

    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;
    if (accessToken) localStorage.setItem('accessToken', accessToken);
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
