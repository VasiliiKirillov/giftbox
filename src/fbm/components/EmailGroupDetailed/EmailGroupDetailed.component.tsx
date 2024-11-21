import React, { memo, useState } from 'react';
import { Button } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import commonClasses from '../../misc/common.module.css';
import classes from './EmailGroupDetailed.module.css';
import { AppDispatch } from '../../misc/store';
import {
  deleteEmailFromGroup,
  Email,
  getDetailedEmailGroupById,
  updateEmailValue,
} from '../../slices/emailGroupsDetailed';
import useCommonModalDialog from '../../containers/CommonModal/CommonModal.hook';
import { EmailsTable } from './EmailsTable/EmailsTable.component';
import { LoadingErrorPlaceholder } from './Placeholders/LoadingErrorPlaceholder/LoadingErrorPlaceholder.component';
import { DummyData } from './DummyData/DummyData.component';
import { EmailRow } from './EmailRow/EmailRow.component';
import { NewEmailRow } from './NewEmailRow/NewEmailRow.component';
import { EmailGroupName } from './EmailGroupName/EmailGroupName.component';

export const EmailGroupDetailed = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const { emailGroupId = '' } = useParams();
  const detailedEmailGroupById = useSelector(getDetailedEmailGroupById);
  const { status = 'failed', emailGroup } =
    detailedEmailGroupById[emailGroupId];
  const isLoading = status === 'loading';
  const isSucceeded = status === 'succeeded';
  const isLoadingError = status === 'failed';

  const [isAddNewEmail, setIsAddNewEmail] = useState(false);

  const toggleAddNewEmail = () => {
    setIsAddNewEmail(!isAddNewEmail);
  };

  const { showModal, closeModal } = useCommonModalDialog();

  const handleShowConfirmationModal = (emailId: string) => {
    showModal({
      body: (
        <>
          <p>Are you sure you want to delete these item?</p>
          <p>You won&apos;t be able to recover it.</p>
        </>
      ),
      title: 'Confirm deletion',
      mainButton: {
        action: async () => {
          await dispatch(deleteEmailFromGroup({ emailGroupId, emailId }));
          closeModal();
        },
      },
      secondaryButton: {
        action: closeModal,
      },
    });
  };

  const handleUpdateEmailValue = async (
    emailId: string,
    emailValue: string
  ) => {
    await dispatch(
      updateEmailValue({
        emailGroupId: emailGroup.id,
        emailId,
        emailValue,
      })
    );
  };

  return (
    <>
      {isLoadingError && (
        <LoadingErrorPlaceholder emailGroupId={emailGroupId} />
      )}
      <div className={classes.paddingWrapper}>
        <div
          className={`${commonClasses.flexRow} ${classes.headerEmailGroups}`}
        >
          <EmailGroupName status={status} emailGroup={emailGroup} />
          <div className={classes.marginButton}>
            <Button
              text={isAddNewEmail ? 'Cancel' : '+ Add new email'}
              intent={isAddNewEmail ? 'danger' : 'success'}
              onClick={() => {
                toggleAddNewEmail();
              }}
            />
          </div>
        </div>
        <div className={classes.contentWrapper}>
          <EmailsTable isLoading={isLoading}>
            {isLoading && <DummyData withSkeleton />}
            {isLoadingError && <DummyData />}
            {isAddNewEmail && (
              <NewEmailRow
                emailGroupId={emailGroupId}
                setIsAddNewEmail={setIsAddNewEmail}
              />
            )}
            {isSucceeded &&
              emailGroup.emails.map((email: Email) => (
                <EmailRow
                  key={email.id}
                  email={email}
                  handleUpdateEmailValue={handleUpdateEmailValue}
                  handleShowConfirmationModal={handleShowConfirmationModal}
                />
              ))}
          </EmailsTable>
        </div>
      </div>
    </>
  );
});
