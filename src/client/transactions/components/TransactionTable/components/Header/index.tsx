import { Checkbox, Row, Col, Input, Space, Popover } from 'antd';
import {
    CaretDownOutlined,
    EditOutlined,
    ExportOutlined,
    ImportOutlined,
    FilterOutlined,
} from '@ant-design/icons';
import { Row as TableRow } from 'react-table';
import { useState, useContext } from 'react';

import { TTransaction } from '@redux/ducks/transactions';
import { SelectMenu } from './SelectMenu';
import { EditMenu } from './EditMenu';
import { SearchBar } from './SearchBar';
import { SortFilterPanel } from './SortFilterPanel';
import { FilterContext } from './FilterContext';

interface HeaderProps {
    toggleAllRowsSelected?: (value?: boolean | undefined) => void;
    isAllRowsSelected: boolean;
    selectedFlatRows: TableRow<TTransaction>[];
    rows: TableRow<TTransaction>[];
    setFilter: (columnId: string, updater: any) => void;
    toggleRowSelected: (rowId: string, set?: boolean | undefined) => void;
}

const Header = ({
    toggleAllRowsSelected,
    toggleRowSelected,
    isAllRowsSelected,
    selectedFlatRows,
    rows,
    setFilter,
}: HeaderProps) => {
    const { filters, setFilters, filterPanelOpen, setFilterPanelOpen } =
        useContext(FilterContext);

    const handleSelectedAllTransactions = () => {
        if (toggleAllRowsSelected) {
            toggleAllRowsSelected();
        }
    };

    const toggleFilterPanelOpen = () => {
        if (filterPanelOpen) {
            setFilterPanelOpen(false);
        } else {
            setFilterPanelOpen(true);
        }
    };

    return (
        <div>
            <Row
                justify='space-between'
                align='middle'
                gutter={[10, 0]}
                style={{ paddingBottom: 20 }}
            >
                <Col span={14}>
                    <Space direction='horizontal' size={30}>
                        <Space direction='horizontal'>
                            <Checkbox
                                checked={isAllRowsSelected}
                                onClick={handleSelectedAllTransactions}
                            />
                            <Popover
                                placement='bottom'
                                content={
                                    <SelectMenu
                                        toggleAllRowsSelected={
                                            toggleAllRowsSelected
                                        }
                                        rows={rows}
                                        toggleRowSelected={toggleRowSelected}
                                    />
                                }
                                trigger={['click']}
                            >
                                <CaretDownOutlined
                                    className='transaction-table-header-caret'
                                    onClick={() => console.log('placeholder')}
                                />
                            </Popover>
                        </Space>
                        <div className='transaction-table-header-btn'>
                            <Popover
                                content={
                                    <EditMenu
                                        selectedRows={selectedFlatRows}
                                        isDisabled={
                                            selectedFlatRows.length == 0
                                        }
                                    />
                                }
                                placement='bottom'
                                trigger={['click']}
                            >
                                <span className='transaction-table-header-title'>
                                    {selectedFlatRows.length > 0
                                        ? `Edit (${selectedFlatRows.length})`
                                        : 'Edit'}
                                </span>
                                <EditOutlined />
                            </Popover>
                        </div>
                        <div className='transaction-table-header-btn'>
                            <span className='transaction-table-header-title'>
                                Export
                            </span>
                            <ExportOutlined />
                        </div>
                        <div className='transaction-table-header-btn'>
                            <span className='transaction-table-header-title'>
                                Import
                            </span>
                            <ImportOutlined />
                        </div>
                        <div
                            onClick={toggleFilterPanelOpen}
                            className={
                                filterPanelOpen
                                    ? 'transaction-table-header-btn transaction-table-header-btn-selected'
                                    : 'transaction-table-header-btn'
                            }
                        >
                            <span className='transaction-table-header-title'>
                                {filters.length > 0
                                    ? `Filters (${filters.length})`
                                    : 'Filters'}
                            </span>
                            <FilterOutlined />
                        </div>
                    </Space>
                </Col>
                <Col span={10}>
                    <SearchBar setFilter={setFilter} />
                </Col>
            </Row>
            <Row>
                <SortFilterPanel
                    open={filterPanelOpen}
                    setOpen={setFilterPanelOpen}
                />
            </Row>
        </div>
    );
};

export { Header };
