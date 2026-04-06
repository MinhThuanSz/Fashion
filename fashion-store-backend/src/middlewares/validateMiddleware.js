const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errorsArr = error.details.map((d) => {
      // Lấy message tùy chỉnh nếu có, hoặc tạo message user-friendly
      const customMessage = d.context.label 
        ? `${d.context.label}: ${d.message}`
        : d.message;
      
      return customMessage;
    });

    // Nếu là lỗi validation trên endpoint /orders, cải thiện message
    if (req.path === '/orders' || req.path.startsWith('/api/orders')) {
      // 🔍 Phân tích loại lỗi và thêm gợi ý
      const hasProductError = errorsArr.some(e => 
        e.toLowerCase().includes('product_variant_id') || 
        e.toLowerCase().includes('product_id') ||
        e.toLowerCase().includes('sản phẩm')
      );
      
      const hasMissingIdError = errorsArr.some(e =>
        e.toLowerCase().includes('must contain at least one of [product_variant_id, product_id]')
      );
      
      if (hasMissingIdError) {
        errorsArr.push(
          '💡 Mỗi sản phẩm trong đơn hàng phải có product_variant_id hoặc product_id. Ví dụ: { "product_variant_id": 5, "quantity": 1 }'
        );
      } else if (hasProductError) {
        errorsArr.push(
          '💡 Kiểm tra lại giỏ hàng và đảm bảo có dữ liệu sản phẩm hợp lệ.'
        );
      }

      // Log để debug
      console.error('❌ Checkout Validation Error:', JSON.stringify({
        path: req.path,
        errors: errorsArr,
        requestBody: req.body
      }, null, 2));
    }

    return res.status(400).json({ 
      success: false,
      message: 'Validation Error',
      errors: errorsArr,
      debug: process.env.NODE_ENV === 'development' ? {
        receivedFields: Object.keys(req.body),
        itemsCount: req.body.items?.length || 0,
        firstItemFields: req.body.items?.[0] ? Object.keys(req.body.items[0]) : []
      } : undefined
    });
  }
};

module.exports = validate;
