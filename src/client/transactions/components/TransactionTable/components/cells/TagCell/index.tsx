import { TTransaction } from '@redux/ducks/transactions';
import { Space } from 'antd';
import { BsCircleFill } from 'react-icons/bs';

const TagCell = ({ transaction }: { transaction: TTransaction }) => {
    const { tags } = transaction;

    const renderTags = () =>
        tags
            ?.map((tag, i) => {
                if (i > 1) return null;

                return (
                    <div
                        key={i}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <BsCircleFill
                            color={tag.color}
                            style={{
                                marginRight: 8,
                                fontSize: 18,
                            }}
                        />
                        <span style={{ fontWeight: 500 }}>{tag.name}</span>
                    </div>
                );
            })
            .filter((e) => e != null);

    return (
        <Space size={15} direction='horizontal'>
            {renderTags()}
            {tags.length > 2 ? (
                <span style={{ fontWeight: 500 }}>{`+ ${
                    tags.length - 2
                } more`}</span>
            ) : null}
        </Space>
    );
};

export { TagCell };
