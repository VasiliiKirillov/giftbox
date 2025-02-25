import styled, { keyframes } from 'styled-components';

interface MoveToTopButtonProps {
  out: boolean;
}

export const MoveToTopButtonStyled = styled.div<MoveToTopButtonProps>`
  position: absolute;
  bottom: 16px;
  right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  box-sizing: border-box;
  width: 48px;
  height: 48px;
  background: #f4f4f4;
  border: 2px solid #e9e9e9;
  box-shadow: 0 4px 40px rgba(130, 130, 130, 0.05);
  z-index: 100;
  cursor: pointer;
  visibility: ${(props) => (props.out ? 'hidden' : 'visible')};
  animation: ${(props) => (props.out ? fadeOut : fadeIn)} 0.2s linear;
  transition: visibility 0.2s linear;
`;

const fadeIn = keyframes`
  0%   {
    opacity: 0;
    }
    100% {
    opacity: 1;
    }
`;

const fadeOut = keyframes`
  0%   {
    opacity: 1;
    }
    100% {
    opacity: 0;
    }
`;
