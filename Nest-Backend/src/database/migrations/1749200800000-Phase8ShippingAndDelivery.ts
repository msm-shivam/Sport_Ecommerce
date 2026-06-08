import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Phase8ShippingAndDelivery1749200800000 implements MigrationInterface {
  name = 'Phase8ShippingAndDelivery1749200800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. addresses
    await queryRunner.createTable(
      new Table({
        name: 'addresses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'user_id', type: 'uuid' },
          { name: 'full_name', type: 'varchar', length: '100' },
          { name: 'phone', type: 'varchar', length: '20' },
          { name: 'address_line_1', type: 'varchar', length: '255' },
          {
            name: 'address_line_2',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          { name: 'city', type: 'varchar', length: '100' },
          { name: 'state', type: 'varchar', length: '100' },
          { name: 'country', type: 'varchar', length: '100' },
          { name: 'postal_code', type: 'varchar', length: '20' },
          { name: 'latitude', type: 'decimal', precision: 10, scale: 7 },
          { name: 'longitude', type: 'decimal', precision: 10, scale: 7 },
          { name: 'is_default', type: 'boolean', default: false },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndex(
      'addresses',
      new TableIndex({
        name: 'IDX_ADDRESSES_USER_ID',
        columnNames: ['user_id'],
      }),
    );
    await queryRunner.createIndex(
      'addresses',
      new TableIndex({
        name: 'IDX_ADDRESSES_IS_DEFAULT',
        columnNames: ['is_default'],
      }),
    );

    await queryRunner.createForeignKey(
      'addresses',
      new TableForeignKey({
        name: 'FK_ADDRESSES_USER',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // 2. warehouses
    await queryRunner.createTable(
      new Table({
        name: 'warehouses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'code', type: 'varchar', length: '50', isUnique: true },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'email', type: 'varchar', length: '100', isNullable: true },
          { name: 'address', type: 'varchar', length: '255' },
          { name: 'city', type: 'varchar', length: '100' },
          { name: 'state', type: 'varchar', length: '100' },
          { name: 'country', type: 'varchar', length: '100' },
          { name: 'postal_code', type: 'varchar', length: '20' },
          { name: 'latitude', type: 'decimal', precision: 10, scale: 7 },
          { name: 'longitude', type: 'decimal', precision: 10, scale: 7 },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndex(
      'warehouses',
      new TableIndex({
        name: 'IDX_WAREHOUSES_CODE',
        columnNames: ['code'],
      }),
    );
    await queryRunner.createIndex(
      'warehouses',
      new TableIndex({
        name: 'IDX_WAREHOUSES_IS_ACTIVE',
        columnNames: ['is_active'],
      }),
    );

    // 3. delivery_settings
    await queryRunner.createTable(
      new Table({
        name: 'delivery_settings',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'per_km_charge',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'free_shipping_threshold',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'max_delivery_distance_km',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          { name: 'is_active', type: 'boolean', default: true },
          { name: 'updated_by', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    // 4. shipments
    await queryRunner.createTable(
      new Table({
        name: 'shipments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'order_id', type: 'uuid' },
          { name: 'warehouse_id', type: 'uuid' },
          {
            name: 'tracking_number',
            type: 'varchar',
            length: '50',
            isUnique: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'PENDING'",
          },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'dispatched_at', type: 'timestamptz', isNullable: true },
          { name: 'delivered_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
          { name: 'updated_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'shipments',
      new TableIndex({
        name: 'IDX_SHIPMENTS_ORDER_ID',
        columnNames: ['order_id'],
      }),
    );
    await queryRunner.createIndex(
      'shipments',
      new TableIndex({
        name: 'IDX_SHIPMENTS_TRACKING_NUMBER',
        columnNames: ['tracking_number'],
      }),
    );
    await queryRunner.createIndex(
      'shipments',
      new TableIndex({
        name: 'IDX_SHIPMENTS_STATUS',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createForeignKey(
      'shipments',
      new TableForeignKey({
        name: 'FK_SHIPMENTS_ORDER',
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'shipments',
      new TableForeignKey({
        name: 'FK_SHIPMENTS_WAREHOUSE',
        columnNames: ['warehouse_id'],
        referencedTableName: 'warehouses',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // 5. shipment_tracking_logs
    await queryRunner.createTable(
      new Table({
        name: 'shipment_tracking_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          { name: 'shipment_id', type: 'uuid' },
          { name: 'status', type: 'varchar', length: '50' },
          { name: 'note', type: 'text', isNullable: true },
          { name: 'changed_by', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'NOW()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'shipment_tracking_logs',
      new TableIndex({
        name: 'IDX_TRACKING_LOGS_SHIPMENT_ID',
        columnNames: ['shipment_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'shipment_tracking_logs',
      new TableForeignKey({
        name: 'FK_TRACKING_LOGS_SHIPMENT',
        columnNames: ['shipment_id'],
        referencedTableName: 'shipments',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // 6. Add shipping columns to orders
    await queryRunner.addColumns('orders', [
      new TableColumn({
        name: 'shipping_address_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'warehouse_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'distance_km',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    ]);

    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_ORDERS_SHIPPING_ADDRESS',
        columnNames: ['shipping_address_id'],
      }),
    );
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'IDX_ORDERS_WAREHOUSE',
        columnNames: ['warehouse_id'],
      }),
    );

    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'FK_ORDERS_SHIPPING_ADDRESS',
        columnNames: ['shipping_address_id'],
        referencedTableName: 'addresses',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        name: 'FK_ORDERS_WAREHOUSE',
        columnNames: ['warehouse_id'],
        referencedTableName: 'warehouses',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('orders', 'FK_ORDERS_WAREHOUSE');
    await queryRunner.dropForeignKey('orders', 'FK_ORDERS_SHIPPING_ADDRESS');
    await queryRunner.dropIndex('orders', 'IDX_ORDERS_WAREHOUSE');
    await queryRunner.dropIndex('orders', 'IDX_ORDERS_SHIPPING_ADDRESS');
    await queryRunner.dropColumns('orders', [
      'shipping_address_id',
      'warehouse_id',
      'distance_km',
    ]);
    await queryRunner.dropTable('shipment_tracking_logs');
    await queryRunner.dropTable('shipments');
    await queryRunner.dropTable('delivery_settings');
    await queryRunner.dropTable('warehouses');
    await queryRunner.dropTable('addresses');
  }
}
