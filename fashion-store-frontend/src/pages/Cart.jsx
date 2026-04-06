import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, Minus, Plus, Truck, Info, ChevronRight } from 'lucide-react'
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice'
import { UI_TEXT } from '../constants/text'
import toast from 'react-hot-toast'

const Cart = () => {
  const { items: cartItems } = useSelector(state => state.cart)
  const dispatch = useDispatch()

  const subtotal = cartItems.reduce((acc, item) => acc + ((item.unit_price || item.price) * item.quantity), 0)
  const shipping = subtotal > 1000000 ? 0 : 35000
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const handleUpdateQuantity = (id, color, size, delta) => {
    const item = cartItems.find(i => i.id === id && i.color === color && i.size === size)
    if (item.quantity + delta >= 1) {
      dispatch(updateQuantity({ id, color, size, quantity: item.quantity + delta }))
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-32 min-h-screen container-custom flex flex-col items-center justify-center animate-fade-in text-center px-6">
        <div className="relative mb-20 group">
          <div className="absolute inset-0 bg-gray-50 rounded-full scale-110 group-hover:scale-125 transition-transform duration-1000 animate-pulse"></div>
          <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-premium border border-gray-100 group-hover:rotate-12 transition-transform duration-700">
             <ShoppingBag size={80} strokeWidth={1} className="text-gray-200" />
          </div>
        </div>
        <div className="max-w-xl space-y-6">
           <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">{UI_TEXT.cart.emptyTitle}</h2>
           <p className="text-gray-400 font-medium italic mb-10 leading-relaxed uppercase tracking-widest text-xs">
              {UI_TEXT.cart.emptySub}
           </p>
           <Link 
            to="/products" 
            className="btn bg-black text-white px-16 h-20 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all text-sm mx-auto"
           >
             {UI_TEXT.cart.startShopping} <ArrowRight size={20} />
           </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-32 pb-32 min-h-screen">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Cart Items List */}
          <div className="flex-grow space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-12 gap-8">
               <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{UI_TEXT.cart.title}</h1>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] italic">{cartItems.length} Sản phẩm cao cấp</p>
               </div>
               <button 
                onClick={() => { dispatch(clearCart()); toast.success('Đã xóa tất cả sản phẩm!'); }}
                className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-all flex items-center gap-2 italic hover:translate-x-1"
               >
                 <Trash2 size={12} /> {UI_TEXT.cart.clearBag}
               </button>
            </div>

            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="group relative flex flex-col md:flex-row gap-8 p-8 rounded-[3rem] bg-white border border-gray-50 hover:border-gray-100 hover:shadow-premium transition-all duration-700">
                  <Link to={`/products/${item.id}`} className="w-full md:w-40 aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden bg-gray-50 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>

                  <div className="flex-grow flex flex-col justify-between py-2 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-bold text-2xl group-hover:text-black transition-colors">{item.name}</h3>
                        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                           <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">{item.size}</span>
                           <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">{item.color}</span>
                        </div>
                      </div>
                      <p className="font-black text-2xl">{(item.unit_price || item.price).toLocaleString('vi-VN')}đ</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                      <div className="flex items-center bg-gray-50 rounded-2xl p-1 shadow-inner group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100">
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.color, item.size, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100/50 rounded-xl transition-all"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.id, item.color, item.size, 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-100/50 rounded-xl transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => { dispatch(removeFromCart({ id: item.id, color: item.color, size: item.size })); toast.success('Đã xóa sản phẩm!'); }}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-500"
                      >
                         <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/products" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all group overflow-hidden border-b-2 border-transparent hover:border-black pb-2 italic">
               <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
               Tiếp tục mua sắm
            </Link>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-96 shrink-0 h-fit space-y-10 animate-fade-in">
            <div className="p-10 rounded-[4rem] bg-black text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10"></div>
               <div className="relative z-10 space-y-10">
                  <div className="space-y-4">
                     <h2 className="text-3xl font-black uppercase tracking-widest italic">{UI_TEXT.cart.summary}</h2>
                     <div className="w-12 h-1 bg-white/20"></div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 italic">
                      <span>{UI_TEXT.cart.subtotal}</span>
                      <span className="text-white not-italic">{subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 italic">
                       <span>{UI_TEXT.cart.shipping}</span>
                       <span className={shipping === 0 ? "text-green-400 font-black not-italic" : "text-white not-italic"}>
                         {shipping === 0 ? UI_TEXT.cart.free : `${shipping.toLocaleString('vi-VN')}đ`}
                       </span>
                    </div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 italic">
                       <span>{UI_TEXT.cart.tax}</span>
                       <span className="text-white not-italic">{tax.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                       <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-end gap-2 group-hover:text-white transition-colors duration-[1.5s]">
                         <ShoppingBag size={14} className="mb-0.5" /> {UI_TEXT.cart.total}
                       </span>
                       <span className="text-4xl font-black font-outfit leading-none">{total.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  <Link 
                    to="/checkout" 
                    className="btn bg-white text-black px-8 h-20 rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all text-sm group"
                  >
                    {UI_TEXT.cart.proceed} <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </div>

            {/* Guarantees */}
            <div className="p-8 rounded-[3rem] bg-gray-50 border border-gray-100 space-y-6">
               <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic group">
                  <Truck size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                   {UI_TEXT.cart.guarantee}
               </div>
               <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest italic group border-t border-gray-100 pt-6">
                  <Info size={20} className="text-gray-300 group-hover:text-black transition-colors" />
                  Chính sách đổi trả bảo mật trong 30 ngày
               </div>
               <div className="pt-4 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic mb-2">Thanh toán an toàn:</p>
                  <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" alt="Mastercard" />
                    <img src="https://pc.momo.vn/static/images/momo-logo.png" className="h-4" alt="MoMo" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
