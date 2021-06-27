import React, { FC, useEffect } from 'react'
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect,
  Column,
  TableState,
  Row,
} from 'react-table'
import { ReactTableContainer } from './styles'
import classNames from 'classnames'
import { CSSProperties } from 'styled-components'
import { IReactTableProps } from './interfaces'



const headerProps = (props, { column }) => getStyles(props, column.align)

const cellProps = (props, { cell }) => getStyles(props, cell.column.align)

const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

interface IIndeterminateCheckbox {
  indeterminate?: boolean;
}

const IndeterminateCheckbox = React.forwardRef<any, IIndeterminateCheckbox>(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      // @ts-ignore
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)



const ReactTable: FC<IReactTableProps> = ({ 
  columns = [],
  data = [],
  useMultiSelect = false,
  loading = false,
  defaultSorting = [],
  defaultCanSort = false,
  manualPagination = true,
  manualFilters,
  selectedRowIndex,
  // defaultColumn,
  // changeSelectedIds,
  disableSortBy = false,
  pageCount,
  scroll = false,
  height,
  tableRef,
  onFetchData,
  onSelectRow,
  onRowDoubleClick,
  onResizedChange,
  scrollBodyHorizontally = true, 
  bodyHeight = 250, 
}) => {
    const defaultColumn = React.useMemo(
      () => ({
        // When using the useFlexLayout:
        minWidth: 30, // minWidth is only used as a limit for resizing
        width: 150, // width is used for both the flex-basis and flex-grow
        maxWidth: 200, // maxWidth is only used as a limit for resizing
      }),
      []
    )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    ({ useInstanceBeforeDimensions, allColumns }) => {
      if (useMultiSelect) {
        allColumns.push(columns => [
          // Let's make a column for selection
          {
            id: 'selection',
            disableResizing: true,
            minWidth: 35,
            width: 35,
            maxWidth: 35,
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ])
      }
      useInstanceBeforeDimensions.push(({ headerGroups }) => {
        // fix the parent group of the selection button to not be resizable
        const selectionGroupHeader = headerGroups[0].headers[0]
        selectionGroupHeader.canResize = false
      })
    }
  )

  const { pageIndex, pageSize, columnResizing } = state;
  
  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    if (onFetchData) {
      // onFetchData();
    }
  }, [onFetchData, pageIndex, pageSize]);

  const onResizeClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => event?.stopPropagation();

  const handleSelectRow = (row: Row<object>) => {
    if (onSelectRow) {
      if (row?.index === selectedRowIndex) {
        onSelectRow(null, null);
      } else onSelectRow(row?.index, row?.original);
    }
  };

  useEffect(() => {
    if (onResizedChange) {
      onResizedChange(state?.columnResizing);
    }
  }, [state?.columnResizing]);

  const handleDoubleClickRow = (row: Row<object>) => {
    if (onRowDoubleClick) {
      onRowDoubleClick(row?.original);
    }
  };
  

  return (
    <ReactTableContainer className="sha-react-table">
      <div {...getTableProps()} className="sha-table">
        
          {headerGroups.map(headerGroup => (
            <div
              {...headerGroup.getHeaderGroupProps({
                // style: { paddingRight: '15px' },
              })}
              className={classNames('tr tr-head')}
            >
              {headerGroup.headers.map(column => (
                <div {...column.getHeaderProps(headerProps)}
                  className={classNames('th', {
                    'sorted-asc': column.isSorted && column.isSortedDesc,
                    'sorted-desc': column.isSorted && !column.isSortedDesc,
                  })}
                >
                  {column.render('Header')}

                  {/* Use column.getResizerProps to hook up the events correctly */}
                  {column.canResize && (
                    <div
                      {...column.getResizerProps()}
                      className={classNames('resizer', { isResizing: column.isResizing })}
                      onClick={onResizeClick}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        
        <div className="tbody"
          style={{
            height: scrollBodyHorizontally ? bodyHeight || 250 : 'unset',
            overflowY: scrollBodyHorizontally ? 'auto' : 'unset'
          }}
          {...getTableBodyProps()}
        >{rows?.length === 0 && !loading && (
            <div className="sha-table-empty">
              <div title="There is no data for this table" />
            </div>
          )}

          {rows.map((row, rowIndex) => {
            prepareRow(row)

            return (
              <div
                onClick={() => handleSelectRow(row)}
                onDoubleClick={() => handleDoubleClickRow(row)}
                {...row.getRowProps()}
                className={classNames(
                  'tr tr-body',
                  { 'tr-odd': rowIndex % 2 === 0 },
                  { 'sha-tr-selected': selectedRowIndex === row?.index }
                )}
              >
                {row.cells.map(cell => {
                  return (
                    <div {...cell.getCellProps(cellProps)} className="td">
                      {cell.render('Cell')}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </ReactTableContainer>
  )
}

export default ReactTable;
