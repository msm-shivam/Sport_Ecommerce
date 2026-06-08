# Layer 8 — Shipping & Delivery Management

## Status

Layer 8 Development Start



## Objective

Implement a complete in-house Shipping & Delivery Management system for the Sport E-Commerce platform.

This layer must support:

* Customer address management
* Warehouse management
* Distance-based shipping calculation
* Delivery charge configuration
* Shipment creation
* Shipment status tracking
* Customer shipment tracking

No third-party logistics integrations are allowed.

The system must be fully managed by platform administrators.

---

# Modules

## 1. Address Management

### Entity: Address

Fields:

* id
* userId
* fullName
* phone
* addressLine1
* addressLine2
* city
* state
* country
* postalCode
* latitude
* longitude
* isDefault
* createdAt
* updatedAt
* deletedAt

---

### Customer APIs

Base Route:

```http
/api/v1/addresses
```

Endpoints:

```http
POST   /addresses
GET    /addresses
GET    /addresses/:id
PATCH  /addresses/:id
DELETE /addresses/:id
PATCH  /addresses/:id/default
```

Rules:

* Customer can manage only their own addresses
* Only one default address allowed
* Latitude and longitude required
* Soft delete support

---

# 2. Warehouse Management

## Entity: Warehouse

Fields:

* id
* name
* code
* phone
* email
* address
* city
* state
* country
* postalCode
* latitude
* longitude
* isActive
* createdAt
* updatedAt
* deletedAt

---

### Admin APIs

Base Route:

```http
/api/v1/admin/warehouses
```

Endpoints:

```http
POST   /admin/warehouses
GET    /admin/warehouses
GET    /admin/warehouses/:id
PATCH  /admin/warehouses/:id
DELETE /admin/warehouses/:id
```

Rules:

* Warehouse code must be unique
* Soft delete support
* Active warehouses only used for delivery calculation

---

# 3. Delivery Settings

## Entity: DeliverySetting

Fields:

* id
* perKmCharge
* freeShippingThreshold
* maxDeliveryDistanceKm
* isActive
* updatedBy
* createdAt
* updatedAt

---

Example:

```text
perKmCharge = ₹4

freeShippingThreshold = ₹5000

maxDeliveryDistanceKm = 300
```

---

### Admin APIs

Base Route

```http
/api/v1/admin/delivery-settings
```

Endpoints

```http
GET   /admin/delivery-settings
PATCH /admin/delivery-settings
```

---

# 4. Distance Calculation Engine

Implement Haversine Formula.

Inputs:

```text
Warehouse Latitude
Warehouse Longitude

Customer Latitude
Customer Longitude
```

Outputs:

```text
Distance In KM
```

The nearest active warehouse must be selected automatically.

---

Example

Warehouse:

```text
Jaipur
26.9124
75.7873
```

Customer:

```text
Ajmer
26.4499
74.6399
```

Result:

```text
Distance = 135 KM
```

---

# 5. Delivery Charge Calculation

Formula:

```text
Delivery Charge

=

Distance(KM)

×

Per KM Charge
```

Example:

```text
Distance = 135 KM

Per KM = ₹4

Delivery Charge = ₹540
```

---

Free Shipping Rule

```text
If Order Amount >= Free Shipping Threshold

Delivery Charge = 0
```

---

Maximum Delivery Distance Rule

```text
Distance > maxDeliveryDistanceKm

Order Not Serviceable
```

Return:

```http
400 Bad Request
```

Message:

```text
Delivery not available in your area.
```

---

# 6. Checkout Integration

Before order creation:

System must:

1. Validate address
2. Find nearest warehouse
3. Calculate distance
4. Calculate shipping charge
5. Store shipping amount in order

Order totals:

```text
Subtotal
+ Shipping
+ Tax
- Discount

= Total Amount
```

---

Orders Table Update

Add:

* shippingAddressId
* warehouseId
* distanceKm
* shippingAmount

---

# 7. Shipment Management

## Shipment Entity

Fields:

* id
* orderId
* warehouseId
* trackingNumber
* status
* notes
* dispatchedAt
* deliveredAt
* createdAt
* updatedAt

---

Shipment Status Enum

```text
PENDING

PACKED

READY_FOR_DISPATCH

OUT_FOR_DELIVERY

DELIVERED

FAILED_DELIVERY
```

---

# 8. Shipment Tracking Logs

## Entity: ShipmentTrackingLog

Fields:

* id
* shipmentId
* status
* note
* changedBy
* createdAt

---

Whenever shipment status changes:

Create tracking log automatically.

---

# 9. Customer Tracking

Customer must be able to view:

```text
Tracking Number

Current Status

Status History

Warehouse

Distance

Delivery Charge
```

---

# API Endpoints

## Customer

```http
GET /shipments/:orderId
```

---

## Admin

```http
GET   /admin/shipments
GET   /admin/shipments/:id

PATCH /admin/shipments/:id/status
```

---

# Permissions

Address

```text
address.create
address.view
address.update
address.delete
```

Warehouse

```text
warehouse.create
warehouse.view
warehouse.update
warehouse.delete
```

Delivery

```text
delivery.manage
```

Shipment

```text
shipment.view
shipment.update
```

---

# Migration

Create Tables

```text
addresses

warehouses

delivery_settings

shipments

shipment_tracking_logs
```

---

# Deliverables

* Entities
* DTOs
* Services
* Controllers
* Modules
* Migrations
* Swagger Documentation
* RBAC Integration
* Permission Seeds
* Postman Collection Updates
* TypeScript Build With Zero Errors

---

# Out Of Scope

Do Not Implement:

* Shiprocket
* Delhivery
* BlueDart
* Third-party courier APIs
* Return Management
* Exchange Management
* Pickup Scheduling
* Multi-Warehouse Inventory Allocation
* Delivery Partner Mobile App
* Route Optimization
* Subscription Delivery
​