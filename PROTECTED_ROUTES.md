# Protected Routes - Authentication Implementation

## Overview
A reusable authentication wrapper (`withAuth`) has been created to protect routes and show the `Notlogin` component when users are not authenticated.

## Implementation

### Authentication Wrapper
**File:** `src/components/Common/withAuth.js`

This Higher Order Component (HOC) checks if the `jwt_token` cookie exists. If not authenticated, it displays the `Notlogin` component instead of the protected page content.

### Usage Example
```javascript
import withAuth from "@/components/Common/withAuth";

const MyProtectedPage = () => {
    // Your page component code
    return (
        <div>Protected Content</div>
    );
};

export default withAuth(MyProtectedPage);
```

## Protected Routes

The following routes are now protected with authentication:

### Account Pages
1. **My Account** - `/myaccount`
   - File: `src/app/myaccount/page.js`
   - Shows user profile information

2. **Profile** - `/myaccount/profile`
   - File: `src/app/myaccount/profile/page.js`
   - Edit profile details

3. **Address** - `/address`
   - File: `src/app/address/page.js`
   - Manage delivery addresses

4. **Change Password** - `/change-password`
   - File: `src/app/change-password/page.js`
   - Update account password

5. **My Wishlist** - `/my-wishlist`
   - File: `src/app/my-wishlist/page.js`
   - View saved wishlist items

### Order Pages
6. **My Orders** - `/my-orders`
   - File: `src/app/my-orders/page.js`
   - View order history

7. **Track Your Order** - `/track-your-order`
   - File: `src/app/track-your-order/page.js`
   - Track order status

### Complaint Pages
8. **Complaints** - `/complaints`
   - File: `src/app/complaints/page.js`
   - Manage complaints dashboard

9. **Place a Complaint** - `/place-a-complaints`
   - File: `src/app/place-a-complaints/page.js`
   - Submit new complaints

10. **Manage Complaint** - `/manage-complaint`
    - File: `src/app/manage-complaint/page.js`
    - Track complaint status

## How It Works

1. User navigates to any protected route
2. `withAuth` HOC checks for `jwt_token` cookie
3. If token exists → User sees the protected page content
4. If token doesn't exist → User sees `Notlogin` component with login prompt
5. `Notlogin` component has a button that opens the login modal

## Benefits

- **Centralized Logic**: Single authentication check for all protected routes
- **Consistent UX**: Same login prompt across all protected pages
- **Easy to Extend**: Simply wrap any new protected page with `withAuth()`
- **Maintainable**: Update authentication logic in one place
- **Type Safe**: Proper display names for debugging

## Adding New Protected Routes

To protect a new route:

1. Import the HOC at the top of your page file:
   ```javascript
   import withAuth from "@/components/Common/withAuth";
   ```

2. Wrap your component export:
   ```javascript
   export default withAuth(YourComponent);
   ```

That's it! Your route is now protected.

