import React, { memo, FC } from 'react';

import { LabelField } from '../LabelField/LabelField';
import { HelperText } from '../HelperText/HelperText';

import { InputStyled } from './styles';

interface InputProps {
  value: string;
  labelText: string;
  additionalInfo?: string;
  disabled?: boolean;
  isRequired?: boolean;
  limitSymbols?: number;
  changeAction?: (text: string) => void;
}

export const Input: FC<InputProps> = memo(
  ({
    value,
    labelText,
    additionalInfo,
    changeAction,
    disabled = false,
    isRequired,
    limitSymbols,
  }) => (
    <>
      <LabelField labelText={labelText} isRequired={isRequired} />
      <InputStyled
        disabled={disabled}
        maxLength={limitSymbols}
        isDisabled={disabled}
        withAdditionalInfo={Boolean(additionalInfo)}
        onChange={(e) =>
          disabled || !changeAction ? null : changeAction(e.target.value)
        }
        value={value}
      />
      {additionalInfo && <HelperText additionalInfo={additionalInfo} />}
    </>
  )
);
