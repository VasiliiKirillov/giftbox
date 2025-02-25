import React, { memo, useRef, UIEvent, useState } from 'react';

import { MoveToTopButton } from '../common/MoveToTopButton';

import { ListWrapper } from './styles';
import { ListProps, RowData } from './types';

import { Table } from './Table';

export const LIST_WRAPPER_ID = 'ListWrapper';

type ListComponent = <
  T extends RowData,
  H extends Partial<Record<keyof T, string>>,
>(
  props: ListProps<T, H>
) => JSX.Element | null;
export const List: ListComponent = memo(
  ({
    pagination,
    data,
    headerData,
    options,
    isDraggable = false,
    isDragAndDropActive = false,
    handleDragStart,
    handleDragEnd,
    reorderOptions,
    optionsDropdownOffset,
  }) => {
    const listWrapperRef = useRef<HTMLDivElement>(null);
    const [showScroll, setShowScroll] = useState<boolean>(false);

    const scrollHandler = (e: UIEvent<HTMLDivElement>) => {
      const scrollValue = e.currentTarget.scrollTop;
      if (scrollValue > 100 && !showScroll) {
        setShowScroll(true);
      }
      if (scrollValue <= 100 && showScroll) {
        setShowScroll(false);
      }
    };

    return (
      <ListWrapper
        onScroll={scrollHandler}
        ref={listWrapperRef}
        id={LIST_WRAPPER_ID}
      >
        <MoveToTopButton
          elementToScroll={listWrapperRef}
          showScroll={showScroll}
        />
        <Table
          data={data}
          headerData={headerData}
          options={options}
          isDraggable={isDraggable}
          isDragAndDropActive={isDragAndDropActive}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          reorderOptions={reorderOptions}
          optionsDropdownOffset={optionsDropdownOffset}
        />
        {pagination}
      </ListWrapper>
    );
  }
);
