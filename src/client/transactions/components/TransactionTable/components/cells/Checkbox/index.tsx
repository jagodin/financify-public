import { Checkbox } from 'antd';

const CheckboxCell = ({
    toggleRowSelected,
    checked,
}: {
    toggleRowSelected: (set?: boolean | undefined) => void;
    checked: boolean;
}) => {
    const handleOnChange = () => {
        toggleRowSelected();
    };

    return (
        <Checkbox
            style={{ borderSpacing: 0 }}
            checked={checked}
            onChange={handleOnChange}
        />
    );
};

export { CheckboxCell };
