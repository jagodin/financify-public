import { Form, Input, Modal, DatePicker, Button } from 'antd';
import { TagSelect } from 'components/form-components/TagSelectV2';
import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
import { PlusOutlined } from '@ant-design/icons';
import { ObjectSelect } from 'components/form-components/ObjectSelect';
import { CurrencySelect } from 'components/form-components/CurrencySelect';
import _ from 'lodash';

import { TransactionsDuck } from '@redux/ducks/transactions';
import moment from 'moment';

const { addTransactions } = TransactionsDuck.creators;

const mapDispatchToProps = {
    addTransactions,
};
const mapStateToProps = (state: RootState) => {
    const { categories } = state.categories;
    const { accounts } = state.accounts;

    return { categories, accounts };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const CreateTransactionForm = connector(
    ({ categories, accounts, addTransactions }: Props) => {
        const [form] = Form.useForm();
        const [modalVisible, setModalVisible] = useState(false);

        const showModal = () => {
            setModalVisible(true);
        };

        const closeModal = () => {
            setModalVisible(false);
        };

        const handleChange = (values: any) => {
            form.setFieldsValue(values);
        };

        const handleOnFinish = async (values: any) => {
            const valuesClone = { ...values };
            if (valuesClone.hasOwnProperty('date')) {
                valuesClone.date = valuesClone.date.format('YYYY-MM-DD');
            }

            form.validateFields()
                .then((values) => {
                    addTransactions([valuesClone]);
                    closeModal();
                })
                .catch((err) => {
                    console.error(err);
                });
        };

        return (
            <>
                <Button
                    onClick={showModal}
                    type='primary'
                    icon={<PlusOutlined />}
                    shape='circle'
                />
                <Modal
                    title='Add a Transaction'
                    visible={modalVisible}
                    centered={true}
                    bodyStyle={{ overflowY: 'scroll' }}
                    footer={[
                        <Button onClick={() => closeModal()}>Cancel</Button>,
                        <Button
                            form='modal-form'
                            key='submit'
                            htmlType='submit'
                            type='primary'
                            // onClick={() => closeModal()} // Call form validation
                        >
                            Submit
                        </Button>,
                    ]}
                    onCancel={() => closeModal()}
                    destroyOnClose={true}
                >
                    <Form
                        form={form}
                        layout='vertical'
                        onFinish={handleOnFinish}
                        onValuesChange={handleChange}
                        id='modal-form'
                        preserve={false}
                    >
                        <Form.Item
                            label='Name'
                            name='name'
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder='e.g. Rent' />
                        </Form.Item>
                        <Form.Item
                            label='Amount'
                            name='amount'
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input placeholder='Enter an amount...' />
                        </Form.Item>
                        <Form.Item
                            label='Currency'
                            name='iso_currency_code'
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <CurrencySelect />
                        </Form.Item>
                        <Form.Item
                            label='Date'
                            name='date'
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            initialValue={moment()}
                        >
                            <DatePicker
                                placeholder='Select a date...'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    cursor: 'pointer',
                                }}
                                clearIcon={null}
                                format='YYYY-MM-DD'
                            />
                        </Form.Item>
                        <Form.Item
                            label='Account'
                            name={['account']}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <ObjectSelect
                                labelName='name'
                                options={_.orderBy(
                                    accounts,
                                    [(account) => account.name.toLowerCase()],
                                    ['asc']
                                ).filter(
                                    (account) =>
                                        account.account_kind == 'manual_account'
                                )}
                                placeholder='Select an account...'
                            />
                        </Form.Item>
                        <Form.Item label='Category' name={['category']}>
                            <ObjectSelect
                                labelName='name'
                                options={_.orderBy(
                                    categories,
                                    [(category) => category.name.toLowerCase()],
                                    ['asc']
                                )}
                                placeholder='Add a category...'
                            />
                        </Form.Item>
                        <Form.Item label='Notes' name='note'>
                            <Input placeholder='Add a note...' />
                        </Form.Item>
                        <Form.Item label='Tags' name={['tags']}>
                            <TagSelect />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        );
    }
);

export { CreateTransactionForm };
