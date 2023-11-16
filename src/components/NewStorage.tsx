import { FC, memo, useEffect, useState } from 'react';
import { Dropdown } from './Dropdown';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAvailableCurrencies,
  getCurrenciesList,
} from '../store/availableCurrencies';
import { AppDispatch } from '../store/store';

type CurrencyItem = { name: string; id: CurrencyKey };

type NewStorageProps = {
  onAddNewStorage: (
    currency: CurrencyKey,
    storageName: string,
    storageAmount: number
  ) => void;
};

export const NewStorage: FC<NewStorageProps> = memo(({ onAddNewStorage }) => {
  const dispatch: AppDispatch = useDispatch();

  const currencies = useSelector(getCurrenciesList);

  useEffect(() => {
    dispatch(fetchAvailableCurrencies());
  }, []);

  const [pickedCurrency, setPickedCurrency] = useState<CurrencyItem | null>(
    null
  );
  const [storageName, setStorageName] = useState('');
  const [storageAmount, setStorageAmount] = useState('');

  const handleAddNewStorage = () => {
    const parsedStorageAmount = Number(storageAmount);

    if (!pickedCurrency || isNaN(parsedStorageAmount) || storageName === '')
      return;

    onAddNewStorage(pickedCurrency.id, storageName, parsedStorageAmount);
  };

  return (
    <NewStorageStyled>
      <Dropdown
        setPickedElement={setPickedCurrency}
        pickedElement={pickedCurrency}
        placeholderValue={'Pick Currency'}
        listData={currencies}
      />
      <StorageDataStyled>
        <NewStorageInput
          onChange={(e) => setStorageName(e.currentTarget.value)}
          placeholder="enter storage name"
          value={storageName}
        />
        <NewStorageContainer>
          <NewStorageInput
            onChange={(e) => setStorageAmount(e.currentTarget.value)}
            placeholder="enter storage amount"
            value={storageAmount}
          />
        </NewStorageContainer>
      </StorageDataStyled>
      <AddNewStorageStyled onClick={handleAddNewStorage}>
        Add
      </AddNewStorageStyled>
    </NewStorageStyled>
  );
});

// styles
const NewStorageStyled = styled.div`
  display: flex;
  flex-direction: column;
  border: solid;
  width: 512px;
  height: 254px;
  padding: 16px;
  justify-content: space-between;
`;

const AddNewStorageStyled = styled.div`
  cursor: pointer;
`;

const StorageDataStyled = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 24px;
  justify-content: space-between;
`;

const NewStorageInput = styled.input`
  background: rgb(233, 233, 233);
  height: 32px;
  padding: 8px;
  font-size: 16px;
  color: #1b1b1b;
  border: none;
`;

const NewStorageContainer = styled.div`
  width: 200px;
`;
