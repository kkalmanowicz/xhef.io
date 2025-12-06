import React, { useState } from 'react';

const useInventoryModals = () => {
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
    addToOrder: false,
    bulkUpload: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalState(prev => ({ ...prev, [modalName]: false }));
    if (modalName !== 'bulkUpload') { // Keep selected item for bulk upload if needed, otherwise clear
        setSelectedItem(null);
    }
  };

  const setSelectedItemForModal = (item, modalName) => {
    setSelectedItem(item);
    openModal(modalName);
  };

  return {
    modalState,
    selectedItem,
    openModal,
    closeModal,
    setSelectedItemForModal,
  };
};

export default useInventoryModals;