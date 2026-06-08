# Layer 7 — Payments & Transactions (Stripe Integration)

## Objective

Build a complete payment processing system for the Sports E-Commerce platform.

This layer handles:

- Payment Methods
- Stripe Payment Gateway
- Payment Intents
- Payment Confirmation
- Transaction Records
- Refund Management
- Partial Refunds
- Payment Audit Logs
- Payment Webhooks
- Order Payment Synchronization

---

## Module Build Log

| Module | Status |
|----------|----------|
| Payment Methods | ⬜ Pending |
| Stripe Integration | ⬜ Pending |
| Payments | ⬜ Pending |
| Refunds | ⬜ Pending |
| Payment Logs | ⬜ Pending |
| Payment Webhooks | ⬜ Pending |
| Order Payment Sync | ⬜ Pending |

---

# Phase 7 Deliverables

- [ ] PaymentMethod Entity
- [ ] Payment Entity
- [ ] PaymentRefund Entity
- [ ] PaymentLog Entity
- [ ] PaymentWebhook Entity
- [ ] Stripe Payment Intent Integration
- [ ] Stripe Webhook Processing
- [ ] Payment Status Tracking
- [ ] Refund Management
- [ ] Partial Refund Support
- [ ] Order Payment Summary
- [ ] DTOs
- [ ] Controllers
- [ ] Services
- [ ] Modules
- [ ] Migration
- [ ] Permission Seeds
- [ ] Swagger Documentation
- [ ] RBAC Integration
- [ ] Postman Collection
- [ ] Zero TypeScript Build Errors

---

# Stripe Setup

## Environment Variables

```env
STRIPE_SECRET_KEY=

STRIPE_PUBLISHABLE_KEY=

STRIPE_WEBHOOK_SECRET=
```

---

# Payment Methods

Admin can manage payment methods.

Examples:

- Stripe Card
- UPI
- Bank Transfer
- Cash On Delivery

---

## PaymentMethod Entity

```ts
id: string;

name: string;

code: string;

description: string;

isActive: boolean;

sortOrder: number;

createdAt: Date;

updatedAt: Date;
```

---

# Payments

Each order has payment transactions.

---

## Payment Entity

```ts
id: string;

orderId: string;

paymentMethodId: string;

transactionNumber: string;

amount: number;

status: PaymentStatus;

stripePaymentIntentId: string;

stripeChargeId: string;

gatewayStatus: string;

gatewayResponse: Record<string, any>;

notes: string;

paidAt: Date;

createdAt: Date;

updatedAt: Date;
```

---

# Payment Status Enum

```ts
export enum PaymentStatus {
  PENDING = 'PENDING',

  PROCESSING = 'PROCESSING',

  PAID = 'PAID',

  FAILED = 'FAILED',

  CANCELLED = 'CANCELLED',

  REFUNDED = 'REFUNDED',

  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}
```

---

# Refunds

Supports:

- Full Refund
- Partial Refund

---

## PaymentRefund Entity

```ts
id: string;

paymentId: string;

stripeRefundId: string;

refundAmount: number;

reason: string;

notes: string;

processedBy: string;

processedAt: Date;

createdAt: Date;
```

---

# Payment Logs

Track every payment activity.

Examples:

```text
PAYMENT_CREATED

PAYMENT_INTENT_CREATED

PAYMENT_SUCCESS

PAYMENT_FAILED

REFUND_CREATED

REFUND_COMPLETED
```

---

## PaymentLog Entity

```ts
id: string;

paymentId: string;

action: string;

message: string;

performedBy: string;

createdAt: Date;
```

---

# Webhook Logs

Store Stripe webhook payloads.

---

## PaymentWebhook Entity

```ts
id: string;

eventId: string;

eventType: string;

payload: json;

processed: boolean;

processedAt: Date;

createdAt: Date;
```

---

# Order Updates

Extend existing Order entity.

```ts
paymentStatus: PaymentStatus;

paidAmount: number;

dueAmount: number;
```

---

# Payment Summary

```json
{
  "orderNumber": "ORD-1001",
  "grandTotal": 2500,
  "paidAmount": 2500,
  "dueAmount": 0,
  "paymentStatus": "PAID"
}
```

---

# Database Tables

## payment_methods

```text
id
name
code
description
is_active
sort_order
created_at
updated_at
```

---

## payments

