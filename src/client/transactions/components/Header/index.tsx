import React from 'react';
import { Button, Col, Row, Space, Tooltip } from 'antd';
import {
    PlusOutlined,
    CalendarOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { ButtonProps } from 'antd/es/button';
import { DateMode } from '../../index';
import moment, { Moment } from 'moment';
import TSwiper from 'swiper';
import { CreateTransactionForm } from '../CreateTransactionForm';

interface TransactionsTitleProps {
    mode?: DateMode;
}

const TransactionsTitle: React.FC<TransactionsTitleProps> = ({ mode }) => {
    let base = 'Transactions';
    switch (mode) {
        case 'day':
            return <h1 className='font-weight-bolder'>{`Daily ${base}`}</h1>;
        case 'month':
            return <h1 className='font-weight-bolder'>{`Monthly ${base}`}</h1>;
        case 'week':
            return <h1 className='font-weight-bolder'>{`Weekly  ${base}`}</h1>;
        default:
            return <h1 className='font-weight-bolder'>{base}</h1>;
    }
};

interface ButtonActionProps extends ButtonProps {
    goToToday: () => void;
}

const ButtonActions: React.FC<ButtonActionProps> = ({
    type,
    shape,
    goToToday,
}) => {
    return (
        <Space direction='horizontal' size={12}>
            <Tooltip title='Add a Transaction'>
                <CreateTransactionForm />
            </Tooltip>
            <Tooltip title='Go to Today'>
                <Button
                    onClick={goToToday}
                    type={type}
                    icon={<CalendarOutlined />}
                    shape={shape}
                />
            </Tooltip>

            <Tooltip title='Settings'>
                <Button type={type} icon={<SettingOutlined />} shape={shape} />
            </Tooltip>
        </Space>
    );
};

const Header = ({
    mode,
    setDate,
    swiper,
    dates,
    date,
    indexOffset,
}: {
    mode: DateMode;
    setDate: React.Dispatch<React.SetStateAction<moment.Moment>>;
    swiper: TSwiper | undefined;
    dates: Moment[] | undefined;
    date: Moment;
    indexOffset: number;
}) => {
    const goToToday = () => {
        if (dates) {
            const newDate = moment();
            setDate(newDate);
            const dateStrings = dates.map((newDate) =>
                newDate.format('YYYYMM')
            );
            const index = dateStrings.findIndex(
                (v) => v == newDate.format('YYYYMM')
            );
            swiper?.slideTo(index - indexOffset);
        }
    };

    return (
        <div>
            <Row justify='space-between'>
                <Col>
                    <TransactionsTitle mode={mode} />
                </Col>
                <Col>
                    <ButtonActions
                        shape='circle'
                        type='primary'
                        goToToday={goToToday}
                    />
                </Col>
            </Row>
        </div>
    );
};

export { Header };
