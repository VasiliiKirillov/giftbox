import styled from 'styled-components';

import { Storages } from './components/Storages';
import { Accounting } from './components/Accounting';
import { Calendar } from './components/Calendar';

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
