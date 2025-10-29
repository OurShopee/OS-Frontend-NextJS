# Error Logging System

## Overview

This error logging system automatically captures and logs all API errors from both client-side and server-side requests. It sends detailed error information to your backend server for monitoring and debugging.

## How It Works

### 1. Error Logger (`src/lib/errorLogger.js`)

The error logger automatically captures:
- **Request Details**: URL, method, headers, parameters, request body
- **Response Details**: Status code, status text, response data, response headers
- **Error Details**: Error message, error code, stack trace
- **Context**: Timestamp, user agent, location, country ID, environment
- **Environment Info**: Client-side vs server-side, environment type

### 2. Integration Points

#### Client-Side (Browser)
- Integrated in `src/api/config.js` in the `configureAxios()` function
- Automatically logs all errors from client-side API calls

#### Server-Side (Next.js Server Components)
- Integrated in `src/api/config.js` in the `createAxiosInstance()` function
- Automatically logs all errors from server-side API calls

## Configuration

### Backend Endpoint

Set up a backend endpoint at `api/log-error` to receive error logs. The endpoint will receive POST requests with the following structure:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "url": "api/product_detail",
  "method": "GET",
  "baseURL": "https://api.example.com",
  "fullURL": "https://api.example.com/api/product_detail?sku=12345",
  "status": 500,
  "statusText": "Internal Server Error",
  "responseData": { "error": "Database connection failed" },
  "responseHeaders": { "content-type": "application/json" },
  "requestData": null,
  "requestParams": { "sku": "12345" },
  "requestHeaders": { "Country-Id": "1" },
  "errorMessage": "Request failed with status code 500",
  "errorCode": null,
  "errorName": "AxiosError",
  "stack": "AxiosError: ...",
  "userAgent": "Mozilla/5.0...",
  "location": "https://example.com/products/12345",
  "countryId": "1",
  "environment": "production",
  "isServerSide": false
}
```

### Adjusting Configuration

In `src/lib/errorLogger.js`, you can modify:

```javascript
const ERROR_LOG_ENDPOINT = "api/log-error"; // Change this to your backend endpoint
const ENABLE_CONSOLE_LOG = true; // Set to false to disable console logs in production
```

## Console Output

In development, errors are logged to the browser console with detailed information:

```
🔴 API Error: GET api/product_detail
Status: 500 Internal Server Error
Error: Request failed with status code 500
URL: https://api.example.com/api/product_detail?sku=12345
Timestamp: 2024-01-01T12:00:00.000Z
Request Data: { sku: '12345' }
Response Data: { error: 'Database connection failed' }
Country ID: 1
```

## Backend Setup Example

Here's a simple Node.js/Express example for receiving error logs:

```javascript
// Backend route
app.post('/api/log-error', (req, res) => {
  const errorLog = req.body;
  
  // Save to database
  ErrorLog.create(errorLog);
  
  // Or write to file
  fs.appendFile('error-logs.json', JSON.stringify(errorLog) + '\n');
  
  // Or send to external service (Sentry, LogRocket, etc.)
  // sentry.captureException(new Error(errorLog.errorMessage), { extra: errorLog });
  
  res.status(200).json({ status: 'success' });
});
```

## Database Schema Recommendation

```sql
CREATE TABLE error_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  timestamp DATETIME NOT NULL,
  url VARCHAR(500) NOT NULL,
  method VARCHAR(10) NOT NULL,
  base_url VARCHAR(300),
  full_url VARCHAR(800),
  status INT,
  status_text VARCHAR(50),
  response_data JSON,
  request_data JSON,
  request_params JSON,
  request_headers JSON,
  error_message TEXT,
  error_code VARCHAR(100),
  error_name VARCHAR(100),
  stack TEXT,
  user_agent TEXT,
  location VARCHAR(800),
  country_id VARCHAR(10),
  environment VARCHAR(20),
  is_server_side BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_timestamp (timestamp),
  INDEX idx_url (url(100)),
  INDEX idx_status (status),
  INDEX idx_country (country_id)
);
```

## Features

✅ **Automatic**: No manual error handling needed
✅ **Comprehensive**: Captures all request/response details
✅ **Server-Side**: Works in Next.js server components
✅ **Client-Side**: Works in browser components
✅ **Non-Blocking**: Logging failures don't affect application flow
✅ **Safe**: Prevents infinite loops from logging endpoints
✅ **Context-Aware**: Includes country ID, environment, location

## Best Practices

1. **Database Indexing**: Index on `timestamp`, `url`, `status`, and `country_id` for fast queries
2. **Log Retention**: Implement a cleanup job to archive or delete old logs
3. **Alert System**: Set up alerts for critical errors (500s, frequent failures)
4. **Monitoring Dashboard**: Build a dashboard to visualize error trends
5. **Rate Limiting**: Consider rate limiting the logging endpoint
6. **Security**: Sanitize sensitive data (passwords, tokens) before logging

## Disabling Console Logs

To disable console logs in production, edit `src/lib/errorLogger.js`:

```javascript
const ENABLE_CONSOLE_LOG = process.env.NEXT_PUBLIC_NODE_ENV === "development";
```

## Testing

To test the error logging:

1. Make an invalid API call in your application
2. Check the browser console for the error log
3. Check your backend `api/log-error` endpoint for the logged error
4. Verify the error is saved in your database

## Troubleshooting

**Errors not being logged?**
- Check that your backend `api/log-error` endpoint is accessible
- Verify the endpoint returns 200 status
- Check the browser console for any errors from the logging system

**Infinite loops?**
- The system automatically prevents logging errors from the logging endpoint itself
- If you still see issues, check for circular dependencies

**Missing data in logs?**
- Some data may be omitted for security (like passwords in request data)
- Check browser/server console for original error details

