import { memo, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAvailableCurrencies,
  getInUseCurrenciesList,
} from '../store/availableCurrencies';
import { getDefaultCurrencyKey, updateDefaultCurrency } from '../store/user';
import { AppDispatch } from '../store/store';

export const DefaultCurrencyPicker = memo(() => {
  const dispatch: AppDispatch = useDispatch();

  const inUseCurrencies = useSelector(getInUseCurrenciesList);
  const availableCurrencies = useSelector(getAvailableCurrencies);
  const defaultCurrencyKey = useSelector(getDefaultCurrencyKey);

  const defaultCurrency = useMemo(() => {
    if (!defaultCurrencyKey) return { id: '', name: '' };
    return {
      id: defaultCurrencyKey,
      name: availableCurrencies[defaultCurrencyKey],
    };
  }, [availableCurrencies, defaultCurrencyKey]);

  const handlePickedElement = useCallback(
    (pickedCurrency: { id: CurrencyKey; name: string }) => {
      dispatch(updateDefaultCurrency(pickedCurrency.id));
    },
    []
  );

  return (
    <DefaultCurrencyPickerContainer>
      <div>Default currency:</div>
      <Dropdown
        listData={inUseCurrencies}
        pickedElement={defaultCurrency}
        setPickedElement={handlePickedElement}
      />
    </DefaultCurrencyPickerContainer>
  );
});

// styles
const DefaultCurrencyPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
