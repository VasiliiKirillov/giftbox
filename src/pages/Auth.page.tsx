import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../utils/api';

const provider = new GoogleAuthProvider();

export const AuthPage = () => {
  const handleSignIn = () => {
    signInWithPopup(auth, provider);
  };

  return <div onClick={handleSignIn}>Sign in with google</div>;
};
