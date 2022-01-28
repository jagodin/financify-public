import { useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
import { Drawer, Select } from 'antd';
import { TTransaction, TransactionsDuck } from '@redux/ducks/transactions';
import { Form, Input, DatePicker, Card, Button, Row, Col } from 'antd';
import { ObjectSelect } from 'components/form-components/ObjectSelect';
import { TagSelect } from 'components/form-components/TagSelectV2';
import moment from 'moment';
import _ from 'lodash';

const { updateTransactions } = TransactionsDuck.creators;
const { isUpdating } = TransactionsDuck.selectors;

const mapDispatchToProps = { updateTransactions };

const mapStateToProps = (state: RootState) => {
    const { categories } = state.categories;
    return { categories, transactions: state.transactions };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
export type FocusableInput = 'name' | 'category' | 'date' | 'account';
interface OwnProps {
    visible: boolean;
    transaction: TTransaction;
    closeDrawer: () => void;
    focusOn?: FocusableInput;
}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const EditTransactionDrawer = connector(
    ({
        transactions,
        categories,
        visible,
        transaction,
        closeDrawer,
        focusOn,
        updateTransactions,
    }: Props) => {
        const [form] = Form.useForm();
        const inputRef = useRef<Input>(null);
        const dateRef = useRef<any>(null);
        const accountRef = useRef<Input>(null);

        useEffect(() => {
            if (visible) {
                switch (focusOn) {
                    case 'name':
                        if (inputRef) {
                            inputRef.current?.focus();
                        }
                        break;
                    case 'date':
                        if (dateRef) {
                            dateRef.current?.focus();
                        }
                        break;
                    case 'account':
                        if (accountRef) {
                            accountRef.current?.focus();
                        }
                        break;
                    default:
                        break;
                }
                form.setFieldsValue({
                    ...transaction,
                    date: moment(transaction.date, 'YYYY-MM-DD'),
                });
            }
        }, [visible]);

        const handleOnFinish = async () => {
            try {
                const data = await form.validateFields();
                if (data.date) {
                    data.date = moment(data.date).format('YYYY-MM-DD');
                }
                updateTransactions([
                    {
                        ...data,
                        transaction_id: transaction.transaction_id,
                        transaction_kind: transaction.transaction_kind,
                    },
                ]);
                console.log(data);
            } catch (err) {
                console.error(err);
            }
        };

        return (
            <Drawer
                title='Transaction Details'
                width={500}
                visible={visible}
                onClose={() => closeDrawer()}
            >
                <Form layout='vertical' form={form} onFinish={handleOnFinish}>
                    <Card>
                        <Form.Item label='Name' name='name'>
                            <Input ref={inputRef} />
                        </Form.Item>
                        <Form.Item label='Date' name='date'>
                            <DatePicker
                                defaultValue={moment(transaction.date)}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    cursor: 'pointer',
                                }}
                                clearIcon={null}
                                ref={dateRef}
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
                            <Input.TextArea
                                rows={1}
                                placeholder='Add a note...'
                            />
                        </Form.Item>
                        <Form.Item label='Account'>
                            <Input
                                disabled
                                placeholder={transaction.account.name}
                                value={transaction.account.name}
                                ref={accountRef}
                            />
                        </Form.Item>
                        <Form.Item label='Tags' name='tags'>
                            <TagSelect />
                        </Form.Item>
                        <Form.Item label='Status' name='status'>
                            <Select
                                options={[
                                    {
                                        value: 'cleared',
                                        label: 'Cleared',
                                    },
                                    {
                                        value: 'uncleared',
                                        label: 'Uncleared',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Card>

                    <Form.Item>
                        <Row justify='space-between'>
                            <Col>
                                <Button danger>Delete</Button>
                            </Col>
                            <Col>
                                <Button
                                    onClick={closeDrawer}
                                    style={{ marginRight: 8 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type='primary'
                                    htmlType='submit'
                                    loading={isUpdating(
                                        transactions,
                                        transaction.transaction_id
                                    )}
                                >
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </Drawer>
        );
    }
);

export { EditTransactionDrawer };
