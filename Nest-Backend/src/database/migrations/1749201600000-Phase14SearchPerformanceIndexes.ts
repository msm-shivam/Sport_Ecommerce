import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class Phase14SearchPerformanceIndexes1749201600000
  implements MigrationInterface
{
  name = 'Phase14SearchPerformanceIndexes1749201600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Product search indexes ───────────────────────────────────────────────
    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'idx_products_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'idx_products_brand',
        columnNames: ['brand_id'],
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'idx_products_category',
        columnNames: ['category_id'],
      }),
    );

    await queryRunner.createIndex(
      'product_collections',
      new TableIndex({
        name: 'idx_product_collections_product',
        columnNames: ['product_id'],
      }),
    );

    await queryRunner.createIndex(
      'product_collections',
      new TableIndex({
        name: 'idx_product_collections_collection',
        columnNames: ['collection_id'],
      }),
    );

    await queryRunner.createIndex(
      'products',
      new TableIndex({
        name: 'idx_products_rating',
        columnNames: ['average_rating'],
      }),
    );

    // ── Product variant price index ──────────────────────────────────────────
    await queryRunner.createIndex(
      'product_variants',
      new TableIndex({
        name: 'idx_product_variants_price',
        columnNames: ['price'],
      }),
    );

    // ── Product variant stock index (via inventories) ────────────────────────
    await queryRunner.createIndex(
      'inventories',
      new TableIndex({
        name: 'idx_inventories_available_quantity',
        columnNames: ['available_quantity'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('inventories', 'idx_inventories_available_quantity');
    await queryRunner.dropIndex('product_variants', 'idx_product_variants_price');
    await queryRunner.dropIndex('products', 'idx_products_rating');
    await queryRunner.dropIndex('product_collections', 'idx_product_collections_collection');
    await queryRunner.dropIndex('product_collections', 'idx_product_collections_product');
    await queryRunner.dropIndex('products', 'idx_products_category');
    await queryRunner.dropIndex('products', 'idx_products_brand');
    await queryRunner.dropIndex('products', 'idx_products_status');
  }
}
