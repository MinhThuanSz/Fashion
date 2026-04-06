/**
 * QUICK DIAGNOSTIC GUIDE
 * ======================
 * 
 * How to identify and fix the checkout issue in your Frontend
 */

// ============================================
// STEP 1: Identify Frontend Cart Structure
// ============================================

/*
Open browser DevTools (F12) → Go to Console tab

Then paste and run this code:

// Method A: If using Redux DevTools Profiler
const store = window.__reduxDevtoolsState || window.__store__;
const cartState = store.getState().cart;
console.table(cartState.items);

OR

// Method B: If storing in localStorage
const cart = JSON.parse(localStorage.getItem('cart'));
console.table(cart?.items);

OR

// Method C: Network tab inspection
// After page loads, go to Network → find /api/carts request
// Click it → Preview tab → see the response structure
*/

// ============================================
// STEP 2: Check What Fields Cart Item Has
// ============================================

const DIAGNOSE_CART_STRUCTURE = () => {
  // Get first cart item
  const firstItem = cartItems?.[0];
  
  if (!firstItem) {
    console.error('❌ No cart items found!');
    return false;
  }

  console.log('Cart Item Structure:');
  console.log('────────────────────');
  
  const fields = {
    'Has product_variant_id?': firstItem.product_variant_id ? '✅ YES' : '❌ NO',
    'product_variant_id value': firstItem.product_variant_id || 'undefined',
    'Has product_id?': firstItem.product_id ? '✅ YES' : '❌ NO', 
    'product_id value': firstItem.product_id || 'undefined',
    'Has id?': firstItem.id ? '✅ YES' : '❌ NO',
    'id value': firstItem.id || 'undefined',
    'All fields': Object.keys(firstItem).join(', ')
  };

  Object.entries(fields).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });

  return firstItem.product_variant_id ? true : false;
};

// ============================================
// STEP 3: Identify the Issue
// ============================================

const IDENTIFY_ISSUE = () => {
  const hasProductVariantId = cartItems?.[0]?.product_variant_id;
  
  if (!hasProductVariantId) {
    console.error('❌ ISSUE FOUND: cartItems missing product_variant_id');
    console.log('How to fix:');
    console.log('1. Check where cart is fetched in your code');
    console.log('2. Find the API call to GET /api/carts');
    console.log('3. Ensure response is not transformed wrong');
    console.log('4. When storing in Redux, preserve product_variant_id field');
    return 'MISSING_PRODUCT_VARIANT_ID';
  }

  console.log('✅ Cart structure looks correct!');
  return 'CART_STRUCTURE_OK';
};

// ============================================
// STEP 4: Test Payload Creation
// ============================================

const DEBUG_CHECKOUT_PAYLOAD = () => {
  // Simulate what checkout creates
  const mockFormData = {
    receiver_name: 'Test User',
    phone: '0901234567',
    shipping_address: 'TP.HCM',
    city: '',
  };

  const mockPayload = {
    receiver_name: mockFormData.receiver_name.trim(),
    phone: mockFormData.phone.trim(),
    shipping_address: `${mockFormData.shipping_address.trim()}${
      mockFormData.city ? `, ${mockFormData.city.trim()}` : ''
    }`,
    payment_method: 'COD',
    items: cartItems
      .filter(item => item.product_variant_id)
      .map(item => ({
        product_variant_id: item.product_variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }))
  };

  console.log('Test Payload:');
  console.log(JSON.stringify(mockPayload, null, 2));
  
  // Check validity
  const issues = [];
  if (!mockPayload.items || mockPayload.items.length === 0) {
    issues.push('❌ Items array is empty or missing');
  }
  
  mockPayload.items?.forEach((item, idx) => {
    if (!item.product_variant_id) {
      issues.push(`❌ Item ${idx} missing product_variant_id`);
    }
    if (!item.quantity || item.quantity <= 0) {
      issues.push(`❌ Item ${idx} has invalid quantity`);
    }
  });

  if (issues.length > 0) {
    console.error('Issues found:');
    issues.forEach(issue => console.error(issue));
    return false;
  }

  console.log('✅ Payload looks valid!');
  return true;
};

// ============================================
// STEP 5: Test API Call with Mock
// ============================================

