import React, {
  createRef,
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { Button, EditableText } from '@blueprintjs/core';

import classes from '../UnsavedEmailGroup.module.css';

type EmailRowProps = {
  setIsAddNewEmail: Dispatch<SetStateAction<boolean>>;
  addEmailToNewGroup: (email: string) => void;
};

export const UnsavedNewEmailRow: FC<EmailRowProps> = memo(
  ({ setIsAddNewEmail, addEmailToNewGroup }) => {
    const refInput = createRef<EditableText>();

    const [emailValue, setEmailValue] = useState('');

    const handleSaveChanges = () => {
      addEmailToNewGroup(emailValue);
    };

    useEffect(() => {
      refInput?.current?.toggleEditing();
    }, []);

    return (
      <tr>
        <td className={classes.tdStyled}>
          <div className={classes.tableDataWrapper}>
            {
              <EditableText
                ref={refInput}
                placeholder="..."
                maxLength={40}
                onChange={(e) => {
                  setEmailValue(e);
                }}
                value={emailValue}
              />
            }
          </div>
        </td>
        <td className={classes.tdStyled}>
          <Button
            minimal
            intent={'success'}
            text={'Save'}
            onClick={handleSaveChanges}
          />
        </td>
        <td className={classes.tdStyled}>
          <Button
            minimal
            intent={'danger'}
            text={'Cancel'}
            onClick={() => {
              setIsAddNewEmail(false);
            }}
          />
        </td>
      </tr>
    );
  }
);
