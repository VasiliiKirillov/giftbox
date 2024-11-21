import React, {
  ChangeEvent,
  createRef,
  Dispatch,
  FC,
  SetStateAction,
} from 'react';
import { Button } from '@blueprintjs/core';
import { toast } from 'react-toastify';

import API from '../../../misc/api';
import classes from './CSVPicker.module.css';

type CSVPickerProps = {
  newEmails: string[];
  setNewEmails: Dispatch<SetStateAction<string[]>>;
};

export const CSVPicker: FC<CSVPickerProps> = ({ newEmails, setNewEmails }) => {
  const csvInputRef = createRef<HTMLInputElement>();

  const handleCSVFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const csvFile = event.target.files?.[0];
    if (!csvFile) {
      toast.error('Something went wrong with file uploading');
      return;
    }

    try {
      const response = await API.postForm('/mailing-group/parse-csv', {
        file: csvFile,
      });
      const validEmails = response.data.validEmails ?? [];
      toast.info(`${response.data.validEmails.length} emails has been parsed`);

      const filteredValidEmails = validEmails.filter(
        (validEmail: string) => !newEmails.includes(validEmail)
      );
      setNewEmails([...filteredValidEmails, ...newEmails]);

      const notParsedStrings = response.data.notParsedStrings ?? [];
      if (notParsedStrings.length > 0) {
        toast.warn(
          `Following strings has not been parsed: ${notParsedStrings.join(' ')}`
        );
      }
    } catch (error) {
      toast.error('Something went wrong with csv uploading');
    }
    event.target.value = '';
  };

  return (
    <>
      <input
        className={classes.hideCsvInput}
        ref={csvInputRef}
        type="file"
        id="csvPicker"
        accept="text/csv"
        onChange={handleCSVFile}
      />
      <Button
        text={'Import CSV'}
        intent={'primary'}
        onClick={() => {
          csvInputRef.current?.click();
        }}
      />
    </>
  );
};
