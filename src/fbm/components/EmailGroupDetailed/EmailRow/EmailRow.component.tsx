import React, { createRef, FC, memo, useEffect, useState } from 'react';
import { Button, EditableText, Tag } from '@blueprintjs/core';

import { Email } from '../../../slices/emailGroupsDetailed';
import classes from '../EmailsTable/EmailsTable.module.css';

type EmailRowProps = {
  email: Email;
  handleShowConfirmationModal: (emailId: string) => void;
  handleUpdateEmailValue: (email: string, emailId: string) => Promise<void>;
};

export const EmailRow: FC<EmailRowProps> = memo(
  ({ email, handleShowConfirmationModal, handleUpdateEmailValue }) => {
    const refInput = createRef<EditableText>();

    const [isEditMode, setIsEditMode] = useState(false);
    const [emailValue, setEmailValue] = useState(email.email);

    const handleSaveChanges = async () => {
      if (emailValue !== email.email)
        await handleUpdateEmailValue(email.id, emailValue);

      setIsEditMode(false);
    };

    useEffect(() => {
      if (!isEditMode) return;

      refInput?.current?.toggleEditing();
    }, [isEditMode]);

    const status =
      !email.unsubscribedLocal && !email.blockedGlobal ? (
        <Tag intent={'success'}>Ok</Tag>
      ) : (
        <>
          {email.unsubscribedLocal && <Tag intent={'danger'}>Unsubscribed</Tag>}
          {email.blockedGlobal && <Tag intent={'danger'}>Blocked</Tag>}
        </>
      );

    return (
      <tr>
        <td className={classes.tdStyled}>
          <div className={classes.tableDataWrapper}>
            {isEditMode ? (
              <EditableText
                ref={refInput}
                placeholder="..."
                maxLength={40}
                onChange={(e) => {
                  setEmailValue(e);
                }}
                value={emailValue}
              />
            ) : (
              email.email
            )}
          </div>
        </td>
        <td className={classes.tdStyled}>
          <div className={classes.tableDataWrapper}>{status}</div>
        </td>
        <td>
          {isEditMode ? (
            <Button
              minimal
              intent={'success'}
              text={'Save'}
              onClick={handleSaveChanges}
            />
          ) : (
            <Button
              minimal
              intent={'danger'}
              text={'Delete'}
              onClick={() => {
                handleShowConfirmationModal(email.id);
              }}
            />
          )}
        </td>
        <td>
          {isEditMode ? (
            <Button
              minimal
              intent={'danger'}
              text={'Cancel'}
              onClick={() => {
                setEmailValue(email.email);
                setIsEditMode(false);
              }}
            />
          ) : (
            <Button
              minimal
              intent={
                email.unsubscribedLocal || email.blockedGlobal
                  ? 'none'
                  : 'primary'
              }
              text={'Edit'}
              disabled={email.unsubscribedLocal || email.blockedGlobal}
              onClick={() => {
                setIsEditMode(true);
              }}
            />
          )}
        </td>
      </tr>
    );
  }
);
