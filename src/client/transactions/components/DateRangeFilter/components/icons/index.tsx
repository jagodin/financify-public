import React from 'react';
import { Moment } from 'moment';

interface IconProps extends React.DOMAttributes<HTMLHtmlElement> {
    date: Moment;
    selected?: boolean;
}

const DayIcon = ({ date, selected }: IconProps) => {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                userSelect: 'none',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <p
                    className={
                        selected
                            ? 'day-icon-header-selected day-icon-header'
                            : 'day-icon-header'
                    }
                >
                    {date.format('ddd').toUpperCase()}
                </p>

                <div
                    className={
                        selected ? 'day-icon-selected day-icon' : 'day-icon'
                    }
                >
                    <p>{date.format('D')}</p>
                </div>
            </div>
        </div>
    );
};

const MonthIcon = ({ date, selected }: IconProps) => {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                userSelect: 'none',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <p
                    className={
                        selected
                            ? 'day-icon-header-selected day-icon-header'
                            : 'day-icon-header'
                    }
                >
                    {date.format('YYYY')}
                </p>

                <div
                    className={
                        selected ? 'day-icon-selected day-icon' : 'day-icon'
                    }
                >
                    <p>{date.format('MMM')}</p>
                </div>
            </div>
        </div>
    );
};

export { DayIcon, MonthIcon };
