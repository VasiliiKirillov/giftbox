import styled, { css } from 'styled-components';

export const ListWrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  // do not add position: relative here!!! brockes getBoundingClientRect
`;

export const TableStyled = styled.table`
  border-collapse: separate;
  width: 100%;
  border-spacing: 0;
  table-layout: fixed;
`;

export const TableHeaderRowStyled = styled.tr`
  font-family: 'Readex Pro', sans-serif;
  font-style: normal;
  font-size: 12px;
  line-height: 130%;
`;

const TableHeaderCommonLayout = css`
  border-bottom: 1px solid #ddd;
  padding: 12px 8px;
`;

export const TableHeaderElementStyled = styled.th`
  ${TableHeaderCommonLayout};
`;

export const TableHeaderContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TableHeaderReorderStyled = styled.div`
  margin-left: 6px;
  cursor: pointer;
  display: flex;
`;

const TableHeaderOptions = css`
  text-align: left;
  color: black;
  font-weight: 400;
`;

export const TableHeaderTitleStyled = styled.div`
  ${TableHeaderOptions};
`;

export const TableHeaderOptionsStyled = styled.th`
  ${TableHeaderCommonLayout};
  ${TableHeaderOptions};
  width: 50px;
`;

export const TableHeaderStyled = styled.thead`
  position: sticky;
  top: 0;
  background-color: #ffffff;
  z-index: 1;
`;

export const TableBodyStyled = css`
  background-color: #ffffff;
`;

export const CommonTableBodyStyled = styled.tbody`
  ${TableBodyStyled};
`;

export const DraggableTableBodyStyled = styled.tbody<{
  isDragAndDropActive?: boolean;
}>`
  ${TableBodyStyled};
  background-color: ${({ isDragAndDropActive }) =>
    isDragAndDropActive ? '#f4fbfc' : '#ffffff'};
`;

export const TableRowStyled = styled.tr<{ isElementDragging: boolean }>`
  height: 64px;
  user-select: none;
  display: ${({ isElementDragging }) =>
    isElementDragging ? 'table' : 'table-row'};
  background: ${({ isElementDragging }) =>
    isElementDragging ? '#e3fbff' : 'inherit'};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 140%;
  font-family: 'Readex Pro', sans-serif;
  color: #333333;
`;

export const TableCellStyled = styled.td<{
  isElementDragging: boolean;
  columnWidth: string;
}>`
  border-bottom: ${({ isElementDragging }) =>
    isElementDragging ? 'none' : '1px solid #ddd'};
  width: ${({ columnWidth }) => columnWidth};
  padding: 8px;
  // dirty hack for options column
  height: 1px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableFieldBodyStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
