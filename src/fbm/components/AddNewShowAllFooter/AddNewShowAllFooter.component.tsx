import React, { FC, memo } from 'react';
import { Button } from '@blueprintjs/core';

import { FooterWrapper } from '../../containers/FooterWrapper/FooterWrapper.component';

type AddNewShowAllFooterProps = {
  addNewText: string;
  handleAddNew: () => void;
  showAllText: string;
  handleShowAll: () => void;
  showShowAll: boolean;
};

export const AddNewShowAllFooter: FC<AddNewShowAllFooterProps> = memo(
  ({ addNewText, handleAddNew, showAllText, handleShowAll, showShowAll }) => {
    return (
      <FooterWrapper>
        <Button
          large
          text={addNewText}
          intent="success"
          onClick={handleAddNew}
        />
        {showShowAll && (
          <Button
            large
            minimal
            intent="primary"
            text={showAllText}
            onClick={handleShowAll}
          />
        )}
      </FooterWrapper>
    );
  }
);
