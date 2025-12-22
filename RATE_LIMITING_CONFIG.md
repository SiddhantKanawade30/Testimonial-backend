# Rate Limiting Configuration - Complete Setup

## Overview
Proper rate limiting is configured across your API to prevent abuse while allowing legitimate traffic.

---

## Rate Limiter Types

### 1. Global Limiter (Applied to all routes)
**File:** `src/middleware/ratelimiter.ts`

```typescript
- Window: 15 minutes
- Max Requests: 100 per IP
- Applies to: All routes (default)
- Response: 429 status with custom JSON message
```

**Response Format:**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": "<reset-time>"
}
```

---

### 2. Authentication Limiter
**File:** `src/middleware/authLimiter.ts`

```typescript
- Window: 15 minutes
- Max Attempts: 10 per IP
- Routes: /auth/signup, /auth/signin, /auth/google
- Special Features:
  * skipSuccessfulRequests: true (successful logins don't count)
  * skipFailedRequests: false (only failed attempts count)
```

**Response Format:**
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes.",
  "retryAfter": "<reset-time>"
}
```

---

### 3. Public Limiter
**File:** `src/middleware/ratelimiter.ts`

```typescript
- Window: 1 hour
- Max Submissions: 50 per IP
- Routes: 
  * /testimonials/create (public submission)
  * /testimonials/create-video-upload (public video)
  * /campaigns/get/:campaignId (public access)
```

**Response Format:**
```json
{
  "success": false,
  "message": "Too many submissions. Please try again later.",
  "retryAfter": "<reset-time>"
}
```

---

## Route-Level Configuration

### Protected Routes (Require Authentication)
```
POST   /api/v1/campaigns/create     → Global Limiter (100/15min)
DELETE /api/v1/campaigns/delete     → Global Limiter
GET    /api/v1/campaigns/get        → Global Limiter
PUT    /api/v1/campaigns/edit       → Global Limiter

POST   /api/v1/testimonials/get/all → Global Limiter
GET    /api/v1/testimonials/get/:id → Global Limiter
PUT    /api/v1/testimonials/archive → Global Limiter
PUT    /api/v1/testimonials/favourite → Global Limiter
GET    /api/v1/testimonials/favourite → Global Limiter
GET    /api/v1/testimonials/archived → Global Limiter

GET    /api/v1/user/me              → Global Limiter

POST   /api/v1/payments/*           → Global Limiter
```

### Public Routes (No Authentication Required)
```
POST   /api/v1/auth/signup          → Auth Limiter (10/15min failed attempts)
POST   /api/v1/auth/signin          → Auth Limiter (10/15min failed attempts)
POST   /api/v1/auth/google          → Auth Limiter (10/15min failed attempts)

POST   /api/v1/testimonials/create  → Public Limiter (50/1hour)
POST   /api/v1/testimonials/create-video-upload → Public Limiter (50/1hour)
GET    /api/v1/testimonials/get-asset-from-upload/:uploadId → Global Limiter
GET    /api/v1/campaigns/get/:campaignId → Public Limiter (50/1hour)
GET    /api/v1/testimonials/embed/:campaignId → Global Limiter
```

---

## Key Improvements Made

### Fixed Issues:
1. ✅ **Comment-Code Mismatch:** Changed `max: 10` to `max: 100` with corrected comment
2. ✅ **Proper Response Handlers:** Added custom `handler` functions instead of generic `message` field
3. ✅ **Correct HTTP Status:** Using 429 (Too Many Requests) instead of relying on defaults
4. ✅ **Consistent Response Format:** All responses follow your API's success/message pattern
5. ✅ **Smart Auth Limiting:** Only counts failed attempts for authentication
6. ✅ **Tiered Approach:** Different limits for different endpoint types
7. ✅ **RetryAfter Info:** Includes reset time for client-side handling

---

## Testing Rate Limits

### Test Global Limiter (100 requests/15min):
```bash
for i in {1..101}; do
  curl http://localhost:3000/api/v1/user/me \
    -H "Authorization: Bearer YOUR_TOKEN"
done
# Should get 429 on request 101
```

### Test Auth Limiter (10 failed/15min):
```bash
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/v1/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Should get 429 on request 11
```

### Test Public Limiter (50 submissions/1hour):
```bash
for i in {1..51}; do
  curl -X POST http://localhost:3000/api/v1/testimonials/create \
    -H "Content-Type: application/json" \
    -d '{"name":"test","email":"test@test.com","message":"test"}'
done
# Should get 429 on request 51
```

---

## Response Examples

### Rate Limit Exceeded (Global Limiter)
```bash
curl http://localhost:3000/api/v1/user/me \
  -H "Authorization: Bearer token"
```

**Response (429):**
```json
{
  "success": false,
  "message": "Too many requests. Please try again later.",
  "retryAfter": 1703254800
}
```

### Rate Limit Exceeded (Auth Limiter)
```bash
curl -X POST http://localhost:3000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"wrong"}'
```

**Response (429):**
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes.",
  "retryAfter": 1703254800
}
```

### Rate Limit Exceeded (Public Limiter)
```bash
curl -X POST http://localhost:3000/api/v1/testimonials/create \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"test"}'
```

**Response (429):**
```json
{
  "success": false,
  "message": "Too many submissions. Please try again later.",
  "retryAfter": 1703261000
}
```

---

## Standard Headers

All rate limiters include standard RateLimit headers:
- `RateLimit-Limit`: Total requests allowed
- `RateLimit-Remaining`: Requests remaining in current window
- `RateLimit-Reset`: Unix timestamp when limit resets

---

## Configuration Notes

- **windowMs:** Time period in milliseconds
- **max:** Maximum requests/attempts per window per IP
- **standardHeaders:** Includes RateLimit-* headers in response
- **legacyHeaders:** Disables old X-RateLimit-* headers
- **skipSuccessfulRequests:** (Auth only) Don't count successful logins
- **handler:** Custom function to format rate limit response

---

## Future Enhancements

1. **Store-based Rate Limiting:** Use Redis for distributed rate limiting across multiple servers
2. **User-level Limits:** Different limits for authenticated vs anonymous users
3. **Adaptive Limits:** Adjust limits based on user reputation/plan
4. **Endpoint-specific Limits:** Fine-tune limits per endpoint
5. **Logging:** Log rate limit violations for monitoring

---

## Support

If you encounter rate limit issues:
1. Check your IP address and current request count
2. Wait for the reset time specified in the response
3. Contact support if legitimate traffic is being blocked
