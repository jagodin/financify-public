import { Form, Switch, Select } from 'antd';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
import { SettingsDuck } from '@redux/ducks/settings';

const { updateSettings } = SettingsDuck.creators;

const mapDispatchToProps = { updateSettings };
const mapStateToProps = (state: RootState) => {
    return { accounts: state.accounts.accounts, settings: state.settings };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const Settings = connector(({ accounts, settings, updateSettings }: Props) => {
    const [form] = Form.useForm();

    const {
        widget_spending_account_even_spending,
        widget_spending_account_sort_by,
    } = settings.settings;

    const initialValues = {
        widget_spending_account_even_spending,
        widget_spending_account_sort_by,
    };

    const handleValuesChange = (values: any) => {
        updateSettings(values, { showNotification: false });
    };

    return (
        <div>
            <Form
                onValuesChange={handleValuesChange}
                initialValues={initialValues}
                form={form}
            >
                <Form.Item
                    label='Show Accounts with Even Spending'
                    name='widget_spending_account_even_spending'
                >
                    <Switch
                        checked={widget_spending_account_even_spending}
                        size='small'
                    />
                </Form.Item>
                <Form.Item
                    label='Sort by'
                    name='widget_spending_account_sort_by'
                >
                    <Select
                        size='small'
                        options={[
                            { label: 'Ascending Total', value: 'asc_total' },
                            { label: 'Descending Total', value: 'desc_total' },
                        ]}
                    />
                </Form.Item>
            </Form>
        </div>
    );
});

export { Settings };
