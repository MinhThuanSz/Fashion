import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, Heart } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import toast from 'react-hot-toast'
import { UI_TEXT } from '../../constants/text'

const ProductCard = ({ product, isLoading = false }) => {
  const dispatch = useDispatch()

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="aspect-[4/5] bg-gray-100 rounded-[2.5rem]"></div>
        <div className="space-y-3 px-2">
           <div className="h-2 w-16 bg-gray-100 rounded"></div>
           <div className="h-6 w-full bg-gray-100 rounded-lg"></div>
           <div className="h-8 w-1/3 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    )
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || 'Default',
      quantity: 1
    }))
    toast.success(`${product.name} đã được thêm!`, {
        icon: '🛍️',
        style: {
            borderRadius: '1.5rem',
            background: '#000',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
        }
    })
  }

  return (
    <Link to={`/products/${product.id}`} className="group relative">
      <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100/50 shadow-sm transition-all duration-700 hover:shadow-premium group">
         <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
         />
         
         {/* Badges */}
         <div className="absolute top-6 left-6 flex flex-col gap-3">
             {product.isNew && (
               <span className="bg-black text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg backdrop-blur-md bg-black/80 tracking-widest italic uppercase">MỚI</span>
             )}
             {product.oldPrice && (
                <span className="bg-red-500 text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg tracking-widest italic uppercase">GIẢM GIÁ</span>
             )}
         </div>

         {/* Quick Actions (Hover Only) */}
         <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
            <button className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-110 hover:rotate-12">
               <Heart size={20} className="transition-transform group-hover:scale-110" />
            </button>
         </div>

         {/* Add to Cart Overlay */}
         <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-10">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-white/95 backdrop-blur-md text-black py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 border border-gray-100 group/btn"
            >
               <ShoppingBag size={18} className="group-hover/btn:translate-y-[-2px] transition-transform" /> {UI_TEXT.common.addToCart}
            </button>
         </div>

         {/* Subtle Gradient */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-1000"></div>
      </div>

      <div className="mt-8 px-2 space-y-3">
         <div className="flex items-center justify-between">
           <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic">{product.brand}</span>
           <div className="flex items-center gap-1.5 bg-gray-50/50 px-2.5 py-1 rounded-xl border border-gray-100/50 shadow-inner group-hover:bg-white transition-colors">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-black italic">{product.ratings}</span>
           </div>
         </div>
         <h3 className="font-black text-black group-hover:text-primary transition-all line-clamp-1 text-base md:text-lg italic uppercase tracking-tight skew-x-[-1deg]">{product.name}</h3>
         <div className="flex items-baseline gap-3 pt-1">
           <p className="font-black text-2xl font-outfit italic tracking-tighter">{product.price.toLocaleString('vi-VN')}đ</p>
           {product.oldPrice && (
             <p className="text-xs text-gray-400 line-through font-bold italic opacity-50 underline decoration-red-500/10">
               {product.oldPrice.toLocaleString('vi-VN')}đ
             </p>
           )}
         </div>
      </div>
    </Link>
  )
}

export default ProductCard
