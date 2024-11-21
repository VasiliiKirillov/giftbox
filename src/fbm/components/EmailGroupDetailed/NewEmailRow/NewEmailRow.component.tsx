import React, {
  createRef,
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { Button, EditableText, Tag } from '@blueprintjs/core';

import { AppDispatch } from '../../../misc/store';
import { addEmailToGroup } from '../../../slices/emailGroupsDetailed';
import classes from '../EmailsTable/EmailsTable.module.css';

type EmailRowProps = {
  setIsAddNewEmail: Dispatch<SetStateAction<boolean>>;
  emailGroupId: string;
};

export const NewEmailRow: FC<EmailRowProps> = memo(
  ({ setIsAddNewEmail, emailGroupId }) => {
    const dispatch: AppDispatch = useDispatch();

    const refInput = createRef<EditableText>();

    const [emailValue, setEmailValue] = useState('');

    const handleSaveChanges = async () => {
      await dispatch(
        addEmailToGroup({ groupId: emailGroupId, email: emailValue })
      );

      setIsAddNewEmail(false);
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
          <div className={classes.tableDataWrapper}>
            {<Tag intent={'none'}>-</Tag>}
          </div>
        </td>
        <td>
          <Button
            minimal
            intent={'success'}
            text={'Save'}
            onClick={handleSaveChanges}
          />
        </td>
        <td>
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
