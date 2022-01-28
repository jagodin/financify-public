import React from 'react';
import { Row, Col, Space, Skeleton } from 'antd';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import { GoDash } from 'react-icons/go';
import { formatCurrency } from 'utils/formatCurrency';

interface StatProps {
    value: number;
    title: string;
    currency?: 'CAD' | 'USD' | 'EUR';
    loading?: boolean;
    showCaret?: boolean;
    isCurrency?: boolean;
}

const Stat = ({
    value,
    title,
    currency = 'USD',
    loading = false,
    showCaret = true,
    isCurrency = true,
}: StatProps) => {
    const Caret = () => {
        if (value > 0) {
            return <CaretUpFilled style={{ color: '#21B573' }} />;
        } else if (value < 0) {
            return <CaretDownFilled style={{ color: '#DE4436' }} />;
        } else {
            return <GoDash />;
        }
    };

    // Verticle and horizontal alignment example
    return (
        <Row>
            <Col>
                <Row justify='center'>
                    <h4>{title}</h4>
                </Row>
                <Row align='middle' justify='center'>
                    <Space>
                        {loading ? (
                            <Skeleton.Button
                                style={{ width: 120 }}
                                active={true}
                            />
                        ) : (
                            <>
                                {showCaret && <Caret />}
                                <h2>
                                    {isCurrency
                                        ? formatCurrency({
                                              value: Math.abs(value),
                                              iso_currency_code: currency,
                                          })
                                        : value}
                                </h2>
                            </>
                        )}
                    </Space>
                </Row>
            </Col>
        </Row>
    );
};

export { Stat };
