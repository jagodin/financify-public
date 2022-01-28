import { Base } from '../../lib/base/base.model';
import { Rule } from 'json-rules-engine';

class TransactionRule extends Base {
    user_id!: number;
    rule!: string;
    created_at!: string;
    updated_at!: string;
    enabled?: boolean;
    transaction_rule_id!: number;

    static get tableName(): string {
        return 'transaction_rule';
    }

    static get idColumn() {
        return [`transaction_rule_id`, `user_id`];
    }
}

export { TransactionRule };
