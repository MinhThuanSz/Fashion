import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Star, Share2, Heart, ChevronLeft, ChevronRight, Truck, RotateCcw, ShieldCheck, Plus, Minus } from 'lucide-react'
import { products } from '../data/products'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { UI_TEXT } from '../constants/text'
import ProductCard from '../components/product/ProductCard'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const product = products.find(p => p.id === parseInt(id))
  
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product) {
       setSelectedSize(product.sizes[0])
       setSelectedColor(product.colors[0])
       setActiveImage(0)
       setQuantity(1)
       window.scrollTo(0, 0)
    }
  }, [id, product])

  if (!product) return (
     <div className="pt-40 text-center py-20 min-h-screen">
        <p className="text-2xl font-black italic uppercase tracking-widest">{UI_TEXT.common.noResults}</p>
        <Link to="/products" className="btn btn-primary mt-10 px-12 py-5 rounded-2xl block w-fit mx-auto">{UI_TEXT.cart.startShopping}</Link>
     </div>
  )

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    }))
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`, { icon: '🛍️' })
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="pt-32 pb-32">
      <div className="container-custom">
        {/* Breadcrumb Detail */}
        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-12 border-b border-gray-100 pb-4">
           <Link to="/">{UI_TEXT.common.home}</Link>
           <ChevronRight size={10} />
           <Link to={`/products?category=${product.category}`}>{product.viewCategory}</Link>
           <ChevronRight size={10} />
           <span className="text-black not-italic">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 xl:gap-32">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-premium group">
               <AnimatePresence mode="wait">
                 <motion.img 
                   key={activeImage}
                   src={product.images[activeImage] || product.image} 
                   alt={product.name} 
                   initial={{ opacity: 0, scale: 1.1 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.6 }}
                   className="w-full h-full object-cover"
                 />
               </AnimatePresence>
               {product.images.length > 1 && (
                  <div className="absolute inset-x-8 bottom-8 flex justify-between pointer-events-none">
                     <button 
                       onClick={() => setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                       className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl pointer-events-auto hover:bg-black hover:text-white transition-all transform hover:scale-110"
                     >
                        <ChevronLeft size={24} />
                     </button>
                     <button 
                       onClick={() => setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                       className="w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-2xl pointer-events-auto hover:bg-black hover:text-white transition-all transform hover:scale-110"
                     >
                        <ChevronRight size={24} />
                     </button>
                  </div>
               )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 px-1 scrollbar-hide">
              {product.images.map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 transition-all duration-300 border-2 ${activeImage === i ? 'border-black shadow-premium scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] font-outfit italic border-b-2 border-gray-100 pb-1">{product.brand}</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl shadow-inner border border-gray-100">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-black">{product.ratings}</span>
                  <span className="text-[10px] font-bold text-gray-400">({product.reviews} đánh giá)</span>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{product.name}</h1>
              <div className="flex items-baseline gap-6">
                <p className="text-4xl font-black font-outfit tracking-tight">{product.price.toLocaleString('vi-VN')}đ</p>
                {product.oldPrice && (
                  <p className="text-xl text-gray-400 line-through italic font-medium opacity-50 underline decoration-red-500/20">{product.oldPrice.toLocaleString('vi-VN')}đ</p>
                )}
              </div>
              <p className="text-gray-500 font-medium leading-relaxed italic border-l-4 border-gray-100 pl-6 py-2">
                {product.description}
              </p>
            </div>

            <div className="space-y-10">
              {/* Size Selector */}
              <div className="space-y-5">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest italic">
                  <span>Chọn kích thước</span>
                  <button className="text-gray-400 hover:text-black underline decoration-2 underline-offset-4 decoration-gray-100 italic transition-all">Bảng quy đổi</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 border ${selectedSize === size ? 'bg-black text-white border-black shadow-xl shadow-black/10 scale-110' : 'bg-gray-50 border-gray-100 hover:border-black text-gray-400 hover:text-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="space-y-5">
                 <p className="text-xs font-black uppercase tracking-widest italic">Chọn màu sắc</p>
                 <div className="flex flex-wrap gap-4">
                  {product.colors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedColor === color ? 'bg-black text-white border-black shadow-xl' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-black'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and CTA */}
              <div className="space-y-8 pt-8">
                <div className="flex items-center gap-6">
                   <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 shadow-inner border border-gray-100">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-lg"
                      >
                         <Minus size={18} />
                      </button>
                      <span className="w-16 text-center font-black text-lg font-outfit">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-all font-bold text-lg"
                      >
                         <Plus size={18} />
                      </button>
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-grow btn bg-black text-white px-12 h-20 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-premium hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                  >
                    <ShoppingBag size={24} className="group-hover:translate-y-[-2px] transition-transform" />
                    {UI_TEXT.common.addToCart}
                  </button>
                  <button className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] hover:bg-red-50 hover:text-red-500 transition-all duration-500 shadow-sm active:scale-90 group">
                    <Heart size={28} className="group-hover:fill-red-500 transition-all" />
                  </button>
                  <button className="p-6 bg-gray-50 border border-gray-100 rounded-[2rem] hover:bg-blue-50 hover:text-blue-500 transition-all duration-500 shadow-sm active:scale-90">
                    <Share2 size={28} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 pt-12">
               <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <Truck size={24} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Giao hàng nhanh dự kiến 2-3 ngày</span>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <RotateCcw size={24} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Đổi trả miễn phí trong 30 ngày</span>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors group">
                  <ShieldCheck size={24} strokeWidth={1.5} className="text-gray-300 group-hover:text-black transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Sản phẩm chính hãng 100%</span>
               </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-40 space-y-20">
           <div className="flex items-center justify-between">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Có thể bạn sẽ thích</h3>
              <Link to="/products" className="text-xs font-black uppercase tracking-widest hover:tracking-[0.2em] transition-all border-b-2 border-black pb-1">Xem tất cả</Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
