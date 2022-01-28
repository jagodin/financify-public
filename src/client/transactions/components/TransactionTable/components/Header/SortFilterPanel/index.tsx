import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';
import React, { useContext } from 'react';
import { Row, Col, Button, Popover } from 'antd';
import { FiChevronsUp } from 'react-icons/fi';
import { FilterMenu } from './components/FilterMenu';
import { FilterCard } from './components/FilterCard';
import { FilterContext } from '../FilterContext';

const panelMotionProps: HTMLMotionProps<'section'> = {
    layout: true,
    transition: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] },
    animate: 'open',
    initial: 'collapsed',
    exit: 'collapsed',
    variants: {
        open: { opacity: 1, height: 'auto' },
        collapsed: { opacity: 0, height: 0 },
    },
};

interface SortFilterPanelProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SortFilterPanel = ({ open, setOpen }: SortFilterPanelProps) => {
    const closePanel = () => {
        setOpen(false);
    };

    const { filters, addFilter, removeAllFilters, removeFilter } =
        useContext(FilterContext);

    return (
        <AnimatePresence initial={false}>
            {open && (
                <motion.section
                    style={{
                        width: '100%',
                    }}
                    {...panelMotionProps}
                >
                    <Row gutter={[10, 0]}>
                        <Popover
                            placement='bottom'
                            content={<FilterMenu />}
                            trigger={['click']}
                        >
                            <Button style={{ marginRight: 10 }}>
                                Add Filter
                            </Button>
                        </Popover>
                        {filters.map((filter) => {
                            return (
                                <FilterCard
                                    key={filter.filterId}
                                    filter={filter}
                                    removeFilter={removeFilter}
                                />
                            );
                        })}
                        {filters.length > 0 && (
                            <Button onClick={removeAllFilters}>
                                Clear Filters
                            </Button>
                        )}
                    </Row>
                    <Row style={{ paddingBottom: 10 }} justify='center'>
                        <Col>
                            <div
                                onClick={closePanel}
                                className='transaction-table-header-btn'
                            >
                                <FiChevronsUp />
                            </div>
                        </Col>
                    </Row>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

export { SortFilterPanel };
