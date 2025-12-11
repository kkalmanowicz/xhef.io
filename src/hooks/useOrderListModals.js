import React, { useState } from 'react';

const useOrderListModals = () => {
  const [modalState, setModalState] = useState({
    isAddToOrderOpen: false,
    isCompleteOrderOpen: false,
    isDeleteOpen: false,
    isEditOrderItemOpen: false,
  });

  const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleOpenModal = (modalName, item = null) => {
    if (modalName === 'isAddToOrderOpen') setSelectedInventoryItem(item);
    if (modalName === 'isDeleteOpen') setItemToDelete(item);
    if (modalName === 'isEditOrderItemOpen') setItemToEdit(item);
    setModalState(prev => ({ ...prev, [modalName]: true }));
  };

  const handleCloseModal = modalName => {
    setModalState(prev => ({ ...prev, [modalName]: false }));
    if (modalName === 'isAddToOrderOpen') setSelectedInventoryItem(null);
    if (modalName === 'isDeleteOpen') setItemToDelete(null);
    if (modalName === 'isEditOrderItemOpen') setItemToEdit(null);
  };

  return {
    modalState,
    selectedInventoryItem,
    itemToDelete,
    itemToEdit,
    handleOpenModal,
    handleCloseModal,
  };
};

export default useOrderListModals;
