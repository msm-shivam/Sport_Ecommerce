# Bug Fix Documentation: Admin Categories `status` Parameter

## Overview
The API endpoint `/api/v1/admin/categories` previously returned a **400 Bad Request** when the `status` query parameter was either omitted or left empty. The response payload was:

```json
{
  "code": "HTTP_ERROR",
  "message": ["property status should not exist"],
  "path": "/api/v1/admin/categories?page=1&limit=10&search=&status=",
  "statusCode": 400,
  "timestamp": "2026-06-15T09:21:42.821Z"
}
```

## Root Cause
The validation schema incorrectly marked the `status` field as **forbidden** when it was present, even if its value was an empty string. This caused the API to reject legitimate requests that do not filter by status.

## Fix Implemented
1. **Updated Validation Schema** – Modified the request validator to make `status` an **optional** string instead of a forbidden property.
2. **Sanitized Input** – Added a guard in the controller to ignore empty `status` values, treating them as if the parameter were omitted.
3. **Added Unit Test** – Ensured that calls with an empty `status` no longer trigger a 400 error.

## Verification Steps
1. Run the test suite: `npm test` – the new test `adminCategoriesStatusEmpty` should pass.
2. Manually call the endpoint without a status:
   ```bash
   curl "http://localhost:3000/api/v1/admin/categories?page=1&limit=10"
   ```
   Expected response: `200 OK` with category data.
3. Call the endpoint with an empty status:
   ```bash
   curl "http://localhost:3000/api/v1/admin/categories?page=1&limit=10&status="
   ```
   Expected response: `200 OK` (same as above).

## Impact
- Prevents unnecessary 400 errors for clients that do not wish to filter by status.
- Improves API ergonomics and aligns with REST best practices.

---
*Generated on 2026-06-15*
