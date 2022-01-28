import React, { useState } from 'react';
import { BudgetType } from '../index';
import { Row, Col, Space } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import chroma from 'chroma-js';
import { formatCurrency } from 'utils/formatCurrency';

interface OwnProps {
    loading?: boolean;
}

type Props = OwnProps & BudgetType;

const Budget = ({
    name,
    amount,
    iso_currency_code,
    month,
    year,
    budget,
    color,
    loading,
}: Props) => {
    const [hover, setHover] = useState<boolean>(false);
    const backgroundColor = chroma(color).alpha(0.05).hex('rgba');

    return (
        <Row
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={
                hover
                    ? {
                          backgroundColor: chroma(color)
                              .alpha(0.12)
                              .hex('rgba'),
                      }
                    : { backgroundColor }
            }
            className='budget'
            justify='space-between'
            align='middle'
        >
            <Col style={{ display: 'flex', alignItems: 'center' }}>
                <Space size={18} direction='horizontal'>
                    <BudgetCircleIndicator
                        size={42}
                        amount={amount}
                        budget={budget}
                        color={color}
                        hover={hover}
                    />
                    <div
                        style={{
                            display: 'flex',
                            // alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <span style={{ lineHeight: 1 }}>{name}</span>
                        <span style={{ fontWeight: 600, fontSize: 18 }}>
                            {formatCurrency({
                                value: amount,
                            })}
                        </span>
                    </div>
                </Space>
            </Col>
            <Col style={{ display: 'flex', alignItems: 'center' }}>
                <ArrowRightOutlined
                    onClick={() => console.log('do something')}
                    className='open-budget-btn'
                />
            </Col>
        </Row>
    );
};

type BudgetCircleIndicator = {
    size: number;
    amount: number;
    budget: number;
    radius?: number;
    strokeWidth?: number;
    color?: string;
    emptyStrokeOpacity?: number;
    duration?: number;
    delay?: number;
    hover?: boolean;
};

const BudgetCircleIndicator = ({
    size,
    radius = 45,
    strokeWidth = 14,
    color,
    emptyStrokeOpacity = 0.25,
    amount,
    budget,
    duration = 0.6,
    delay = 0.2,
    hover,
}: BudgetCircleIndicator) => {
    const emptyStroke = color;
    const percent = Math.ceil((amount / budget) * 100);

    const circumference = Math.ceil(2 * Math.PI * radius);
    const fillPercents = Math.abs(
        Math.ceil((circumference / 100) * ((amount / budget) * 100 - 100))
    );

    const transition = {
        duration: duration,
        delay: delay,
        ease: 'easeInOut',
    };

    const variants = {
        hidden: {
            strokeDashoffset: circumference,
            transition,
        },
        show: {
            strokeDashoffset: fillPercents,
            transition,
        },
    };

    return (
        <div style={{ lineHeight: 0 }}>
            <svg
                viewBox='0 0 100 100'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
                width={size}
                height={size}
            >
                <circle
                    cx='50'
                    cy='50'
                    r={radius}
                    className='circle'
                    strokeWidth={strokeWidth}
                    stroke={emptyStroke}
                    strokeOpacity={emptyStrokeOpacity}
                    fill='transparent'
                />

                <text
                    x='50%'
                    y='50%'
                    text-anchor='middle'
                    dy='.35em'
                    stroke-width='10px'
                    font-size='1.8em'
                >
                    {`${percent}%`}
                </text>
            </svg>
            <svg
                viewBox='0 0 100 100'
                width={size}
                height={size}
                style={{
                    position: 'absolute',
                    transform: 'rotate(-45deg)',
                    overflow: 'visible',
                    marginLeft: -size,
                }}
            >
                <motion.circle
                    cx='50'
                    cy='50'
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke={color}
                    fill='transparent'
                    strokeDashoffset={fillPercents}
                    strokeDasharray={circumference}
                    variants={variants}
                    initial='hidden'
                    animate={'show'}
                />
            </svg>
        </div>
    );
};

export { Budget };
