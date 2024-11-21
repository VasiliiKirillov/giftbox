import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Colors,
  EditableText,
  H2,
  H4,
  H6,
  Spinner,
} from '@blueprintjs/core';
import { toast } from 'react-toastify';

import { AppDispatch } from '../../misc/store';
import classes from './UnsavedEmailGroup.module.css';
import commonClasses from '../../misc/common.module.css';
import { UnsavedNewEmailRow } from './UnsavedNewEmailRow/UnsavedNewEmailRow.component';
import { UnsavedEmailRow } from './UnsavedEmailRow/UnsavedEmailRow.component';
import { UnsavedEmailsTable } from './UnsavedEmailsTable/UnsavedEmailsTable.component';
import { addNewEmailGroup } from '../../slices/emailGroupsDetailed';
import { CSVPicker } from './CSVPicker/CSVPicker.component';

const emailRegExp = new RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'i');

export const UnsavedEmailGroup = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [emailGroupName, setEmailGroupName] = useState('');
  const [isAddNewEmail, setIsAddNewEmail] = useState(false);
  const [newEmails, setNewEmails] = useState<Array<string>>([]);
  const [isShowSavingLoader, setIsShowSavingLoader] = useState(false);

  const addEmailToNewGroup = (email: string) => {
    const isEmailAlreadyAdded = newEmails.find(
      (unsavedEmail) => unsavedEmail === email
    );
    const isEmailIncorrect = !emailRegExp.test(email);

    if (isEmailAlreadyAdded) {
      toast.error(`Email "${email}" is already added!`);
    } else if (isEmailIncorrect) {
      toast.error(`Email "${email}" is incorrect!`);
    } else {
      setNewEmails([email, ...newEmails]);
      setIsAddNewEmail(false);
    }
  };

  const toggleAddNewEmail = () => {
    setIsAddNewEmail(!isAddNewEmail);
  };

  const handleUpdateEmailValue = (oldEmailValue: string, email: string) => {
    setNewEmails(
      newEmails.map((emailFromList) => {
        if (emailFromList === oldEmailValue) {
          return email;
        } else return emailFromList;
      })
    );
  };

  const handleShowConfirmationModal = (email: string) => {
    setNewEmails(newEmails.filter((newEmail) => newEmail !== email));
  };

  const handleEmailGroupCreation = async () => {
    setIsShowSavingLoader(true);
    const newEmailGroup = await dispatch(
      addNewEmailGroup({
        emailGroupName,
        emails: newEmails.map((email) => ({ email })),
      })
    );
    setIsShowSavingLoader(false);
    navigate(`/emailgroups/${newEmailGroup.payload.id}`);
  };

  const isCreateButtonDisabled =
    newEmails.length === 0 || emailGroupName.length === 0;

  return (
    <div className={classes.paddingWrapper}>
      <div className={commonClasses.flexRow}>
        <H2>New email group creation</H2>
        <div className={`${classes.marginButton} ${commonClasses.flexRow}`}>
          <Button
            large
            text={'Create'}
            intent={isCreateButtonDisabled ? 'none' : 'success'}
            disabled={isCreateButtonDisabled}
            onClick={handleEmailGroupCreation}
            title={
              newEmails.length === 0 || !emailGroupName
                ? 'Please specify group name and add at least one email in your group before creation'
                : ''
            }
          />
          {isShowSavingLoader && <Spinner size={24} />}
        </div>
      </div>
      <div className={`${commonClasses.flexRow} ${classes.headerEmailGroups}`}>
        <div className={commonClasses.flexRow}>
          <div className={classes.unsavedEmailTitle}>
            <H4>Email group name</H4>
            <H6 style={{ color: Colors.RED2 }}>*</H6>
            <H4>:</H4>
          </div>
          <H4>
            <EditableText
              placeholder="..."
              maxLength={40}
              onChange={setEmailGroupName}
              value={emailGroupName}
            />
          </H4>
        </div>
        <div className={`${commonClasses.flexRow} ${classes.marginButton}`}>
          <Button
            text={isAddNewEmail ? 'Cancel' : '+ Add new email'}
            intent={isAddNewEmail ? 'danger' : 'success'}
            onClick={() => {
              toggleAddNewEmail();
            }}
          />
          <CSVPicker newEmails={newEmails} setNewEmails={setNewEmails} />
        </div>
      </div>
      <div className={classes.contentWrapper}>
        {(newEmails.length > 0 || isAddNewEmail) && (
          <UnsavedEmailsTable>
            {isAddNewEmail && (
              <UnsavedNewEmailRow
                setIsAddNewEmail={setIsAddNewEmail}
                addEmailToNewGroup={addEmailToNewGroup}
              />
            )}
            {newEmails.length > 0 &&
              newEmails.map((email: string) => (
                <UnsavedEmailRow
                  key={email}
                  email={email}
                  handleUpdateEmailValue={handleUpdateEmailValue}
                  handleShowConfirmationModal={handleShowConfirmationModal}
                />
              ))}
          </UnsavedEmailsTable>
        )}
      </div>
    </div>
  );
};
