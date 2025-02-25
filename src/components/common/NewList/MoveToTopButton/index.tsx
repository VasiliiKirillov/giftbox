import React, { FC, RefObject } from 'react';

import { MoveToTopButtonStyled } from './styles';

type MoveToTopButtonProps = {
  showScroll: boolean;
  elementToScroll: RefObject<HTMLDivElement>;
};

export const MoveToTopButton: FC<MoveToTopButtonProps> = ({
  showScroll,
  elementToScroll,
}) => {
  const scrollToTopAction = () => {
    if (elementToScroll?.current) {
      elementToScroll.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <MoveToTopButtonStyled onClick={scrollToTopAction} out={!showScroll}>
      <div>ArrowUpIcon</div>
    </MoveToTopButtonStyled>
  );
};
