import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Phase 3 — Product Module
 *
 * Creates:
 * 1. products table
 * 2. product_images table
 * 3. FK constraints from product_collections and product_tag_mappings to products.id
 */
export class Phase3ProductModule1749200300000 implements MigrationInterface {
  name = 'Phase3ProductModule1749200300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── 1. Create products table ──────────────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id"              UUID        NOT NULL DEFAULT gen_random_uuid(),
        "brand_id"        UUID        NOT NULL,
        "category_id"     UUID        NOT NULL,
        "sub_category_id" UUID        NOT NULL,
        "name"            VARCHAR(255) NOT NULL,
        "slug"            VARCHAR(255) NOT NULL UNIQUE,
        "sku_prefix"      VARCHAR(100),
        "short_description" TEXT,
        "description"     TEXT,
        "status"          VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
        "meta_title"      VARCHAR(255),
        "meta_description" TEXT,
        "meta_keywords"   TEXT,
        "is_featured"     BOOLEAN     NOT NULL DEFAULT false,
        "is_active"       BOOLEAN     NOT NULL DEFAULT true,
        "created_at"      TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"      TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at"      TIMESTAMPTZ,
        CONSTRAINT "PK_products"                   PRIMARY KEY ("id"),
        CONSTRAINT "FK_products_brand_id"
          FOREIGN KEY ("brand_id")
          REFERENCES "brands" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_products_category_id"
          FOREIGN KEY ("category_id")
          REFERENCES "categories" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_products_sub_category_id"
          FOREIGN KEY ("sub_category_id")
          REFERENCES "sub_categories" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_brand_id"
        ON "products" ("brand_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_category_id"
        ON "products" ("category_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_sub_category_id"
        ON "products" ("sub_category_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_slug"
        ON "products" ("slug")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_status"
        ON "products" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_is_active"
        ON "products" ("is_active")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_products_is_featured"
        ON "products" ("is_featured")
    `);

    // ─── 2. Create product_images table ───────────────────────────────────

    await queryRunner.query(`
      CREATE TABLE "product_images" (
        "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
        "product_id" UUID        NOT NULL,
        "image_url"  TEXT        NOT NULL,
        "alt_text"   VARCHAR(255),
        "sort_order" INT         NOT NULL DEFAULT 0,
        "is_primary" BOOLEAN     NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "PK_product_images"      PRIMARY KEY ("id"),
        CONSTRAINT "FK_product_images_product_id"
          FOREIGN KEY ("product_id")
          REFERENCES "products" ("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_product_images_product_id"
        ON "product_images" ("product_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_product_images_is_primary"
        ON "product_images" ("is_primary")
    `);

    // ─── 3. Add FK constraints to product_collections ──────────────────────

    await queryRunner.query(`
      ALTER TABLE "product_collections"
        ADD CONSTRAINT "FK_product_collections_product_id"
          FOREIGN KEY ("product_id")
          REFERENCES "products" ("id") ON DELETE CASCADE
    `);

    // ─── 4. Add FK constraints to product_tag_mappings ────────────────────

    await queryRunner.query(`
      ALTER TABLE "product_tag_mappings"
        ADD CONSTRAINT "FK_product_tag_mappings_product_id"
          FOREIGN KEY ("product_id")
          REFERENCES "products" ("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove FK from product_tag_mappings
    await queryRunner.query(`
      ALTER TABLE "product_tag_mappings"
        DROP CONSTRAINT IF EXISTS "FK_product_tag_mappings_product_id"
    `);

    // Remove FK from product_collections
    await queryRunner.query(`
      ALTER TABLE "product_collections"
        DROP CONSTRAINT IF EXISTS "FK_product_collections_product_id"
    `);

    // Drop product_images
    await queryRunner.query(`DROP TABLE IF EXISTS "product_images"`);

    // Drop products
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}
