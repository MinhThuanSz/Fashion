import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ChevronLeft, Info, Truck, ShieldCheck, CheckCircle2, 
  ChevronRight, MapPin, CreditCard, ShoppingBag, Banknote, 
  Lock, ArrowRight, User, Mail, Phone
} from 'lucide-react'
import { clearCart } from '../store/slices/cartSlice'
import { UI_TEXT } from '../constants/text'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const Checkout = () => {
  const { items: cartItems } = useSelector(state => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const shipping = subtotal > 1000000 ? 0 : 35000
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const [loading, setLoading] = useState(false)
  const [isOrdered, setIsOrdered] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [formData, setFormData] = useState({
     receiver_name: '',
     phone: '',
     city: '',
     shipping_address: '',
  })

  const handleChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống!')
      return;
    }
    if (!formData.receiver_name.trim()) {
      toast.error('Vui lòng nhập họ tên người nhận!')
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Vui lòng nhập số điện thoại!')
      return;
    }
    if (!formData.shipping_address.trim()) {
      toast.error('Vui lòng nhập địa chỉ giao hàng!')
      return;
    }

    setLoading(true)
    try {
      const payload = {
        receiver_name:    formData.receiver_name.trim(),
        phone:            formData.phone.trim(),
        shipping_address: `${formData.shipping_address.trim()}${formData.city ? `, ${formData.city.trim()}` : ''}`,
        payment_method:   paymentMethod.toUpperCase(),
        // Send both product_id and variantId so backend can do smart lookup
        items: cartItems.map(item => ({
          product_variant_id: item.variantId || null,  // real variant ID if stored
          product_id:         item.id,                 // product ID as fallback
          quantity:           item.quantity,
          unit_price:         item.price,
          subtotal:           item.price * item.quantity
        }))
      }

      const { ordersApi } = await import('../services/api')
      await ordersApi.create(payload)

      setIsOrdered(true)
      dispatch(clearCart())
      toast.success('ĐẶT HÀNG THÀNH CÔNG! Cảm ơn quý khách.', { duration: 5000, icon: '🎉' })
    } catch (error) {
      console.error('Checkout Error:', error)
      const apiMsg = error.response?.data?.message || error.response?.data?.error

      // Show friendly Vietnamese message — strip any raw technical IDs
      if (apiMsg) {
        // If the message contains raw variant IDs, replace with friendly version
        const friendlyMsg = apiMsg.includes('Variant ID')
          ? 'Một sản phẩm trong giỏ hàng hiện không còn khả dụng. Vui lòng kiểm tra lại giỏ hàng.'
          : apiMsg
        toast.error(friendlyMsg, { duration: 6000 })
      } else {
        toast.error(
          'Đặt hàng không thành công. Một hoặc nhiều sản phẩm có thể không còn trong kho.',
          { duration: 6000 }
        )
      }
    } finally {
      setLoading(false)
    }
  }


  if (isOrdered) {
    return (
       <div className="pt-32 pb-32 min-h-screen container-custom flex flex-col items-center justify-center text-center animate-fade-in px-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center text-white mb-10 shadow-2xl shadow-green-500/20"
          >
             <CheckCircle2 size={64} />
          </motion.div>
          <div className="max-w-xl space-y-6">
             <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">{UI_TEXT.checkout.successTitle}</h2>
             <p className="text-gray-400 font-medium italic mb-10 leading-relaxed uppercase tracking-widest text-xs">
                {UI_TEXT.checkout.successSub}
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/profile" className="btn bg-black text-white px-12 h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all text-[10px]">
                   {UI_TEXT.checkout.trackOrder} <ArrowRight size={16} />
                </Link>
                <Link to="/" className="btn border-2 border-black px-12 h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-4 hover:bg-black hover:text-white transition-all text-[10px]">
                   VỀ TRANG CHỦ
                </Link>
             </div>
          </div>
       </div>
    )
  }
  if (cartItems.length === 0 && !isOrdered) {
    return (
       <div className="pt-32 pb-32 min-h-screen container-custom flex flex-col items-center justify-center text-center animate-fade-in px-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-32 h-32 bg-gray-50 border-2 border-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-10 shadow-inner mx-auto"
          >
             <ShoppingBag size={48} />
          </motion.div>
          <div className="max-w-xl space-y-6 mx-auto">
             <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">GIỎ HÀNG TRỐNG</h2>
             <p className="text-gray-400 font-medium italic mb-10 leading-relaxed uppercase tracking-widest text-xs">
                Giỏ hàng của bạn đang trống. Hãy quay lại cửa hàng và chọn cho mình những món đồ ưng ý nhé!
             </p>
             <div className="flex justify-center">
                <Link to="/products" className="btn bg-black text-white px-12 h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all text-[10px]">
                   <ChevronLeft size={16} /> QUAY LẠI MUA SẮM
                </Link>
             </div>
          </div>
       </div>
    )
  }

  return (
    <div className="pt-32 pb-32 min-h-screen">
      <div className="container-custom">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-12 gap-10">
           <div className="space-y-6">
              <Link to="/cart" className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic hover:text-black transition-all">
                 <ChevronLeft size={14} /> QUAY LẠI GIỎ HÀNG
              </Link>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{UI_TEXT.checkout.title}</h1>
              <p className="text-gray-400 text-xs font-black uppercase tracking-[0.4em] italic">Bạn đang thanh toán cho {cartItems.length} Sản phẩm cao cấp</p>
           </div>
           <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic group">
              <Lock size={16} className="group-hover:text-black transition-colors" />
              {UI_TEXT.checkout.secureInfo}
           </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-20">
          <div className="flex-grow space-y-16">
            {/* Shipping Details */}
            <div className="space-y-10 animate-slide-up">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg shadow-black/10">
                     <MapPin size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-wider italic">{UI_TEXT.checkout.shippingInfo}</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-50 shadow-inner group">
                  <Input name="receiver_name" value={formData.receiver_name} onChange={handleChange} label={UI_TEXT.checkout.fullName} placeholder="e.g. Nguyễn Văn A" icon={<User size={18} />} required />
                  <Input name="email" value={formData.email || ''} onChange={handleChange} label={UI_TEXT.checkout.email} type="email" placeholder="e.g. name@domain.com" icon={<Mail size={18} />} required />
                  <Input name="phone" value={formData.phone} onChange={handleChange} label={UI_TEXT.checkout.phone} type="tel" placeholder="e.g. 0981234xxx" icon={<Phone size={18} />} required />
                  <Input name="city" value={formData.city} onChange={handleChange} label={UI_TEXT.checkout.city} placeholder="e.g. Hà Nội" icon={<MapPin size={18} />} />
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">{UI_TEXT.checkout.address}</label>
                     <textarea name="shipping_address" value={formData.shipping_address} onChange={handleChange} rows="4" className="input bg-white group-hover:bg-white transition-all text-xs font-bold leading-relaxed resize-none focus:ring-2 focus:ring-black/10 w-full rounded-2xl p-6" required></textarea>
                  </div>
               </div>
            </div>

            {/* Payment Selection */}
            <div className="space-y-10 animate-slide-up delay-100">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg shadow-black/10">
                     <CreditCard size={24} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-wider italic">{UI_TEXT.checkout.paymentMethod}</h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <PaymentOption 
                   selected={paymentMethod === 'cod'}
                   onClick={() => setPaymentMethod('cod')}
                   title={UI_TEXT.checkout.cod}
                   desc={UI_TEXT.checkout.codSub}
                   icon={<Banknote size={24} />}
                 />
                 <PaymentOption 
                   selected={paymentMethod === 'card'}
                   onClick={() => setPaymentMethod('card')}
                   title={UI_TEXT.checkout.card}
                   desc={UI_TEXT.checkout.cardSub}
                   icon={<CreditCard size={24} />}
                   disabled={true}
                 />
               </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-96 shrink-0 h-fit space-y-10 animate-fade-in delay-200">
            <div className="p-10 rounded-[4rem] bg-black text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-10"></div>
               <div className="relative z-10 space-y-10">
                  <div className="space-y-4">
                     <h2 className="text-3xl font-black uppercase tracking-widest italic">{UI_TEXT.checkout.reviewOrder}</h2>
                     <div className="w-12 h-1 bg-white/20"></div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="max-h-60 overflow-y-auto pr-4 space-y-6 scrollbar-thin">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4">
                         <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-grow space-y-1 overflow-hidden">
                            <p className="font-bold text-xs truncate text-white uppercase tracking-widest">{item.name}</p>
                            <p className="text-[9px] font-black text-gray-400 tracking-tighter italic uppercase">{item.quantity} x {item.price.toLocaleString('vi-VN')}đ • {item.size}</p>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-5 pt-8 border-t border-white/10">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                      <span>{UI_TEXT.cart.subtotal}</span>
                      <span className="text-white not-italic font-bold">{subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                       <span>{UI_TEXT.cart.shipping}</span>
                       <span className="text-white not-italic font-black text-green-400">{shipping === 0 ? UI_TEXT.cart.free : `${shipping.toLocaleString('vi-VN')}đ`}</span>
                    </div>
                    <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                       <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">{UI_TEXT.cart.total}</span>
                       <span className="text-4xl font-black font-outfit leading-none">{total.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="btn bg-white text-black px-8 h-24 rounded-[3rem] font-black uppercase tracking-[0.2em] shadow-2xl flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 transition-all w-full group"
                  >
                    <span className="text-sm">{UI_TEXT.checkout.placeOrder}</span>
                    <span className="text-[9px] font-bold text-gray-400 group-hover:text-black transition-colors">YÊU CẦU THEO DÕI ĐƠN HÀNG NGAY</span>
                  </button>
               </div>
            </div>

            {/* Extra Info */}
            <div className="p-8 rounded-[3rem] bg-gray-50 border border-gray-100 flex items-center gap-6 group hover:bg-gray-100 transition-colors">
               <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform">
                  <ShieldCheck size={28} className="text-gray-300 group-hover:text-black transition-colors" />
               </div>
               <div className="flex-grow">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Mã hóa an toàn</h4>
                  <p className="text-[10px] text-gray-400 font-bold leading-relaxed italic uppercase">Mọi thông tin cá nhân đều bảo mật cao.</p>
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function Input({ label, icon, ...props }) {
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 italic">{label}</label>
      <div className="relative">
         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors">
            {icon}
         </div>
         <input 
           className="input pl-16 pr-6 bg-white border-transparent shadow-sm group-hover:border-gray-100 focus:bg-white focus:border-black transition-all font-bold text-xs h-16 rounded-2xl" 
           {...props} 
         />
      </div>
    </div>
  )
}

function PaymentOption({ title, desc, icon, selected, onClick, disabled }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-10 rounded-[3rem] border flex flex-col items-center gap-6 transition-all duration-500 group relative overflow-hidden ${selected ? 'bg-black text-white border-black shadow-2xl scale-[1.02]' : 'bg-white border-gray-100 hover:border-black text-gray-400'} ${disabled ? 'opacity-40 cursor-not-allowed border-gray-50' : ''}`}
    >
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-premium transition-transform duration-700 ${selected ? 'bg-white/10 text-white rotate-12 scale-110' : 'bg-gray-50 text-gray-200'}`}>
         {icon}
      </div>
      <div className="text-center space-y-2">
         <h4 className="text-sm font-black uppercase tracking-widest">{title}</h4>
         <p className="text-[10px] font-bold italic tracking-widest uppercase opacity-60 leading-none">{desc}</p>
      </div>
      {selected && (
        <div className="absolute top-4 right-4 text-green-400 animate-fade-in group-hover:scale-125 transition-transform duration-500">
           <CheckCircle2 size={24} />
        </div>
      )}
    </button>
  )
}

export default Checkout
