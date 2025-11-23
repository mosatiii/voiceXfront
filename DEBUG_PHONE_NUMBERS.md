# Debug: Phone Numbers Not Loading

## 🔍 Issue
Phone numbers aren't showing up in the Messages page dropdown.

## ✅ What Frontend Is Doing (Correct)
```typescript
// src/api/numbers.ts
export const getMyNumbers = async (): Promise<GetMyNumbersResponse> => {
  const response = await apiClient.get<GetMyNumbersResponse>('/numbers/mine');
  return response.data;
};

// Expected response type:
interface GetMyNumbersResponse {
  phoneNumbers: PhoneNumber[];
}
```

**Frontend is calling:** `GET /api/numbers/mine`

---

## 🔍 Check Backend Response

### Option 1: Check Browser Console

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh the Messages page
4. Look for request: `numbers/mine`
5. Check:
   - ❓ Status code? (200, 401, 404, 500?)
   - ❓ Response body?

---

## 🐛 Common Issues

### Issue 1: Wrong Response Structure

**Frontend expects:**
```json
{
  "phoneNumbers": [
    {
      "id": "1",
      "phoneNumber": "+14155551234",
      "status": "active",
      "capabilities": { "sms": true, "voice": true },
      "rentedAt": "2025-11-22T10:00:00.000Z"
    }
  ]
}
```

**Backend might be returning:**
```json
{
  "data": [...],  // ❌ Wrong key
  "numbers": [...],  // ❌ Wrong key  
  "results": [...]  // ❌ Wrong key
}
```

**Fix:** Backend should return `{ phoneNumbers: [...] }`

---

### Issue 2: Authentication Required

**Error:** `401 Unauthorized`

**Cause:** Backend requires JWT token but it's not being sent

**Check:**
```typescript
// Make sure token is in localStorage
console.log(localStorage.getItem('auth-storage'));
```

**Fix:** Make sure you're logged in

---

### Issue 3: Endpoint Not Found

**Error:** `404 Not Found`

**Cause:** Backend route doesn't exist or has different path

**Possible backend routes:**
- ❌ `/numbers/mine` (what frontend calls)
- ✅ `/numbers` (maybe backend uses this?)
- ✅ `/phone-numbers/mine`
- ✅ `/user/numbers`

**Fix:** Check backend route and update frontend:

```typescript
// In src/api/numbers.ts, change to match backend:
const response = await apiClient.get<GetMyNumbersResponse>('/numbers'); // or whatever backend uses
```

---

### Issue 4: CORS Error

**Error:** `CORS policy: No 'Access-Control-Allow-Origin'`

**Fix:** Backend needs to allow frontend origin:
```javascript
// Backend CORS config
cors({
  origin: ['http://localhost:5173'],
  credentials: true
})
```

---

## 🔧 Quick Fix Test

### Test 1: Can you GET /api/numbers/mine directly?

Open a new browser tab and try:
```
http://localhost:3000/api/numbers/mine
```

What happens?
- ✅ Returns JSON with phone numbers → Backend works
- ❌ 401 Error → Need authentication
- ❌ 404 Error → Endpoint doesn't exist
- ❌ Nothing/error → Backend server not running

---

### Test 2: Check if other API calls work

Does the Phone Numbers page (`/numbers`) load your numbers correctly?
- ✅ Yes → API works, issue is specific to Messages page
- ❌ No → API issue affects all pages

---

## 🎯 What Information I Need

To help fix this, please tell me:

1. **What's the status code** when calling `/api/numbers/mine`?
   - Check Network tab in browser DevTools

2. **What does the response body look like?**
   - Copy/paste the JSON response

3. **Does the Phone Numbers page (`/numbers`) work?**
   - Can you see your numbers there?

4. **Is the backend definitely running?**
   - Check `http://localhost:3000/api/health` or similar

5. **What does your backend endpoint look like?**
   - Share the backend code for `GET /api/numbers/mine`

---

## 🚀 Temporary Workaround

If the Messages page needs to work NOW, I can:

1. Change the endpoint frontend calls
2. Adjust the response structure expected
3. Add error handling with fallback

Just tell me what your backend actually returns! 📝

