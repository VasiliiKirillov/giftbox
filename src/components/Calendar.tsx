import { memo } from 'react';
import styled from 'styled-components';

export const Calendar = memo(() => {
  return (
    <CalendarStyled>
      <NavigationButtonStyled>Prev</NavigationButtonStyled>
      <CalendarButtonStyled>September</CalendarButtonStyled>
      <NavigationButtonStyled>Next</NavigationButtonStyled>
    </CalendarStyled>
  );
});

// styles
const CalendarButtonStyled = styled.div``;

const NavigationButtonStyled = styled.div``;

const CalendarStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
`;
