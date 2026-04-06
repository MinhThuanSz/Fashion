# CHECKOUT FLOW - QUICK FIX REFERENCE

## 🔴 THE PROBLEM

Frontend sends: `product_id` → Backend expects: `product_variant_id`

```javascript
// ❌ WRONG (frontend is doing this)
{
  items: [
    { product_id: 1, quantity: 2, ... }  // ← Wrong field name!
  ]
}

// ✅ CORRECT (backend needs this)
{
  items: [
    { product_variant_id: 5, quantity: 2, ... }  // ← Correct field name!
  ]
}
```

---

## 📊 FIELD COMPARISON

### What Cart DB Contains
```
cart_items table:
- product_variant_id (FK → product_variants)
- quantity
- unit_price
- subtotal
```

### What Order DB Expects
```
order_items table:
- product_variant_id (FK → product_variants)
- quantity
- unit_price
- subtotal
```

### Current Frontend Behavior
- Gets cart from API: `{ items: [{ product_variant_id: 5, quantity: 2, ... }] }`
- But sends to checkout: `{ items: [{ product_id: 1, quantity: 2, ... }] }`
- ← **Throws away the variant ID and replaces it with product ID!**

---

## 🔧 QUICK FIX FOR FRONTEND

### In Checkout Component:

**BAD (Current):**
```javascript
const payload = {
  receiver_name: formData.receiver_name,
  phone: formData.phone,
  shipping_address: formData.shipping_address,
  payment_method: formData.payment_method,
  items: cart.items.map(item => ({
    product_id: item.variant?.product_id,      // ❌ WRONG
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal
  }))
};
```

**GOOD (Fixed):**
```javascript
const payload = {
  receiver_name: formData.receiver_name,
  phone: formData.phone,
  shipping_address: formData.shipping_address,
  payment_method: formData.payment_method,
  items: cart.items.map(item => ({
    product_variant_id: item.product_variant_id,  // ✅ CORRECT
    quantity: item.quantity,
    unit_price: item.unit_price,
    subtotal: item.subtotal
  }))
};
```

---

## 🚀 WHAT CHANGES

### Backend Validation
File: [src/validations/productValidation.js](../src/validations/productValidation.js#L43-L120)

Current schema accepts:
- `product_variant_id`: number (positive)
- `product_id`: number (positive)
- **At least one must be provided**

### Backend Service Processing
File: [src/services/orderService.js](../src/services/orderService.js#L1-L200)

If frontend sends `product_id`:
1. Backend finds first active variant for that product
2. **Problem:** Loses size/color selection!
3. Example: User selected "Red Size L" (variant 5) → Backend uses "Blue Size S" (variant 1)

---

## ✅ TEST CASE

### API Request (POST /api/orders)
```json
{
  "receiver_name": "John Doe",
  "phone": "0123456789",
  "shipping_address": "123 Main St",
  "note": "Please deliver before 5pm",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 2,
      "unit_price": 1500000,
      "subtotal": 3000000
    },
    {
      "product_variant_id": 8,
      "quantity": 1,
      "unit_price": 2500000,
      "subtotal": 2500000
    }
  ]
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "id": 1,
    "user_id": 2,
    "receiver_name": "John Doe",
    "phone": "0123456789",
    "shipping_address": "123 Main St",
    "total_amount": 5500000,
    "order_status": "PENDING",
    "payment_method": "COD",
    "payment_status": "UNPAID",
    "created_at": "2024-04-06T...",
    "updated_at": "2024-04-06T..."
  }
}
```

### If Frontend Sends WRONG `product_id`
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "\"items[0].product_id\" is not allowed",
    "\"items[0].product_variant_id\" is not allowed (missing)"
  ]
}
```

---

## 📋 VALIDATION RULES

From [src/validations/productValidation.js](../src/validations/productValidation.js):

```javascript
items: Joi.array()
  .min(1)                      // At least 1 item
  .required()                  // Required field
  .items(
    Joi.object({
      product_variant_id: Joi.number().integer().positive(),
      product_id: Joi.number().integer().positive(),
      quantity: Joi.number().integer().greater(0).required(),
      unit_price: Joi.number().min(0),
      subtotal: Joi.number().min(0)
    })
    .or('product_variant_id', 'product_id')  // ← At least ONE required
    .required()
  )
```

---

## 🔍 DATA FLOW

```
Frontend Cart Redux/State
    ↓
  Contains: product_variant_id ✅
    ↓
User clicks "Place Order"
    ↓
Checkout Component builds payload
    ↓
☟ PROBLEM: Maps to product_id instead ❌
    ↓
API POST /orders with { items: [{ product_id, ... }] }
    ↓
Backend Validation
    ↓
❌ FAILS: "product_id is not allowed"
```

**Correct Flow:**
```
Frontend Cart Redux/State
    ↓
  Contains: product_variant_id ✅
    ↓
User clicks "Place Order"
    ↓
Checkout Component builds payload
    ↓
☕ CORRECT: Maps to product_variant_id ✅
    ↓
API POST /orders with { items: [{ product_variant_id, ... }] }
    ↓
Backend Validation
    ↓
✅ PASSES: Creates order with correct variant
```

---

## 📁 KEY FILES

| File | Purpose | Line |
|------|---------|------|
| Backend Validation | Rules for order items | [src/validations/productValidation.js](../src/validations/productValidation.js#L43) |
| Order Service | Creates order from items | [src/services/orderService.js](../src/services/orderService.js#L1) |
| Order Controller | API endpoint handler | [src/controllers/orderController.js](../src/controllers/orderController.js#L1) |
| Database Schema | cart_items & order_items | [schema.sql](../schema.sql#L113) |
| Cart Model | CartItem definition | [src/models/CartItem.js](../src/models/CartItem.js) |
| Order Model | OrderItem definition | [src/models/OrderItem.js](../src/models/OrderItem.js) |

---

## 🧪 POSTMAN TEST

**Method:** POST  
**URL:** `http://localhost:3000/api/orders`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (CORRECT):**
```json
{
  "receiver_name": "Test User",
  "phone": "0987654321",
  "shipping_address": "Test Address",
  "payment_method": "COD",
  "items": [
    {
      "product_variant_id": 5,
      "quantity": 1,
      "unit_price": 1000000,
      "subtotal": 1000000
    }
  ]
}
```

---

## 💡 WHY THIS MATTERS

1. **product_id** = The base product (e.g., "Red T-Shirt")
2. **product_variant_id** = The specific variant (e.g., "Red T-Shirt Size L Color #FF0000")

When user adds to cart, they select:
- Product + Size + Color = Creates/uses a specific Variant
- Cart stores product_variant_id (the combination)

When checking out:
- Must use product_variant_id to ensure correct size/color
- If frontend loses this info, wrong item can be ordered

---

## ⚙️ DATABASE RELATIONSHIPS

```
product_variants
  ├─ id (PRIMARY KEY)
  ├─ product_id (FK → products)
  ├─ size_id (FK → sizes)
  ├─ color_id (FK → colors)
  └─ stock

cart_items
  ├─ id (PRIMARY KEY)
  ├─ cart_id (FK → carts)
  ├─ product_variant_id (FK → product_variants)  ← KEY
  └─ quantity, unit_price, subtotal

order_items
  ├─ id (PRIMARY KEY)
  ├─ order_id (FK → orders)
  ├─ product_variant_id (FK → product_variants)  ← KEY
  └─ quantity, unit_price, subtotal
```

**Note:** Both cart_items and order_items use product_variant_id, NOT product_id