```text
id
order_id
payment_method_id
transaction_number
amount
status

stripe_payment_intent_id
stripe_charge_id

gateway_status
gateway_response

notes
paid_at

created_at
updated_at
```

---

## payment_refunds

```text
id
payment_id
stripe_refund_id
refund_amount
reason
notes
processed_by
processed_at
created_at
```

---

## payment_logs

```text
id
payment_id
action
message
performed_by
created_at
```

---

## payment_webhooks

```text
id
event_id
event_type
payload
processed
processed_at
created_at
```

---

# Relationships

```text
Order
 └── Payments

Payment
 ├── PaymentMethod
 ├── Refunds
 ├── Logs
 └── Webhooks
```

---

# Permissions

## Payment Permissions

```text
payment.create
payment.view
payment.update
payment.delete
```

---

## Refund Permissions

```text
refund.create
refund.view
refund.update
```

---

## Payment Method Permissions

```text
payment_method.create
payment_method.view
payment_method.update
payment_method.delete
```

---

# API Base Path

```text
/api/v1
```

---

# Stripe APIs

## Create Payment Intent

```http
POST /payments/create-intent
```

Request

```json
{
  "orderId": "uuid"
}
```

Response

```json
{
  "clientSecret": "pi_xxxxx_secret_xxxxx"
}
```

---

## Confirm Payment

```http
POST /payments/confirm
```

Request

```json
{
  "paymentIntentId": "pi_xxxxx"
}
```

---

## Stripe Webhook

```http
POST /payments/webhook
```

Public Endpoint

Validates Stripe Signature

---

## Refund Payment

```http
POST /payments/:id/refund
```

Request

```json
{
  "amount": 500,
  "reason": "Customer request"
}
```

---

# Admin Payment APIs

## Get Payments

```http
GET /admin/payments
```

---

## Get Payment

```http
GET /admin/payments/:id
```

---

## Update Payment

```http
PATCH /admin/payments/:id
```

---

# Customer APIs

## Payment Details

```http
GET /customer/orders/:id/payment
```

---

## Customer Payments

```http
GET /customer/payments
```

---

# Stripe Webhooks To Handle

```text
payment_intent.created

payment_intent.processing

payment_intent.succeeded

payment_intent.payment_failed

charge.refunded

charge.dispute.created
```

---

# Services

## StripeService

Responsibilities

- Create Payment Intent
- Verify Webhook Signature
- Process Refunds
- Fetch Payment Details

---

## PaymentsService

Responsibilities

- Create Payment Records
- Update Payment Status
- Sync Orders
- Create Logs

---

## RefundsService

Responsibilities

- Full Refund
- Partial Refund
- Status Updates

---

# Migration

File

```text
1749200700000-Phase7PaymentsAndTransactions.ts
```

---

# Tables Created

```text
payment_methods

payments

payment_refunds

payment_logs

payment_webhooks
```

---

# Foreign Keys

```text
payments.order_id
→ orders.id

payments.payment_method_id
→ payment_methods.id

payment_refunds.payment_id
→ payments.id

payment_logs.payment_id
→ payments.id
```

---

# Indexes

```text
payments.order_id

payments.status

payments.transaction_number

payments.stripe_payment_intent_id

payment_refunds.payment_id

payment_logs.payment_id

payment_webhooks.event_id
```

---

# Swagger

Document:

- Payment Methods APIs
- Stripe APIs
- Payments APIs
- Refund APIs
- Customer Payment APIs

Include:

- Examples
- Validation Rules
- Response DTOs

---

# Postman Collection

Folder:

```text
Payments
```

Requests:

- Create Payment Intent
- Confirm Payment
- Stripe Webhook
- Refund Payment
- Payment Methods
- Admin Payments
- Customer Payments

---

# RBAC Integration

All admin endpoints must use:

```ts
AdminJwtGuard

PermissionsGuard
```

---

# Completion Criteria

- Stripe Integration
- Payment Intents
- Payment Confirmation
- Payment Webhooks
- Payment CRUD
- Refund Management
- Partial Refund Support
- Payment Logs
- Order Payment Tracking
- Swagger Documentation
- RBAC Protection
- DTO Validation
- Migration
- Postman Collection
- Zero TypeScript Errors

---

# Out Of Scope

- PayPal
- Subscription Billing
- Wallet System
- EMI Processing
- Marketplace Split Payments

---

Last Updated: 2026-06-08 — Layer 7 Payments & Transactions with Stripe Integration