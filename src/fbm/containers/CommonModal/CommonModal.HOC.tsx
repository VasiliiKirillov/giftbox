import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { Intent } from '@blueprintjs/core';

import CommonModal from './CommonModal.component';

type ModalButton = {
  text?: string;
  intent?: Intent;
  action: () => void;
};

export type Modal = {
  title: string;
  body: string | ReactNode;
  mainButton: ModalButton;
  secondaryButton?: ModalButton;
};

export const ModalContext = createContext<
  [Modal | null, Dispatch<SetStateAction<Modal | null>>] | []
>([]);

const CommonModalHOC: FC<{ children: ReactNode }> = ({ children }) => {
  const [modalData, setModalData] = useState<Modal | null>(null);

  return (
    <ModalContext.Provider value={[modalData, setModalData]}>
      <CommonModal />
      {children}
    </ModalContext.Provider>
  );
};

export default CommonModalHOC;
