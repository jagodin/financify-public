import { Menu, Row, Col } from 'antd';
import { TagOutlined, CheckCircleFilled } from '@ant-design/icons';
import { VscCircleFilled } from 'react-icons/vsc';
import { GoDiffRemoved } from 'react-icons/go';
import { BiCategoryAlt } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import _ from 'lodash';
import { Row as TableRow } from 'react-table';
import { TTransaction } from '@redux/ducks/transactions';
import { MenuInfo } from 'rc-menu/lib/interface';

import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '@redux/store';

import { TransactionsDuck } from '@redux/ducks/transactions';
import { TTag } from '@redux/ducks/tags';

const { updateTransactions, updateStatus, deleteTransactions } =
    TransactionsDuck.creators;

const mapDispatchToProps = {
    updateTransactions,
    updateStatus,
    deleteTransactions,
};

const mapStateToProps = (state: RootState) => {
    const { categories } = state.categories;
    const { tags } = state.tags;

    return { categories, tags };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type DispatchProps = typeof mapDispatchToProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
interface OwnProps {
    selectedRows: TableRow<TTransaction>[];
    isDisabled: boolean;
}
type Props = PropsFromRedux & DispatchProps & OwnProps;

const EditMenu = connector(
    ({
        updateStatus,
        updateTransactions,
        deleteTransactions,
        tags,
        categories,
        selectedRows,
        isDisabled,
    }: Props) => {
        const clearTransactions = () => {
            const payload = selectedRows.map((row) => {
                return {
                    transaction_id: row.original.transaction_id,
                    transaction_kind: row.original.transaction_kind,
                    status: 'cleared',
                };
            });

            updateStatus(payload);
        };

        const unclearTransactions = () => {
            const payload = selectedRows.map((row) => {
                return {
                    transaction_id: row.original.transaction_id,
                    transaction_kind: row.original.transaction_kind,
                    status: 'uncleared',
                };
            });

            updateStatus(payload);
        };

        const setCategory = (menuItem: MenuInfo) => {
            const categoryObj = categories.find((category) => {
                return category.category_id == parseInt(menuItem.key);
            });
            const payload = selectedRows.map((row) => {
                return {
                    transaction_id: row.original.transaction_id,
                    transaction_kind: row.original.transaction_kind,
                    category: categoryObj,
                };
            });

            updateTransactions(payload);
        };

        const removeTransactions = () => {
            const payload = selectedRows.map(
                (row) => row.original.transaction_id
            );
            deleteTransactions(payload);
        };

        const removeTags = () => {
            const payload = selectedRows.map((row) => {
                return {
                    transaction_id: row.original.transaction_id,
                    transaction_kind: row.original.transaction_kind,
                    tags: [],
                };
            });

            updateTransactions(payload);
        };

        const setTags = (menuItem: MenuInfo) => {
            const tagObj = tags.find((tag) => {
                return tag.tag_id == parseInt(menuItem.key);
            }) as TTag;

            const payload = selectedRows.map((row) => {
                const newTagArr = [...row.original.tags];
                newTagArr.push(tagObj);
                const tagArr = _.uniqBy(newTagArr, 'tag_id');
                return {
                    transaction_id: row.original.transaction_id,
                    transaction_kind: row.original.transaction_kind,
                    tags: tagArr,
                };
            });

            updateTransactions(payload);
        };

        const clearStyles: React.CSSProperties = {
            color: '#56c425',
            transform: `translateY(1px)`,
        };

        const unclearStyles: React.CSSProperties = {
            color: '#8f8f8f',
            transform: `translateY(1px)`,
        };

        if (isDisabled) {
            clearStyles['opacity'] = '20%';
            unclearStyles['opacity'] = '20%';
        }

        return (
            <Menu selectedKeys={[]}>
                <Menu.Item
                    onClick={clearTransactions}
                    key='cleared'
                    icon={<CheckCircleFilled style={clearStyles} />}
                    disabled={isDisabled}
                >
                    Mark as Cleared
                </Menu.Item>
                <Menu.Item
                    key='uncleared'
                    icon={<CheckCircleFilled style={unclearStyles} />}
                    disabled={isDisabled}
                    onClick={unclearTransactions}
                >
                    Mark as Uncleared
                </Menu.Item>
                <Menu.Divider />
                <Menu.SubMenu
                    key='category'
                    disabled={isDisabled}
                    title='Set Category'
                    icon={
                        <BiCategoryAlt
                            style={{ transform: `translateY(3px)` }}
                        />
                    }
                >
                    {_.orderBy(
                        categories,
                        [(category) => category.name.toLowerCase()],
                        ['asc']
                    ).map((category) => {
                        return (
                            <Menu.Item
                                onClick={setCategory}
                                key={category.category_id}
                            >
                                {category.name}
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.Divider />
                <Menu.SubMenu
                    key='tag'
                    disabled={isDisabled}
                    title='Set Tags'
                    icon={<TagOutlined />}
                >
                    {_.orderBy(
                        tags,
                        [(tag) => tag.name.toLowerCase()],
                        ['asc']
                    ).map((tag) => {
                        return (
                            <Menu.Item onClick={setTags} key={tag.tag_id}>
                                <Row justify='space-between'>
                                    <Col>{tag.name}</Col>
                                    <Col>
                                        <VscCircleFilled color={tag.color} />
                                    </Col>
                                </Row>
                            </Menu.Item>
                        );
                    })}
                </Menu.SubMenu>
                <Menu.Item
                    key='remove_tags'
                    icon={
                        <GoDiffRemoved
                            style={{ transform: `translateY(3px)` }}
                        />
                    }
                    disabled={isDisabled}
                    onClick={removeTags}
                >
                    Clear All Tags
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    disabled={isDisabled}
                    key='delete'
                    icon={
                        <AiFillDelete
                            style={{ transform: `translateY(3px)` }}
                        />
                    }
                    onClick={removeTransactions}
                >
                    Delete
                </Menu.Item>
            </Menu>
        );
    }
);

export { EditMenu };
