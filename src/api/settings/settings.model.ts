import { Base } from '../../lib/base/base.model';

class Settings extends Base {
    user_id!: number;
    widget_spending_account_even_spending!: boolean;
    widget_spending_account_sort_by!: 'desc_total' | 'asc_total';
    transaction_widget_order!: string[];

    static get tableName(): string {
        return 'user_settings';
    }

    static get idColumn() {
        return [`user_settings_id`, `user_id`];
    }
}

export { Settings };