const TEST_CHECKOUT_API = async (token) => {
  const payload = {
    receiver_name: 'Test User',
    phone: '0901234567',
    shipping_address: 'TP.HCM',
    payment_method: 'COD',
    items: [
      {
        product_variant_id: 5,  // ← MUST be actual variant ID from DB
        quantity: 1
      }
    ]
  };

  console.log('Sending payload:', payload);

  try {
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', data);

    if (response.ok) {
      console.log('✅ SUCCESS! Order created:', data.data?.id);
    } else {
      console.error('❌ FAILED! Errors:', data.errors);
    }

    return data;
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// ============================================
// STEP 6: Find Source of Cart Loading
// ============================================

const FIND_CART_LOADING_CODE = () => {
  console.log(`
Where to look in your Frontend code:

1. Redux Slice/Reducer file
   - File name like: src/store/slices/cartSlice.js
   - OR: src/store/cart/cartActions.js
   - Look for: 
     * setCart() action
     * getCart middleware function
     * API response handling

2. Cart Service file
   - File name like: src/services/cartService.js
   - OR: src/services/api.js
   - Look for: 
     * getCart function
     * API call to /api/carts
     * Response mapping

3. After fetching from API, check:
   - Not renaming product_variant_id to something else
   - Not extracting just certain fields
   - Preserving full response structure

Example WRONG transform:
  // ❌ BAD - Only extracting these fields
  const cart = response.data.items.map(item => ({
    id: item.id,
    quantity: item.quantity,
    // ← Missing product_variant_id!
  }));

Example CORRECT transform:
  // ✅ GOOD - Keep all fields
  const cart = response.data.map(item => ({
    id: item.id,
    product_variant_id: item.product_variant_id,  // ← Include this!
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal
  }));
  `);
};

// ============================================
// STEP 7: Run Full Diagnostic
// ============================================

const RUN_FULL_DIAGNOSTIC = async (token) => {
  console.log('🔍 RUNNING FULL DIAGNOSTIC...\n');
  
  console.log('Step 1: Cart Structure');
  const hasStructure = DIAGNOSE_CART_STRUCTURE();
  
  console.log('\nStep 2: Identify Issue');
  const issue = IDENTIFY_ISSUE();
  
  console.log('\nStep 3: Test Payload');
  const payloadOk = DEBUG_CHECKOUT_PAYLOAD();
  
  if (!hasStructure || !payloadOk) {
    console.log('\n❌ ISSUES FOUND - See above for details');
    console.log('\nNext: Update your Redux slice or cart loading code');
    FIND_CART_LOADING_CODE();
  } else {
    console.log('\n✅ CART & PAYLOAD LOOK GOOD');
    console.log('Try testing API call with TEST_CHECKOUT_API(token)');
  }
};

// ============================================
// USAGE INSTRUCTIONS
// ============================================

/*
TO RUN DIAGNOSTICS:

1. Log in to your website
2. Add some products to cart
3. Open browser console (F12)
4. Copy-paste the appropriate function:

// To check cart structure:
> DIAGNOSE_CART_STRUCTURE()

// To identify the issue:
> IDENTIFY_ISSUE()

// To see what payload would be sent:
> DEBUG_CHECKOUT_PAYLOAD()

// To test API call (needs token):
> TEST_CHECKOUT_API('YOUR_JWT_TOKEN')

// To run everything:
> RUN_FULL_DIAGNOSTIC('YOUR_JWT_TOKEN')
*/

// ============================================
// HOW TO GET YOUR TOKEN
// ============================================

/*
Method 1: From localStorage
> localStorage.getItem('token')
OR
> localStorage.getItem('jwt')
OR
> JSON.parse(localStorage.getItem('user')).token

Method 2: From Redux
> store.getState().auth.token

Method 3: From Network tab request headers
- Open DevTools Network
- Any request to /api/
- Look for "Authorization: Bearer TOKEN_HERE"
*/

// ============================================
// COMMON FINDINGS & FIXES
// ============================================

/*
FINDING 1: cartItems[0].product_variant_id = undefined
FIX: In your cart service/redux, when fetching from API:
  - Don't rename fields
  - Don't filter out fields
  - Keep full response structure
  
FINDING 2: cartItems[0].id = 5 but NO product_variant_id
FIX: You're using CartItem.id instead of CartItem.product_variant_id
     These are different!
     - id: CartItem's own ID
     - product_variant_id: The product variant being bought
     
     Use: product_variant_id in checkout payload

FINDING 3: No cart items at all
FIX: Cart not fetching from backend after login
     - Check: isLoggedIn check before fetching
     - Check: Token is valid
     - Check: /api/carts endpoint working
     - Look for cart.getCart() or similar call

FINDING 4: Payload created but API call fails with validation error
FIX: Still getting the error even with correct payload?
     - Check network tab - is product_variant_id actually in sent JSON?
     - Check if field is null/undefined
     - Verify field name spelling (underscore vs camelCase)
*/

// ============================================
// Quick Config Checklist
// ============================================

const CHECKLIST = () => {
  console.log(`
✅ BEFORE DEPLOYING - VERIFY:

Frontend Cart Loading:
  [ ] API call to /api/carts includes auth token
  [ ] Response includes product_variant_id field
  [ ] Redux stores full CartItem with product_variant_id
  
Frontend Checkout Page:
  [ ] When building payload.items, uses product_variant_id
  [ ] Not using 'id' or 'product_id' from CartItem
  [ ] Validates at least 1 item before sending
  [ ] Checks each item has product_variant_id
  
Backend Files:
  [ ] src/validations/productValidation.js updated
  [ ] src/middlewares/validateMiddleware.js updated
  [ ] src/services/orderService.js has transaction logic
  [ ] src/routes/orderRoutes.js uses correct middleware
  
Testing:
  [ ] Test with curl/Postman first (with product_variant_id)
  [ ] Test with minimal payload (no unit_price/subtotal)
  [ ] Verify order created in database
  [ ] Verify order_items inserted
  [ ] Verify stock decremented
  [ ] Verify cart cleared after order
  `);
};

module.exports = {
  DIAGNOSE_CART_STRUCTURE,
  IDENTIFY_ISSUE,
  DEBUG_CHECKOUT_PAYLOAD,
  TEST_CHECKOUT_API,
  FIND_CART_LOADING_CODE,
  RUN_FULL_DIAGNOSTIC,
  CHECKLIST
};
