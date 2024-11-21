import React, { memo, useContext } from 'react';

import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import { ModalContext } from './CommonModal.HOC';

const CommonModal = memo(() => {
  const [modalData, setModalData] = useContext(ModalContext);

  return (
    <Dialog
      title={modalData?.title}
      icon="info-sign"
      isOpen={Boolean(modalData)}
      onClose={() => setModalData?.(null)}
      style={{ width: '400px' }}
    >
      <DialogBody>{modalData?.body}</DialogBody>
      <DialogFooter
        minimal={true}
        actions={
          <>
            <Button
              minimal
              intent={modalData?.mainButton.intent ?? 'danger'}
              text={modalData?.mainButton.text ?? 'Yes'}
              onClick={modalData?.mainButton.action}
            />
            {modalData?.secondaryButton && (
              <Button
                minimal
                intent={modalData?.secondaryButton.intent ?? 'none'}
                text={modalData?.secondaryButton.text ?? 'No'}
                onClick={modalData?.secondaryButton.action}
              />
            )}
          </>
        }
      />
    </Dialog>
  );
});

export default CommonModal;
