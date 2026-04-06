# Complete Checkout/Order Creation Flow Analysis

## Executive Summary
**Core Issue:** Frontend and backend use different identifiers for cart items:
- **Frontend sends:** `product_id` (the product, not the variant)
- **Backend expects:** `product_variant_id` (the specific size/color combination)
- **Result:** Validation failures and order creation blocking

---

## 1. FRONTEND CART ITEM STRUCTURE

### Database Schema (cart_items table)
**File:** [schema.sql](schema.sql#L123-L133)

```sql
CREATE TABLE cart_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL FOREIGN KEY REFERENCES carts(id),
    product_variant_id INT NOT NULL FOREIGN KEY REFERENCES product_variants(id),  -- ← KEY FIELD
    quantity INT NOT NULL,
    unit_price DECIMAL(18, 2) NOT NULL,
    subtotal DECIMAL(18, 2) NOT NULL,
    created_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET(),
    updated_at DATETIMEOFFSET NOT NULL DEFAULT SYSDATETIMEOFFSET()
);
```

### Sequelize Model (CartItem)
**File:** [src/models/CartItem.js](src/models/CartItem.js)

```javascript
const CartItem = sequelize.define('CartItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cart_id: { type: DataTypes.INTEGER, allowNull: false },
  product_variant_id: { type: DataTypes.INTEGER, allowNull: false },  // ← PRIMARY KEY
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  unit_price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(18, 2) }
}, {
  tableName: 'cart_items',
  timestamps: true,
  underscored: true
});
```

### How Cart is Fetched (in CartService)
**File:** [src/services/cartService.js](src/services/cartService.js#L1-L15)

```javascript
const getCartByUserId = async (userId) => {
  return await Cart.findOne({
    where: { user_id: userId },
    include: [{
      model: CartItem, 
      as: 'items',
      include: [{
        model: ProductVariant, 
        as: 'variant',
        include: [/* ProductImage details */]
      }]
    }]
  });
};
```

**What frontend receives:**
```javascript
{
  id: 1,
  user_id: 1,
  total_amount: 5000000,
  items: [
    {
      id: 1,
      cart_id: 1,
      product_variant_id: 5,        // ← This is from database
      quantity: 2,
      unit_price: 1500000,
      subtotal: 3000000,
      variant: {
        id: 5,
        product_id: 1,              // ← Product relation exists
        size_id: 2,
        color_id: 3,
        stock: 100,
        Product: { price, discount_price, ... }
      }
    }
  ]
}
```

---

## 2. FRONTEND CHECKOUT COMPONENT - PAYLOAD MAPPING

### ❌ WRONG: What Frontend is Currently Sending
**File:** [CHECKOUT_TEST_PAYLOADS.js](CHECKOUT_TEST_PAYLOADS.js#L7-L29)

```javascript
// WRONG PAYLOAD - Frontend is sending product_id instead of product_variant_id
const WRONG_CHECKOUT_PAYLOAD = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1, TP.HCM",
  note: "Giao chiều",
  payment_method: "COD",
  items: [
    {
      product_id: 1,           // ❌ WRONG - should be product_variant_id
      quantity: 2,
      unit_price: 1500000,
      subtotal: 3000000
    }
  ]
};
```

**Error received:**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Mã sản phẩm phải là số nguyên",
    "\"items[0].product_id\" is not allowed",
    "\"items[0].product_variant_id\" is not allowed (missing)"
  ]
}
```

### ✅ CORRECT: What Frontend Should Send
**File:** [CHECKOUT_TEST_PAYLOADS.js](CHECKOUT_TEST_PAYLOADS.js#L33-L68)

```javascript
// CORRECT PAYLOAD
const CORRECT_CHECKOUT_PAYLOAD = {
  receiver_name: "Nguyễn Văn A",
  phone: "0123456789",
  shipping_address: "123 Đường 1, TP.HCM",
  note: "Giao chiều",
  payment_method: "COD",
  items: [
    {
      product_variant_id: 5,   // ✅ CORRECT - variant ID from cart
      quantity: 2,
      unit_price: 1500000,
      subtotal: 3000000
    }
  ]
};
```

---

## 3. BACKEND VALIDATION SCHEMA

**File:** [src/validations/productValidation.js](src/validations/productValidation.js#L43-L120)

### Order Items Validation Schema
```javascript
const orderSchema = Joi.object({
  receiver_name: Joi.string().trim().required(),
  phone: Joi.string().trim().required(),
  shipping_address: Joi.string().trim().required(),
  note: Joi.string().trim().allow('', null),
  payment_method: Joi.string().trim().required().valid('COD', 'TRANSFER', 'CASH'),
  
  items: Joi.array().min(1).required().items(
    Joi.object({
      product_variant_id: Joi.number().integer().positive().messages({
        'number.base': 'Mã biến thể sản phẩm phải là số nguyên',
        'number.positive': 'Mã biến thể sản phẩm phải lớn hơn 0'
      }),
      product_id: Joi.number().integer().positive().messages({
        'number.base': 'Mã sản phẩm phải là số nguyên',
        'number.positive': 'Mã sản phẩm phải lớn hơn 0'
      }),
      quantity: Joi.number().integer().greater(0).required(),
      unit_price: Joi.number().min(0),
      subtotal: Joi.number().min(0)
    })
    .or('product_variant_id', 'product_id')  // ← At least one required
    .required()
  )
});
```

### Key Validation Points:
1. **Items is required** - Must have at least 1 item (min(1))
2. **At least one of:** product_variant_id OR product_id required (`.or()`)
3. **product_variant_id preferred** - Directly references variant in DB
4. **product_id as fallback** - Backend will find first active variant for that product
5. **quantity required** - Must be > 0
6. **unit_price & subtotal optional** - Backend can calculate from product data

---

## 4. BACKEND ORDER SERVICE - ITEM PROCESSING

**File:** [src/services/orderService.js](src/services/orderService.js#L1-L120)

### Order Creation Flow

#### Step 1: Prepare Items
```javascript
const createOrder = async (userId, data) => {
  const { receiver_name, phone, shipping_address, note, payment_method, items } = data;
  const transaction = await sequelize.transaction();

  try {
    let orderItemsInput = items || [];
    let cart = null;

    // If frontend doesn't send items, fetch from backend cart
    if (orderItemsInput.length === 0) {
      cart = await Cart.findOne(
        { where: { user_id: userId }, include: [{ model: CartItem, as: 'items' }] },
        { transaction }
      );
      // ... fallback logic
      orderItemsInput = cart.items.map(item => ({
        product_variant_id: item.product_variant_id,  // ← From CartItem
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }));
    }
```

#### Step 2: Validate Each Item
```javascript
    // For each order item, resolve product_variant_id
    for (let i = 0; i < orderItemsInput.length; i++) {
      const item = orderItemsInput[i];
      let variant_id = item.product_variant_id;

      // ← FALLBACK: If frontend sent product_id instead
      if (!variant_id && item.product_id) {
        const firstVariant = await ProductVariant.findOne({
          where: { product_id: item.product_id, status: 1 },
          order: [['id', 'ASC']],
        }, { transaction });
        
        if (!firstVariant) {
          throw new Error(
            `Sản phẩm (ID: ${item.product_id}) không có biến thể nào khả dụng.`
          );
        }
        
        variant_id = firstVariant.id;  // ← Use first available variant
      }

      // Validate variant_id exists and is valid
      const variant = await ProductVariant.findByPk(variant_id, {
        transaction,
        include: { model: Product, attributes: ['price', 'discount_price'] }
      });

      // Check variant status (must be active = 1)
      if (variant.status !== 1) {
        throw new Error(`Sản phẩm không còn khả dụng.`);
      }

      // Check stock availability
      const qty = parseInt(item.quantity);
      if (variant.stock < qty) {
        throw new Error(
          `Sản phẩm chỉ còn ${variant.stock} cái, bạn muốn ${qty} cái.`
        );
      }

      // Calculate or use provided unit_price
      let unit_price = item.unit_price ? parseFloat(item.unit_price) : null;
      if (!unit_price || unit_price <= 0) {
        unit_price = variant.Product.discount_price || variant.Product.price;
      }

      // Build validated item
      validatedItems.push({
        variant_id: variant.id,
        quantity: qty,
        unit_price: unit_price,
        subtotal: qty * unit_price,
        variant
      });
    }
```

#### Step 3: Create Order & Items
```javascript
    // Calculate total from validated items
    const total_amount = validatedItems.reduce((sum, item) => sum + Number(item.subtotal), 0);

    // Create order record
    const order = await Order.create({
      user_id: userId,
      receiver_name,
      phone,
      shipping_address,
      note,
      total_amount,
      order_status: 'PENDING',
      payment_method,
      payment_status: 'UNPAID'
    }, { transaction });

    // Create order items and reduce stock
    for (const item of validatedItems) {
      await OrderItem.create({
        order_id: order.id,
        product_variant_id: item.variant_id,  // ← Always variant ID
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      }, { transaction });

      item.variant.stock -= item.quantity;
      await item.variant.save({ transaction });
    }

    // Clear backend cart if used
    if (cart) {
      await CartItem.destroy({ where: { cart_id: cart.id }, transaction });
    }

    await transaction.commit();
    return order;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
```

---

## 5. BACKEND DATABASE SCHEMA

### Order Model
**File:** [src/models/Order.js](src/models/Order.js)

```javascript
const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  receiver_name: { type: DataTypes.STRING(100), allowNull: false },
  phone: { type: DataTypes.STRING(15), allowNull: false },
  shipping_address: { type: DataTypes.STRING(255), allowNull: false },
  note: { type: DataTypes.TEXT },
  total_amount: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  order_status: { type: DataTypes.STRING(50), defaultValue: 'Pending' },  // Pending, Confirmed, Shipping, Success, Cancelled
  payment_method: { type: DataTypes.STRING(50), defaultValue: 'COD' },
  payment_status: { type: DataTypes.STRING(50), defaultValue: 'Unpaid' } // Unpaid, Paid, Refunded
});
```

### Order Items Model
**File:** [src/models/OrderItem.js](src/models/OrderItem.js)

```javascript
const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false },
  product_variant_id: { type: DataTypes.INTEGER, allowNull: false },  // ← KEY FIELD
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  unit_price: { type: DataTypes.DECIMAL(18, 2), allowNull: false },
  subtotal: { type: DataTypes.DECIMAL(18, 2), allowNull: false }
});
```

### SQL Schema
**File:** [schema.sql](schema.sql#L135-L169)

```sql
-- Cart
CREATE TABLE carts (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    total_amount DECIMAL(18, 2) DEFAULT 0,
    status TINYINT DEFAULT 1,
    created_at DATETIMEOFFSET NOT NULL,
    updated_at DATETIMEOFFSET NOT NULL
);

