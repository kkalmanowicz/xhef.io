import React, { useState, useMemo } from 'react';

import PrepPageHeader from '@/components/prep/PrepPageHeader';
import StationFilterTabs from '@/components/prep/StationFilterTabs';
import PrepItemList from '@/components/prep/PrepItemList';
import PrepItemDialog from '@/components/prep/PrepItemDialog';

import usePrepItemsData from '@/hooks/usePrepItemsData';
import usePrepItemActions from '@/hooks/usePrepItemActions';

function PrepItems() {
  const { prepItems, setPrepItems, isLoading, fetchPrepItems } =
    usePrepItemsData();
  const [selectedStation, setSelectedStation] = useState('all');

  const {
    isAddDialogOpen,
    editingItem,
    isSubmittingAction,
    handleUpdateStock,
    handleDelete,
    openEditDialog,
    openAddDialog,
    closeDialog,
    handleFormSuccess,
  } = usePrepItemActions(prepItems, setPrepItems, fetchPrepItems);

  const filteredPrepItems = useMemo(
    () =>
      prepItems.filter(
        item => selectedStation === 'all' || item.station === selectedStation
      ),
    [prepItems, selectedStation]
  );

  return (
    <div className="space-y-8 p-4 md:p-6 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-950 min-h-screen">
      <PrepPageHeader onOpenAddDialog={openAddDialog} />

      <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-xl p-4 sm:p-6 backdrop-blur-md">
        <StationFilterTabs
          selectedStation={selectedStation}
          onSetSelectedStation={setSelectedStation}
        />
        <PrepItemList
          isLoading={isLoading}
          filteredPrepItems={filteredPrepItems}
          selectedStation={selectedStation}
          onUpdateStock={handleUpdateStock}
          onOpenEditDialog={openEditDialog}
          onDelete={handleDelete}
          isSubmittingAction={isSubmittingAction}
        />
      </div>

      <PrepItemDialog
        isOpen={isAddDialogOpen}
        onClose={closeDialog}
        editingItem={editingItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}

export default PrepItems;
