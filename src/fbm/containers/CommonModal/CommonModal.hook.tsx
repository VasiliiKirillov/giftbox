import { useContext } from 'react';

import { Modal, ModalContext } from './CommonModal.HOC';

const useCommonModalDialog = () => {
  const [, setModal] = useContext(ModalContext);
  return {
    showModal: (modalData: Modal) => setModal?.(modalData),
    closeModal: () => setModal?.(null),
  };
};

export default useCommonModalDialog;
