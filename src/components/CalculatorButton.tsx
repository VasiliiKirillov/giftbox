import { memo } from 'react';
import styled from 'styled-components';

import { useNavigate } from 'react-router-dom';

export const CalculatorButton = memo(() => {
  const navigate = useNavigate();

  const handleCalculator = () => {
    navigate('/calculator');
  };

  return <CalcStyled onClick={handleCalculator}>Calculator</CalcStyled>;
});

// styles
const CalcStyled = styled.div`
  position: fixed;
  cursor: pointer;
  top: 10px;
  right: 150px;
`;
