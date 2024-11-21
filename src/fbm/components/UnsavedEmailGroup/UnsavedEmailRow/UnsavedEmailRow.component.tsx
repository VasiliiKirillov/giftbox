import React, { createRef, FC, memo, useEffect, useState } from 'react';
import { Button, EditableText } from '@blueprintjs/core';

import classes from '../UnsavedEmailGroup.module.css';

type UnsavedEmailRowProps = {
  email: string;
  handleShowConfirmationModal: (emailId: string) => void;
  handleUpdateEmailValue: (oldEmail: string, newEmail: string) => void;
};

export const UnsavedEmailRow: FC<UnsavedEmailRowProps> = memo(
  ({ email, handleShowConfirmationModal, handleUpdateEmailValue }) => {
    const refInput = createRef<EditableText>();

    const [isEditMode, setIsEditMode] = useState(false);
    const [emailValue, setEmailValue] = useState(email);

    const handleSaveChanges = () => {
      handleUpdateEmailValue(email, emailValue);
      setIsEditMode(false);
    };

    useEffect(() => {
      if (!isEditMode) return;

      refInput?.current?.toggleEditing();
    }, [isEditMode]);

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
              email
            )}
          </div>
        </td>
        <td className={classes.tdStyled}>
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
                handleShowConfirmationModal(email);
              }}
            />
          )}
        </td>
        <td className={classes.tdStyled}>
          {isEditMode ? (
            <Button
              minimal
              intent={'danger'}
              text={'Cancel'}
              onClick={() => {
                setEmailValue(email);
                setIsEditMode(false);
              }}
            />
          ) : (
            <Button
              minimal
              intent={'primary'}
              text={'Edit'}
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
