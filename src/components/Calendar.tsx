import { memo } from 'react';
import styled from 'styled-components';

export const Calendar = memo(() => {
  return <CalendarStyled>Previous September Next</CalendarStyled>;
});

// styles
const CalendarStyled = styled.div`
  display: flex;
  flex-direction: row;
`;
