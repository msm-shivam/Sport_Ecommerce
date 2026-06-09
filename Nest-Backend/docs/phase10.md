# Layer 10 — Wishlist, Reviews & Ratings Management (Complete)

## Overview

Layer 10 introduces customer engagement features including product wishlists, verified product reviews, ratings aggregation, review moderation, and review image uploads.

This layer integrates with Users, Products, Orders, and Product Variants modules.

---

## Modules

| Module            | Status     |
| ----------------- | ---------- |
| Wishlist          | ✅ Complete |
| Wishlist Items    | ✅ Complete |
| Reviews           | ✅ Complete |
| Ratings           | ✅ Complete |
| Review Images     | ✅ Complete |
| Review Moderation | ✅ Complete |

---

## Phase 10 Deliverables

* [ ] Wishlist Entity
* [ ] WishlistItem Entity
* [ ] Review Entity
* [ ] ReviewImage Entity
* [ ] Product Rating Aggregation
* [ ] DTOs
* [ ] Wishlist Service
* [ ] Reviews Service
* [ ] Rating Calculation Service
* [ ] Wishlist Controller
* [ ] Customer Reviews Controller
* [ ] Admin Reviews Controller
* [ ] Migration
* [ ] Permissions
* [ ] Swagger Documentation
* [ ] RBAC Integration
* [ ] Postman Collection
* [ ] Zero TypeScript Errors

---

# Database Tables

## wishlists

* id
* user_id
* created_at
* updated_at

## wishlist_items

* id
* wishlist_id
* product_id
* created_at

## reviews

* id
* user_id
* product_id
* order_id
* order_item_id
* rating
* title
* comment
* status
* is_verified_purchase
* approved_by
* approved_at
* created_at
* updated_at
* deleted_at

## review_images

* id
* review_id
* image_url
* sort_order
* created_at

---

# Enums

## ReviewStatus

PENDING

APPROVED

REJECTED

---

# Entities

## Wishlist

Relations

* User (ManyToOne)
* WishlistItems (OneToMany)

---

## WishlistItem

Relations

* Wishlist (ManyToOne)
* Product (ManyToOne)

Unique Constraint

(user wishlist + product)

---

## Review

Relations

* User
* Product
* Order
* ReviewImages

Fields

* rating (1-5)
* title
* comment
* status
* verifiedPurchase

---

## ReviewImage

Relations

* Review

Fields

* imageUrl
* sortOrder

---

# Permissions

## Wishlist

wishlist.view

## Reviews

review.view

review.create

review.update

review.delete

review.approve

review.reject

---

# API Endpoints

## Wishlist

Base Path

/api/v1/wishlist

### Customer

GET /wishlist

POST /wishlist/products/:productId

DELETE /wishlist/products/:productId

---

## Reviews

Base Path

/api/v1/reviews

### Customer

POST /reviews

GET /reviews/my

GET /products/:productId/reviews

PATCH /reviews/:id

DELETE /reviews/:id

---

## Admin Reviews

Base Path

/api/v1/admin/reviews

GET /admin/reviews

GET /admin/reviews/:id

PATCH /admin/reviews/:id/approve

PATCH /admin/reviews/:id/reject

DELETE /admin/reviews/:id

---

# DTOs

## CreateReviewDto

* productId
* orderId
* orderItemId
* rating
* title
* comment

## UpdateReviewDto

* rating
* title
* comment

## WishlistResponseDto

* product
* addedAt

## ReviewResponseDto

* id
* rating
* title
* comment
* status
* user
* product
* images
* createdAt

---

# Business Rules

## Wishlist

* One wishlist per user
* Auto create if missing
* Prevent duplicate products
* Soft delete supported

## Reviews

* Only verified purchasers can review
* User must own order
* Order must be DELIVERED
* One review per order item
* Rating range 1-5
* Reviews start as PENDING
* Admin approval required
* Customer can edit only own review
* Customer cannot edit approved review

## Ratings

* Product average rating auto recalculated
* Product review count maintained
* Exclude rejected reviews
* Exclude deleted reviews

---

# Product Module Updates

Add Columns To Products

* average_rating decimal(3,2)
* review_count integer

Automatically updated after review approval/rejection.

---

# Migration

Migration Name

1749201000000-Phase10WishlistReviewsAndRatings.ts

Tables

* wishlists
* wishlist_items
* reviews
* review_images

Indexes

* reviews.product_id
* reviews.user_id
* reviews.status
* wishlist_items.product_id

Unique Constraints

* wishlist_items(wishlist_id, product_id)
* reviews(order_item_id)

---

# Swagger Documentation

Document

* Wishlist APIs
* Customer Review APIs
* Admin Review APIs

Include

* Request Examples
* Response Examples
* Validation Rules

---

# Postman Collection

Add

Folder: Wishlist

Folder: Reviews

Folder: Admin Reviews

---

# RBAC Integration

AdminJwtGuard

PermissionsGuard

DefaultPermissions Enum Updates

* review.view
* review.create
* review.update
* review.delete
* review.approve
* review.reject

---

# Layer 10 Out Of Scope

* Review Likes
* Review Comments
* Q&A System
* AI Review Moderation
* Product Recommendations
* Customer Follow Lists
* Social Sharing
* Review Helpfulness Voting
