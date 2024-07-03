import styled from 'styled-components';

export const InputStyled = styled.input<{
  withAdditionalInfo: boolean;
  isDisabled: boolean;
}>`
  background: rgba(233, 233, 233, 0.5);
  height: 32px;
  font-size: 16px;
  color: ${(props) => (props.isDisabled ? '#bbbbbb' : '#1b1b1b')};
  padding: 4px;
  border: none;
  margin-bottom: ${(props) => (props.withAdditionalInfo ? '4px' : '16px')};
`;
