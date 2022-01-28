import React, { useEffect, useMemo, useContext } from 'react';
import { Header } from './components/Header';
import { Spinner } from 'components/shared-components/Spinner';
import { TTransaction } from '@redux/ducks/transactions';
import _ from 'lodash';
import {
    useTable,
    Column,
    useRowSelect,
    useExpanded,
    useGlobalFilter,
    useFilters,
    useSortBy,
    RowPropGetter,
    usePagination,
    FilterTypes,
} from 'react-table';
import {
    NameCell,
    TransactionStatusButton,
    Amount,
    OpenDrawerButton,
    CheckboxCell,
    TagCell,
    DateCell,
} from './components/cells';
import { ArrowRightOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useViewport } from 'src/hooks/useViewport';
import { FilterContext } from './components/Header/FilterContext';
import { processFilters, filterTypes } from './processFilters';

import { TStatuses } from '@redux/ducks/utils/base-resource';
import { Row, Col, Pagination } from 'antd';

interface TransactionTableProps {
    transactions: TTransaction[];
    status: keyof TStatuses;
}

// TODO
// 1. skeleton loading
// 2. add transactions [X]
// 3. animate rows [X]
// 4. import transactions
// 5. export transactions
// 6. update transactions [X]
// 7. sorting & filtering panel

const TransactionTable = ({ transactions, status }: TransactionTableProps) => {
    const { filters, setFilters } = useContext(FilterContext);
    const { width } = useViewport();
    const columns: Column<TTransaction>[] = useMemo(
        () => [
            {
                Header: 'Date',
                accessor: 'date',
                Cell: (props) => {
                    return (
                        <div style={{ textAlign: 'center', width: 68 }}>
                            <DateCell transaction={props.row.original} />
                        </div>
                    );
                },
                filter: 'date',
            },
            {
                accessor: 'category.name',
                filter: 'object',
            },
            {
                accessor: 'account.name',
                filter: 'object',
            },
            {
                accessor: 'note',
                filter: 'string',
            },
            {
                Header: 'Name',
                accessor: 'name',
                Cell: (props) => {
                    return (
                        <div style={{ minWidth: 480 }}>
                            <NameCell transaction={props.row.original} />
                        </div>
                    );
                },
                filter: 'string',
            },
            {
                Header: 'Tags',
                accessor: 'tags',
                Cell: (props) => {
                    return (
                        <div style={{ textAlign: 'right', minWidth: 170 }}>
                            <OpenDrawerButton transaction={props.row.original}>
                                <TagCell transaction={props.row.original} />
                            </OpenDrawerButton>
                        </div>
                    );
                },
            },
            {
                Header: 'Amount',
                accessor: 'amount',
                Cell: (props) => {
                    return (
                        <div style={{ textAlign: 'center' }}>
                            <Amount transaction={props.row.original} />
                        </div>
                    );
                },
                filter: 'number',
            },
            {
                Header: 'Status',
                accessor: 'status',
                Cell: (props) => {
                    return (
                        <div style={{ textAlign: 'center', width: 30 }}>
                            <TransactionStatusButton
                                transaction={props.row.original}
                            />
                        </div>
                    );
                },
                filter: 'string',
            },
            {
                accessor: 'd',
                Cell: (props) => {
                    return (
                        <div style={{ textAlign: 'center', width: 30 }}>
                            <OpenDrawerButton transaction={props.row.original}>
                                <ArrowRightOutlined className='drawer-open-btn' />
                            </OpenDrawerButton>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const memorizedFilterTypes = React.useMemo(() => filterTypes, []);

    const tableInstance = useTable(
        {
            columns: columns,
            data: transactions,
            initialState: {
                sortBy: [
                    {
                        id: 'date',
                        desc: true,
                    },
                ],
                pageSize: 25,
            },
            filterTypes: memorizedFilterTypes,
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: 'selection',
                    Cell: ({ row }) => (
                        <div
                            style={{
                                textAlign: 'right',
                                width: 30,
                            }}
                        >
                            <CheckboxCell
                                checked={row.isSelected}
                                toggleRowSelected={row.toggleRowSelected}
                            />
                        </div>
                    ),
                },
                ...columns,
            ]);
        }
    );

    const {
        getTableProps,
        getTableBodyProps,
        rows,
        prepareRow,
        toggleAllRowsSelected,
        toggleRowSelected,
        selectedFlatRows,
        isAllRowsSelected,
        setFilter,
        setAllFilters,
        setHiddenColumns,
        page,
        gotoPage,
        setPageSize,
        state,
    } = tableInstance;

    const { pageIndex } = state;

    useEffect(() => {
        processFilters(filters, setFilter, setAllFilters);
    }, [filters, transactions]);

    useEffect(() => {
        console.log(rows);
    }, [rows]);

    const staticallyHiddenColumns = ['category.name', 'account.name', 'note'];

    useEffect(() => {
        if (width < 1600) {
            setHiddenColumns(['tags', ...staticallyHiddenColumns]);
        } else {
            setHiddenColumns([...staticallyHiddenColumns]);
        }
    }, [width]);

    const handlePagination = (page: number, pageSize?: number | undefined) => {
        console.log('page', page);
        console.log('pageSize', page);

        if (page) {
            gotoPage(page - 1);
        }

        if (pageSize) {
            setPageSize(pageSize);
        }
    };

    return (
        <div
            style={{
                paddingTop: 20,
            }}
        >
            <Header
                selectedFlatRows={selectedFlatRows}
                isAllRowsSelected={isAllRowsSelected}
                toggleAllRowsSelected={toggleAllRowsSelected}
                toggleRowSelected={toggleRowSelected}
                rows={rows}
                setFilter={setFilter}
            />

            {/* <SortFilterPanel /> */}

            {status == 'LOADING' ? (
                <Row style={{ marginTop: 200 }} justify='center' align='middle'>
                    <Col>
                        <Spinner size='large' />
                    </Col>
                </Row>
            ) : (
                <>
                    <Row>
                        <table
                            className='transaction-table'
                            {...getTableProps()}
                        >
                            <tbody {...getTableBodyProps()}>
                                <AnimatePresence>
                                    {
                                        // Loop over the table rows
                                        page.map((row) => {
                                            // Prepare the row for display
                                            prepareRow(row);
                                            return (
                                                // Apply the row props
                                                <motion.tr
                                                    className={
                                                        row.isSelected
                                                            ? 'transaction-row-selected'
                                                            : ''
                                                    }
                                                    {...row.getRowProps({
                                                        layout: true,
                                                        transition: {
                                                            duration: 0.3,
                                                        },
                                                        exit: {
                                                            opacity: 0,
                                                        },
                                                        initial: { opacity: 0 },
                                                        animate: { opacity: 1 },
                                                        key: row.original
                                                            .transaction_id,
                                                    } as RowPropGetter<TTransaction> | undefined)}
                                                >
                                                    {
                                                        // Loop over the rows cells
                                                        row.cells.map(
                                                            (cell, i) => {
                                                                // Apply the cell props
                                                                return (
                                                                    <td
                                                                        {...cell.getCellProps()}
                                                                    >
                                                                        {cell.render(
                                                                            'Cell'
                                                                        )}
                                                                    </td>
                                                                );
                                                            }
                                                        )
                                                    }
                                                </motion.tr>
                                            );
                                        })
                                    }
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </Row>
                    <Row justify='end'>
                        <Pagination
                            total={rows.length}
                            simple
                            defaultPageSize={25}
                            onChange={handlePagination}
                            hideOnSinglePage
                            current={pageIndex + 1}
                        />
                    </Row>
                </>
            )}
        </div>
    );
};

export { TransactionTable };
