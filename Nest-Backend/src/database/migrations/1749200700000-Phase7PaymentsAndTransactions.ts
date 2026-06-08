import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Phase7PaymentsAndTransactions1749200700000 implements MigrationInterface {
  name = 'Phase7PaymentsAndTransactions1749200700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. payment_methods
    await queryRunner.createTable(
      new Table({
        name: 'payment_methods',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'code', type: 'varchar', length: '50', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'sort_order', type: 'int', default: 0 },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'payment_methods',
      new TableIndex({
        name: 'IDX_PAYMENT_METHODS_CODE',
        columnNames: ['code'],
      }),
    );
    await queryRunner.createIndex(
      'payment_methods',
      new TableIndex({
        name: 'IDX_PAYMENT_METHODS_IS_ACTIVE',
        columnNames: ['is_active'],
      }),
    );

    // 2. payments
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'order_id', type: 'uuid' },
          { name: 'payment_method_id', type: 'uuid', isNullable: true },
          {
            name: 'transaction_number',
            type: 'varchar',
            length: '100',
            isUnique: true,
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'PENDING'",
          },
          {
            name: 'stripe_payment_intent_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'stripe_charge_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'gateway_status',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          { name: 'gateway_response', type: 'jsonb', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'paid_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'IDX_PAYMENTS_ORDER_ID',
        columnNames: ['order_id'],
      }),
    );
    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'IDX_PAYMENTS_STATUS',
        columnNames: ['status'],
      }),
    );
    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'IDX_PAYMENTS_TRANSACTION_NUMBER',
        columnNames: ['transaction_number'],
      }),
    );
    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'IDX_PAYMENTS_STRIPE_PI_ID',
        columnNames: ['stripe_payment_intent_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        name: 'FK_PAYMENTS_ORDER',
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        name: 'FK_PAYMENTS_PAYMENT_METHOD',
        columnNames: ['payment_method_id'],
        referencedTableName: 'payment_methods',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // 3. payment_refunds
    await queryRunner.createTable(
      new Table({
        name: 'payment_refunds',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'payment_id', type: 'uuid' },
          {
            name: 'stripe_refund_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'refund_amount', type: 'decimal', precision: 12, scale: 2 },
          { name: 'reason', type: 'varchar', length: '255', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'processed_by', type: 'uuid', isNullable: true },
          { name: 'processed_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'payment_refunds',
      new TableIndex({
        name: 'IDX_PAYMENT_REFUNDS_PAYMENT_ID',
        columnNames: ['payment_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'payment_refunds',
      new TableForeignKey({
        name: 'FK_REFUNDS_PAYMENT',
        columnNames: ['payment_id'],
        referencedTableName: 'payments',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // 4. payment_logs
    await queryRunner.createTable(
      new Table({
        name: 'payment_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'payment_id', type: 'uuid' },
          { name: 'action', type: 'varchar', length: '100' },
          { name: 'message', type: 'text', isNullable: true },
          {
            name: 'performed_by',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'payment_logs',
      new TableIndex({
        name: 'IDX_PAYMENT_LOGS_PAYMENT_ID',
        columnNames: ['payment_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'payment_logs',
      new TableForeignKey({
        name: 'FK_LOGS_PAYMENT',
        columnNames: ['payment_id'],
        referencedTableName: 'payments',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // 5. payment_webhooks
    await queryRunner.createTable(
      new Table({
        name: 'payment_webhooks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'event_id', type: 'varchar', length: '255', isUnique: true },
          { name: 'event_type', type: 'varchar', length: '100' },
          { name: 'payload', type: 'jsonb' },
          { name: 'processed', type: 'boolean', default: false },
          { name: 'processed_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'payment_webhooks',
      new TableIndex({
        name: 'IDX_PAYMENT_WEBHOOKS_EVENT_ID',
        columnNames: ['event_id'],
      }),
    );
    await queryRunner.createIndex(
      'payment_webhooks',
      new TableIndex({
        name: 'IDX_PAYMENT_WEBHOOKS_EVENT_TYPE',
        columnNames: ['event_type'],
      }),
    );

    // 6. Add payment columns to orders
    await queryRunner.addColumns('orders', [
      new TableColumn({
        name: 'payment_status',
        type: 'varchar',
        length: '50',
        default: "'PENDING'",
      }),
      new TableColumn({
        name: 'paid_amount',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
      new TableColumn({
        name: 'due_amount',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0,
      }),
    ]);

    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_ORDERS_PAYMENT_STATUS',
        columnNames: ['payment_status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('orders', 'IDX_ORDERS_PAYMENT_STATUS');
    await queryRunner.dropColumns('orders', [
      'payment_status',
      'paid_amount',
      'due_amount',
    ]);
    await queryRunner.dropTable('payment_webhooks');
    await queryRunner.dropTable('payment_logs');
    await queryRunner.dropTable('payment_refunds');
    await queryRunner.dropTable('payments');
    await queryRunner.dropTable('payment_methods');
  }
}
