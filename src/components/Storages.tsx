import { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Storage } from './Storage';
import { getYear } from '../utils/main';
import { db } from '../main';
import { collection, getDocs } from 'firebase/firestore';

type Storage = { currency: string; startTotal: number };

type TStorages = Record<string, Storage>;

export const Storages = memo(() => {
  const storages = useGetStorages();

  return (
    <StoragesStyled>
      {Object.entries(storages).map(([id, value]) => (
        <Storage
          key={id}
          name={id}
          currency={value.currency}
          amount={value.startTotal}
        />
      ))}
    </StoragesStyled>
  );
});

// hooks
const useGetStorages = () => {
  const [storages, setStorages] = useState<TStorages>({});

  const fetchStorages = async () => {
    const storagesRef = collection(
      db,
      `months/October-${getYear() + 1}/storages`
    );
    const storagesSnap = await getDocs(storagesRef);
    const storages: TStorages = {};
    storagesSnap.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      storages[doc.id] = doc.data() as Storage;
    });
    setStorages(storages);
  };

  useEffect(() => {
    fetchStorages();
  }, []);
  return storages;
};

// styles
const StoragesStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 16px;
`;
