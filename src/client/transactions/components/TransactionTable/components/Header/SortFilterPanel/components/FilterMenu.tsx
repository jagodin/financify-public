import {
    Menu,
    Modal,
    Input,
    InputNumber,
    Radio,
    Space,
    Select,
    RadioChangeEvent,
    DatePicker,
} from 'antd';
import { useState, useContext } from 'react';
import { SelectInfo } from 'rc-menu/lib/interface';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import {
    FilterType,
    StringComparatorType,
    NumberComparatorType,
    DateComparatorType,
    ObjectComparatorType,
} from '../../types';
import { Moment } from 'moment';
import { FilterContext } from '../../FilterContext';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
const mapDispatchToProps = {};
const mapStateToProps = (state: RootState) => {
    return {
        categories: state.categories.categories,
        accounts: state.accounts.accounts,
    };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {}
type Props = PropsFromRedux & DispatchProps & OwnProps;

type ModalProps = {
    closeModal: () => void;
    visible: boolean;
    field: string;
};

const FilterMenu = connector(({ categories, accounts }: Props) => {
    const [selected, setSelected] = useState<string[]>([]);
    const { filters } = useContext(FilterContext);

    const handleSelect = ({ key }: SelectInfo) => {
        setSelected([key]);
    };

    const closeModal = () => {
        setSelected([]);
    };

    // Only allow one filter for each field
    const canAddFilter = (field: string): boolean => {
        return filters.filter((filter) => filter.field == field).length == 0;
    };

    const renderModal = () => {
        switch (selected[0]) {
            case 'name':
                return (
                    <StringFilterForm
                        closeModal={closeModal}
                        visible={true}
                        field='name'
                    />
                );
            case 'amount':
                return (
                    <NumberFilterForm
                        closeModal={closeModal}
                        visible={true}
                        field='amount'
                    />
                );
            case 'date':
                return (
                    <DateFilterForm
                        closeModal={closeModal}
                        visible={canAddFilter('date')}
                        field='date'
                    />
                );
            case 'category':
                return (
                    <ObjectFilterForm
                        closeModal={closeModal}
                        visible={canAddFilter('category')}
                        field='category'
                        options={[
                            ..._.orderBy(
                                categories,
                                [(object) => object.name.toLowerCase()],
                                ['asc']
                            ).map((object) => {
                                return {
                                    label: object.name,
                                    value: object.name,
                                };
                            }),
                            { label: 'Uncategorized', value: null },
                        ]}
                        objectKey='name'
                    />
                );
            case 'account':
                return (
                    <ObjectFilterForm
                        closeModal={closeModal}
                        visible={canAddFilter('account')}
                        field='account'
                        options={_.orderBy(
                            categories,
                            [(object) => object.name.toLowerCase()],
                            ['asc']
                        ).map((object) => {
                            return {
                                label: object.name,
                                value: object.name,
                            };
                        })}
                        objectKey='name'
                    />
                );
            case 'note':
                return (
                    <StringFilterForm
                        closeModal={closeModal}
                        visible={true}
                        field='note'
                    />
                );
        }
    };

    return (
        <>
            <Menu selectedKeys={selected} onSelect={handleSelect}>
                <Menu.Item disabled={!canAddFilter('name')} key='name'>
                    Name
                </Menu.Item>
                <Menu.Item disabled={!canAddFilter('date')} key='date'>
                    Date
                </Menu.Item>
                <Menu.Item disabled={!canAddFilter('amount')} key='amount'>
                    Amount
                </Menu.Item>
                <Menu.Item disabled={!canAddFilter('account')} key='account'>
                    Account
                </Menu.Item>
                <Menu.Item disabled={!canAddFilter('category')} key='category'>
                    Category
                </Menu.Item>
                <Menu.Item disabled={!canAddFilter('note')} key='note'>
                    Note
                </Menu.Item>
                {/* <Menu.Item key='tags'>Tags</Menu.Item>
                <Menu.Item key='status'>Status</Menu.Item> */}
            </Menu>
            {renderModal()}
        </>
    );
});

const StringFilterForm = ({ closeModal, visible, field }: ModalProps) => {
    const { addFilter } = useContext(FilterContext);
    const [radioValue, setRadioValue] = useState<StringComparatorType>(
        StringComparatorType.contains
    );
    const [inputValue, setInputValue] = useState<string>('');

    const handleRadioChange = (e: RadioChangeEvent) => {
        setRadioValue(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleOk = () => {
        if (inputValue !== '') {
            addFilter({
                filterId: uuidv4(),
                input: inputValue,
                comparator: radioValue,
                type: FilterType.STRING_FILTER,
                field: field,
            });
            closeModal();
        }
    };

    return (
        <Modal
            onOk={handleOk}
            title={`Filter on ${field}`}
            onCancel={closeModal}
            width={300}
            visible={visible}
        >
            <Radio.Group
                onChange={handleRadioChange}
                value={radioValue}
                style={{ width: '100%' }}
            >
                <Space size={20} style={{ width: '100%' }} direction='vertical'>
                    <Radio value={StringComparatorType.contains}>
                        Contains
                    </Radio>
                    <Radio value={StringComparatorType.equal}>Equal to</Radio>
                    <Radio value={StringComparatorType.notEqual}>
                        Not equal to
                    </Radio>
                    <Radio value={StringComparatorType.startsWith}>
                        Starts with
                    </Radio>
                    <Radio value={StringComparatorType.endsWith}>
                        Ends with
                    </Radio>
                    <Input
                        onChange={handleInputChange}
                        value={inputValue}
                        placeholder={`Filter on ${field}...`}
                    />
                </Space>
            </Radio.Group>
        </Modal>
    );
};

const NumberFilterForm = ({ closeModal, visible, field }: ModalProps) => {
    const { addFilter } = useContext(FilterContext);
    const [radioValue, setRadioValue] = useState<NumberComparatorType>(
        NumberComparatorType.equal
    );
    const [inputValue, setInputValue] = useState<number>();
    const [inputValue2, setInputValue2] = useState<number>();

    const handleRadioChange = (e: RadioChangeEvent) => {
        setRadioValue(e.target.value);
    };

    const handleInputChange = (value: any) => {
        setInputValue(value);
    };

    const handleInputChange2 = (value: any) => {
        setInputValue2(value);
    };

    const handleOk = () => {
        if (inputValue && radioValue != NumberComparatorType.between) {
            addFilter({
                filterId: uuidv4(),
                input: inputValue,
                comparator: radioValue,
                type: FilterType.NUMBER_FILTER,
                field: field,
            });
            closeModal();
        } else if (
            inputValue &&
            inputValue2 &&
            radioValue == NumberComparatorType.between
        ) {
            addFilter({
                filterId: uuidv4(),
                input: inputValue,
                input2: inputValue2,
                comparator: radioValue,
                type: FilterType.NUMBER_FILTER,
                field: field,
            });
            closeModal();
        }
    };

    return (
        <Modal
            onOk={handleOk}
            title={`Filter on ${field}`}
            onCancel={closeModal}
            width={300}
            visible={visible}
        >
            <Radio.Group
                onChange={handleRadioChange}
                value={radioValue}
                style={{ width: '100%' }}
            >
                <Space size={20} style={{ width: '100%' }} direction='vertical'>
                    <Radio value={NumberComparatorType.equal}>Equal to</Radio>
                    <Radio value={NumberComparatorType.notEqual}>
                        Not equal to
                    </Radio>
                    <Radio value={NumberComparatorType.greaterThan}>
                        Greater than
                    </Radio>
                    <Radio value={NumberComparatorType.greaterThanOrEqual}>
                        Greater than or equal
                    </Radio>
                    <Radio value={NumberComparatorType.lessThan}>
                        Less than
                    </Radio>
                    <Radio value={NumberComparatorType.lessThanOrEqual}>
                        Less than or equal
                    </Radio>
                    <Radio value={NumberComparatorType.between}>
                        Is between
                    </Radio>
                    {radioValue == NumberComparatorType.between ? (
                        <Space direction='vertical' style={{ width: '100%' }}>
                            <InputNumber
                                style={{ width: '100%' }}
                                onChange={handleInputChange}
                                value={inputValue}
                                placeholder={`Input a number...`}
                            />
                            <span
                                style={{
                                    fontSize: 14,
                                    fontWeight: 500,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    display: 'flex',
                                }}
                            >
                                and
                            </span>
                            <InputNumber
                                style={{ width: '100%' }}
                                onChange={handleInputChange2}
                                value={inputValue2}
                                placeholder={`Input a number...`}
                            />
                        </Space>
                    ) : (
                        <InputNumber
                            style={{ width: '100%' }}
                            onChange={handleInputChange}
                            value={inputValue}
                            placeholder={`Input a number...`}
                        />
                    )}
                </Space>
            </Radio.Group>
        </Modal>
    );
};

const DateFilterForm = ({ closeModal, visible, field }: ModalProps) => {
    const { addFilter } = useContext(FilterContext);
    const [radioValue, setRadioValue] = useState<DateComparatorType>(
        DateComparatorType.on
    );
    const [inputValue, setInputValue] = useState<Moment>();
    const [rangePickerValue, setRangePickerValue] =
        useState<[Moment, Moment]>();

    const handleRadioChange = (e: RadioChangeEvent) => {
        setRadioValue(e.target.value);
    };

    const handleInputChange = (value: any) => {
        setInputValue(value);
    };

    const handleRangePickerChange = (value: any) => {
        setRangePickerValue([value[0], value[1]]);
    };

    const handleOk = () => {
        if (inputValue && radioValue != DateComparatorType.between) {
            addFilter({
                filterId: uuidv4(),
                date1: inputValue,
                comparator: radioValue,
                type: FilterType.DATE_FILTER,
                field: field,
            });
            closeModal();
        } else if (rangePickerValue) {
            console.log('here');
            addFilter({
                filterId: uuidv4(),
                date1: rangePickerValue[0],
                date2: rangePickerValue[1],
                comparator: radioValue,
                type: FilterType.DATE_FILTER,
                field: field,
            });
            closeModal();
        }
    };

    return (
        <Modal
            onOk={handleOk}
            title={`Filter on ${field}`}
            onCancel={closeModal}
            width={300}
            visible={visible}
        >
            <Radio.Group
                onChange={handleRadioChange}
                value={radioValue}
                style={{ width: '100%' }}
            >
                <Space size={20} style={{ width: '100%' }} direction='vertical'>
                    <Radio value={DateComparatorType.on}>Is on</Radio>
                    <Radio value={DateComparatorType.before}>Is before</Radio>
                    <Radio value={DateComparatorType.after}>Is after</Radio>
                    <Radio value={DateComparatorType.between}>Is between</Radio>
                    {radioValue == DateComparatorType.between ? (
                        <DatePicker.RangePicker
                            style={{ width: '100%' }}
                            onChange={handleRangePickerChange}
                            value={rangePickerValue}
                            placeholder={[
                                'Select a date...',
                                'Select a date...',
                            ]}
                        />
                    ) : (
                        <DatePicker
                            style={{ width: '100%' }}
                            onChange={handleInputChange}
                            value={inputValue}
                            placeholder={`Filter on ${field}...`}
                        />
                    )}
                </Space>
            </Radio.Group>
        </Modal>
    );
};

type Option = {
    label: string;
    value: any;
};

interface ObjectFilterFormProps extends ModalProps {
    objectKey: string;
    options: Option[];
}

const ObjectFilterForm = ({
    closeModal,
    visible,
    field,
    objectKey,
    options,
}: ObjectFilterFormProps) => {
    const { addFilter } = useContext(FilterContext);
    const [radioValue, setRadioValue] = useState<ObjectComparatorType>(
        ObjectComparatorType.equal
    );
    const [inputValue, setInputValue] = useState<string>('');

    const handleRadioChange = (e: RadioChangeEvent) => {
        setRadioValue(e.target.value);
    };

    const handleSelect = (value: any, option: any) => {
        setInputValue(value);
    };

    const handleOk = () => {
        if (inputValue !== '') {
            addFilter({
                filterId: uuidv4(),
                comparator: radioValue,
                type: FilterType.OBJECT_FILTER,
                field: field,
                objectValue: inputValue,
                objectKey: objectKey,
            });
            closeModal();
        }
    };

    return (
        <Modal
            onOk={handleOk}
            title={`Filter on ${field}`}
            onCancel={closeModal}
            width={300}
            visible={visible}
        >
            <Radio.Group
                onChange={handleRadioChange}
                value={radioValue}
                style={{ width: '100%' }}
            >
                <Space size={20} style={{ width: '100%' }} direction='vertical'>
                    <Radio value={ObjectComparatorType.equal}>Equal to</Radio>
                    <Radio value={ObjectComparatorType.notEqual}>
                        Not equal to
                    </Radio>
                    <Select
                        style={{ width: '100%' }}
                        options={options}
                        placeholder={`Filter on ${field}...`}
                        onSelect={handleSelect}
                    />
                </Space>
            </Radio.Group>
        </Modal>
    );
};

export { FilterMenu };
