import { DragControls } from 'framer-motion';
import { Space, Popconfirm, Popover } from 'antd';
import {
    SettingOutlined,
    MenuOutlined,
    MinusSquareOutlined,
} from '@ant-design/icons';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';
import { SettingsDuck } from '@redux/ducks/settings';
import { ReactNode } from 'react';

const { updateSettings } = SettingsDuck.creators;

const mapDispatchToProps = {
    updateSettings,
};
const mapStateToProps = (state: RootState) => {
    return { settings: state.settings.settings };
};
const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {
    controls?: DragControls;
    settingsPopover?: ReactNode;
    widgetName: 'expenseCard' | 'spendingByAccount' | 'unclearedTransactions';
}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const WidgetControls = connector(
    ({
        controls,
        updateSettings,
        settings,
        widgetName,
        settingsPopover,
    }: Props) => {
        const removeWidget = () => {
            const newOrder = settings.transaction_widget_order.filter(
                (widget) => widget != widgetName
            );
            updateSettings({
                transaction_widget_order: newOrder,
            });
        };

        return (
            <Space size={4}>
                <Popconfirm
                    placement='bottomRight'
                    title='Are you sure to hide this widget?'
                    onConfirm={removeWidget}
                    okText='Yes'
                    cancelText='No'
                    overlayInnerStyle={{
                        padding: '10px 20px',
                    }}
                    okButtonProps={{
                        size: 'small',
                        style: { borderRadius: 16 },
                    }}
                    cancelButtonProps={{
                        size: 'small',
                        style: { borderRadius: 16 },
                    }}
                >
                    <MinusSquareOutlined
                        className='transaction-page-btn'
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                </Popconfirm>
                {settingsPopover && (
                    <Popover
                        placement='bottomRight'
                        trigger={['click']}
                        content={settingsPopover}
                        overlayInnerStyle={{
                            padding: '10px 20px',
                        }}
                    >
                        <SettingOutlined
                            className='transaction-page-btn'
                            style={{
                                cursor: 'pointer',
                            }}
                        />
                    </Popover>
                )}

                <MenuOutlined
                    onPointerDown={(e) => {
                        e.preventDefault();
                        controls && controls.start(e);
                    }}
                    className='transaction-page-btn'
                    style={{
                        cursor: 'grab',
                    }}
                />
            </Space>
        );
    }
);

export { WidgetControls };
