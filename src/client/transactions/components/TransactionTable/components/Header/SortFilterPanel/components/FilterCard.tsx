import React from 'react';
import { Tag } from 'antd';
import {
    Filter,
    StringFilterModel,
    NumberFilterModel,
    FilterType,
} from '../../types';

interface FilterCardProps {
    filter: Filter;
    removeFilter: (filter_id: string) => void;
}

const FilterCard = ({ filter, removeFilter }: FilterCardProps) => {
    const handleClose = () => {
        removeFilter(filter.filterId);
    };

    const tagStyles: React.CSSProperties = {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        fontSize: 14,
        marginRight: 10,
        marginBottom: 10,
    };

    const fontWeight = 600;

    const renderFilterCard = () => {
        switch (filter.type) {
            case FilterType.STRING_FILTER:
                return (
                    <Tag closable onClose={handleClose} style={tagStyles}>
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.field.charAt(0).toUpperCase() +
                                filter.field.slice(1)}
                        </span>
                        &nbsp;
                        {filter.comparator}
                        &nbsp;
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.input}
                        </span>
                    </Tag>
                );
            case FilterType.NUMBER_FILTER:
                return (
                    <Tag closable onClose={handleClose} style={tagStyles}>
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.field.charAt(0).toUpperCase() +
                                filter.field.slice(1)}
                        </span>
                        &nbsp;
                        {filter.comparator}
                        &nbsp;
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.input}
                        </span>
                        {filter.input2 && (
                            <>
                                <span>&nbsp;and&nbsp;</span>
                                <span style={{ fontWeight: fontWeight }}>
                                    {filter.input2}
                                </span>
                            </>
                        )}
                    </Tag>
                );
            case FilterType.DATE_FILTER:
                return (
                    <Tag closable onClose={handleClose} style={tagStyles}>
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.field.charAt(0).toUpperCase() +
                                filter.field.slice(1)}
                        </span>
                        &nbsp;
                        {filter.comparator}
                        &nbsp;
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.date1.format('MMM Do, YYYY')}
                        </span>
                        {filter.date2 && (
                            <>
                                <span>&nbsp;and&nbsp;</span>
                                <span style={{ fontWeight: fontWeight }}>
                                    {filter.date2.format('MMM Do, YYYY')}
                                </span>
                            </>
                        )}
                    </Tag>
                );
            case FilterType.OBJECT_FILTER:
                return (
                    <Tag closable onClose={handleClose} style={tagStyles}>
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.field.charAt(0).toUpperCase() +
                                filter.field.slice(1)}
                        </span>
                        &nbsp;
                        {filter.comparator}
                        &nbsp;
                        <span style={{ fontWeight: fontWeight }}>
                            {filter.field == 'category' &&
                            filter.objectValue == null
                                ? 'Uncategorized'
                                : filter.objectValue}
                        </span>
                    </Tag>
                );
        }
    };

    return renderFilterCard();
};

export { FilterCard };
