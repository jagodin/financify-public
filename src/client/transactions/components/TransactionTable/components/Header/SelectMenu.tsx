import { Menu } from 'antd';
import { Row } from 'react-table';
import { TTransaction } from '@redux/ducks/transactions';

interface SelectMenuProps {
    rows: Row<TTransaction>[];
    toggleAllRowsSelected?: (value?: boolean | undefined) => void;
    toggleRowSelected: (rowId: string, set?: boolean | undefined) => void;
}

const SelectMenu = ({
    rows,
    toggleAllRowsSelected,
    toggleRowSelected,
}: SelectMenuProps) => {
    const handleSelectAll = () => {
        if (toggleAllRowsSelected) {
            toggleAllRowsSelected(true);
        }
    };

    const handleSelectNone = () => {
        if (toggleAllRowsSelected) {
            toggleAllRowsSelected(false);
        }
    };

    const handleSelectCleared = () => {
        handleSelectNone();
        for (const row of rows) {
            if (row.original.status == 'cleared') {
                try {
                    toggleRowSelected(row.id, true);
                } catch (err) {
                    console.error(`Unable to select row ${row.id}: ${err}`);
                }
            }
        }
    };

    const handleSelectUncleared = () => {
        handleSelectNone();
        for (const row of rows) {
            if (row.original.status == 'uncleared') {
                try {
                    toggleRowSelected(row.id, true);
                } catch (err) {
                    console.error(`Unable to select row ${row.id}: ${err}`);
                }
            }
        }
    };

    const handleSelectUncategorized = () => {
        handleSelectNone();
        for (const row of rows) {
            if (row.original.category_id == null) {
                try {
                    toggleRowSelected(row.id, true);
                } catch (err) {
                    console.error(`Unable to select row ${row.id}: ${err}`);
                }
            }
        }
    };

    return (
        <Menu selectedKeys={[]}>
            <Menu.Item key='all' onClick={handleSelectAll}>
                All
            </Menu.Item>
            <Menu.Item key='none' onClick={handleSelectNone}>
                None
            </Menu.Item>
            <Menu.Item key='cleared' onClick={handleSelectCleared}>
                Cleared
            </Menu.Item>
            <Menu.Item key='unclear' onClick={handleSelectUncleared}>
                Uncleared
            </Menu.Item>
            <Menu.Item key='uncategorized' onClick={handleSelectUncategorized}>
                Uncategorized
            </Menu.Item>
        </Menu>
    );
};

export { SelectMenu };
