# Layer 11 — Wishlist & Saved Items Management

## Objective

Build a complete Wishlist & Saved Items system allowing customers to save products for future purchase, organize saved products, move wishlist items to cart, and manage personal shopping preferences.

This layer must be fully production-ready and follow the architecture standards established in Layers 1–10.

---

# Module Scope

## Wishlist Module

- Customer Wishlist
- Wishlist Items
- Move To Cart
- Save For Later
- Wishlist Analytics
- Wishlist Sharing (optional support)
- Wishlist Count Tracking

---

# Database Tables

## wishlists

| Column | Type |
|----------|----------|
| id | uuid |
| user_id | uuid FK |
| total_items | integer |
| created_at | timestamp |
| updated_at | timestamp |
| deleted_at | timestamp |

---

## wishlist_items

| Column | Type |
|----------|----------|
| id | uuid |
| wishlist_id | uuid FK |
| product_id | uuid FK |
| variant_id | uuid FK nullable |
| added_at | timestamp |
| created_at | timestamp |
| updated_at | timestamp |

Unique:

(wishlist_id, product_id, variant_id)

---

# Business Rules

## Single Wishlist Per User

One customer can have only one wishlist.

Auto-create when needed.

---

## Duplicate Prevention

Same product/variant cannot be added twice.

Return existing item.

---

## Product Validation

Before adding:

- Product must exist
- Product must be ACTIVE
- Product not ARCHIVED

---

## Variant Validation

If variant supplied:

- Variant must exist
- Variant must belong to product
- Variant must be ACTIVE

---

## Move To Cart

When moving:

1. Validate inventory
2. Add item to cart
3. Remove from wishlist
4. Recalculate cart totals

---

## Delete Behavior

Deleting wishlist:

Soft delete

Deleting user:

Cascade delete

---

## Wishlist Count

Maintain:

```ts
totalItems:number