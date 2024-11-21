import React, { memo } from 'react';
import { Button } from '@blueprintjs/core';

import commonClasses from '../../../../misc/common.module.css';

import { PlaceholderNotification } from '../../../../containers/PlaceholderNotification/PlaceholderNotification.component';
import { useEmailAssetsModalData } from '../../../EmailAssetsModal/EmailAssetModal.service';
import { EmailAssetsModal } from '../../../EmailAssetsModal/EmailAssetsModal.component';

const EmptyPlaceholder = memo(() => {
  const {
    editingEmailAsset,
    isEmailAssetDialogOpen,
    closeNewAssetDialog,
    openEmailAssetDialog,
  } = useEmailAssetsModalData();

  return (
    <>
      <EmailAssetsModal
        isDialogOpen={isEmailAssetDialogOpen}
        closeDialog={closeNewAssetDialog}
        editingEmailAsset={editingEmailAsset}
      />
      <div className={commonClasses.placeholderContainer}>
        <PlaceholderNotification
          intent={'primary'}
          text={'Looks like you have no any email assets yet'}
        >
          <Button
            text={'+ First email asset'}
            large
            intent="primary"
            onClick={openEmailAssetDialog}
          />
        </PlaceholderNotification>
      </div>
    </>
  );
});

export default EmptyPlaceholder;
