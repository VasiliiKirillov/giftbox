import { initializeApp } from 'firebase/app';
import styled from 'styled-components';

import { Storages } from './components/Storages';
import { Accounting } from './components/Accounting';
import { Calendar } from './components/Calendar';
// import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyDf6EmJoSfqMXI1bbvXHPIDh0flGyhtrsw',
  authDomain: 'giftbox-af946.firebaseapp.com',
  projectId: 'giftbox-af946',
  storageBucket: 'giftbox-af946.appspot.com',
  messagingSenderId: '346863241139',
  appId: '1:346863241139:web:98437796089c9e3d50edc6',
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
console.log(app);

export const App = () => {
  return (
    <AppContainerStyled>
      <MainContentStyled>
        <Storages />
        <Accounting />
        <Calendar />
      </MainContentStyled>
    </AppContainerStyled>
  );
};

// styles
const AppContainerStyled = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
`;

const MainContentStyled = styled.div`
  display: flex;
  flex-direction: column;
`;