-- Cart Items
CREATE TABLE cart_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL FOREIGN KEY REFERENCES carts(id),
    product_variant_id INT NOT NULL FOREIGN KEY REFERENCES product_variants(id),  -- Variant ID
    quantity INT NOT NULL,
    unit_price DECIMAL(18, 2) NOT NULL,
    subtotal DECIMAL(18, 2) NOT NULL,
    created_at DATETIMEOFFSET NOT NULL,
    updated_at DATETIMEOFFSET NOT NULL
);

-- Orders
CREATE TABLE orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    receiver_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(15) NOT NULL,
    shipping_address NVARCHAR(MAX) NOT NULL,
    note NVARCHAR(MAX),
    total_amount DECIMAL(18, 2) NOT NULL,
    order_status NVARCHAR(50) DEFAULT 'PENDING',
    payment_method NVARCHAR(50),
    payment_status NVARCHAR(50) DEFAULT 'UNPAID',
    created_at DATETIMEOFFSET NOT NULL,
    updated_at DATETIMEOFFSET NOT NULL
);

-- Order Items
CREATE TABLE order_items (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL FOREIGN KEY REFERENCES orders(id),
    product_variant_id INT NOT NULL FOREIGN KEY REFERENCES product_variants(id),  -- Variant ID
    quantity INT NOT NULL,
    unit_price DECIMAL(18, 2) NOT NULL,
    subtotal DECIMAL(18, 2) NOT NULL,
    created_at DATETIMEOFFSET NOT NULL,
    updated_at DATETIMEOFFSET NOT NULL
);
```

---

## 6. PROBLEM ANALYSIS

### The Core Mismatch

| Component | Uses | Issue |
|-----------|------|-------|
| Database Schema (cart_items) | `product_variant_id` | ✅ Correct |
| Database Schema (order_items) | `product_variant_id` | ✅ Correct |
| CartItem Model | `product_variant_id` | ✅ Correct |
| OrderItem Model | `product_variant_id` | ✅ Correct |
| Cart Retrieved Data | `product_variant_id` in items | ✅ Correct |
| Validation Schema | Allows BOTH `product_variant_id` and `product_id` | ⚠️ Flexible but confusing |
| Frontend Checkout | Sends `product_id` | ❌ WRONG |
| Backend Service | Expects `product_variant_id` preferentially | ⚠️ Has fallback but inefficient |

### Why Frontend Sends Wrong ID

**Likely reasons:**
1. Frontend is not properly mapping cart data to order payload
2. Frontend stores `product_id` in Redux/State instead of extracting `product_variant_id` from cart items
3. Frontend developer confused "product" with "product_variant"
4. Frontend is directly using Product data instead of CartItem data when building checkout payload

### Fallback Behavior in Backend

The backend has a fallback mechanism:
- If `product_id` sent → finds first active variant for that product
- **Problem:** This loses size/color selection from the original cart!
- **Example:** User selected "Red Size L" (variant 5), but only product_id 1 sent → backend picks first variant of product 1 (might be "Blue Size S" - variant 1)

---

## 7. RECOMMENDED FIX APPROACH

### Option A: Frontend Fix (Most Correct)
**Speed:** ⚡ Fast | **Correctness:** ✅ Perfect | **Impact:** Frontend only

**Steps:**
1. In checkout component, map cart items using `product_variant_id` directly:
```javascript
// In CheckoutPage component
const items = cart.items.map(cartItem => ({
  product_variant_id: cartItem.product_variant_id,  // ← Use variant ID
  quantity: cartItem.quantity,
  unit_price: cartItem.unit_price,
  subtotal: cartItem.subtotal
}));
```

2. Do NOT use `cartItem.variant.product_id` in the payload
3. Test with correct payload structure

**Reference:** [FRONTEND_CHECKOUT_GUIDE.js](FRONTEND_CHECKOUT_GUIDE.js)

### Option B: Backend Validation Strictness (Additional Safety)

**File to update:** [src/validations/productValidation.js](src/validations/productValidation.js)

Current schema allows both fields. Consider:
- **Remove `product_id` from schema** (unless truly needed for mobile apps)
- **Or make schema stricter:** Validate that if both sent, they match
- **Note:** Backend already has product_id fallback logic in orderService.js at line 46-57

### Option C: Improve Backend Error Messages

**File:** [src/services/orderService.js](src/services/orderService.js#L46-L65)

Add clearer error when product_id fallback doesn't find variant:
```javascript
// Current: Generic error
// Improved: Specific error showing which fields are required
throw new Error(
  `Item ${i + 1}: Phải gửi product_variant_id. ` +
  `Nếu gửi product_id, phải có ít nhất 1 variant hoạt động cho sản phẩm đó.`
);
```

---

## 8. CONTROLLER FLOW

**File:** [src/controllers/orderController.js](src/controllers/orderController.js#L1-L6)

```javascript
const createOrder = async (req, res, next) => {
  try {
    // req.body should contain: receiver_name, phone, shipping_address, note, payment_method, items[]
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully', 
      data: order 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};
```

---

## 9. SUMMARY TABLE

### Cart Item Fields (from front → backend)
| Field | Type | Source | For Order |
|-------|------|--------|-----------|
| `id` | INT | CartItem.id | ❌ Not needed |
| `cart_id` | INT | CartItem.cart_id | ❌ Not used |
| `product_variant_id` | INT | CartItem.product_variant_id | ✅ **SEND THIS** |
| `quantity` | INT | CartItem.quantity | ✅ Send |
| `unit_price` | DECIMAL | CartItem.unit_price | ✅ Send |
| `subtotal` | DECIMAL | CartItem.subtotal | ✅ Send |

### Bad Frontend Mapping
```javascript
// ❌ WRONG
const items = cart.items.map(i => ({
  product_id: i.variant.product_id,  // Wrong!
  quantity: i.quantity,
  unit_price: i.unit_price,
  subtotal: i.subtotal
}));
```

### Good Frontend Mapping
```javascript
// ✅ CORRECT
const items = cart.items.map(i => ({
  product_variant_id: i.product_variant_id,  // Correct!
  quantity: i.quantity,
  unit_price: i.unit_price,
  subtotal: i.subtotal
}));
```

---

## 10. QUICK DEBUG CHECKLIST

When testing checkout:

- [ ] Cart item has `product_variant_id` field populated (not null)
- [ ] Frontend sends order payload with `items[].product_variant_id` (not `product_id`)
- [ ] Validation passes without "is not allowed" errors
- [ ] Backend orderService receives correct `product_variant_id`
- [ ] Order created with correct variant (can verify via order_items table)
- [ ] Stock reduced for the correct variant
- [ ] User can retrieve order with correct items

---

## Files Summary

| File | Purpose | Key Finding |
|------|---------|-------------|
| [schema.sql](schema.sql) | Database schema | `product_variant_id` is the key field in cart_items & order_items |
| [src/models/CartItem.js](src/models/CartItem.js) | Sequelize model | Stores `product_variant_id` |
| [src/models/OrderItem.js](src/models/OrderItem.js) | Sequelize model | Expects `product_variant_id` |
| [src/services/cartService.js](src/services/cartService.js) | Cart operations | Returns CartItems with `product_variant_id` |
| [src/services/orderService.js](src/services/orderService.js) | Order creation | Validates & creates order with items |
| [src/controllers/orderController.js](src/controllers/orderController.js) | Request handler | Passes data to orderService |
| [src/validations/productValidation.js](src/validations/productValidation.js) | Validation Schema | Defines order item structure |
| [FRONTEND_CHECKOUT_GUIDE.js](FRONTEND_CHECKOUT_GUIDE.js) | Frontend docs | Shows correct mapping |
| [CHECKOUT_TEST_PAYLOADS.js](CHECKOUT_TEST_PAYLOADS.js) | Test examples | Shows wrong vs correct payloads |
