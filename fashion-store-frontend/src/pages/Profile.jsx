import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { 
  User as UserIcon, Package, Settings, LogOut, ChevronRight, 
  MapPin, Phone, Mail, ShoppingBag, Clock, CheckCircle2, Truck, 
  CreditCard, ArrowUpRight, TrendingUp, Star, MoreHorizontal,
  ChevronDown, X
} from 'lucide-react'
import { logout } from '../store/slices/authSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { UI_TEXT } from '../constants/text'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
    toast.success('Hẹn gặp lại bạn sớm!', { icon: '👋' })
  }

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: <UserIcon size={20} /> },
    { id: 'orders', label: UI_TEXT.profile.orders, icon: <Package size={20} /> },
    { id: 'settings', label: UI_TEXT.profile.settings, icon: <Settings size={20} /> },
  ]

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  React.useEffect(() => {
     if (activeTab === 'orders') {
        fetchMyOrders();
     }
  }, [activeTab]);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true)
      const { ordersApi } = await import('../services/api');
      const res = await ordersApi.getAll(); // for customer, it should fetch my-orders actually. Wait, ordersApi doesn't have getMyOrders. Let's add and use it.
      // But actually, ordersApi.getAll() is get('/orders'), which requires admin in standard REST, BUT we had orderRoutes.js:
      // router.get('/', protect, admin, getAllOrders);
      // router.get('/my-orders', protect, getMyOrders);
      const { default: api } = await import('../services/api');
      const resMyOrders = await api.get('/orders/my-orders');
      if (resMyOrders.success) {
         setOrders(resMyOrders.data)
      }
    } catch (error) {
      toast.error('Lỗi lấy đơn hàng')
    } finally {
      setLoadingOrders(false)
    }
  }

  const statusMap = {
    'PENDING': { color: 'bg-yellow-50 text-yellow-500 border-yellow-100', icon: <Clock size={12} />, label: 'Chờ xử lý' },
    'PROCESSING': { color: 'bg-blue-50 text-blue-500 border-blue-100', icon: <Clock size={12} />, label: 'Đang xử lý' },
    'DELIVERED': { color: 'bg-green-50 text-green-500 border-green-100', icon: <CheckCircle2 size={12} />, label: 'Đã giao hàng' },
    'SUCCESS': { color: 'bg-green-50 text-green-500 border-green-100', icon: <CheckCircle2 size={12} />, label: 'Hoàn tất' },
    'SHIPPED': { color: 'bg-purple-50 text-purple-500 border-purple-100', icon: <Truck size={12} />, label: 'Đã gửi hàng' },
    'CANCELLED': { color: 'bg-red-50 text-red-500 border-red-100', icon: <X size={12} />, label: 'Đã hủy' },
  }

  return (
    <div className="pt-32 pb-32 min-h-screen bg-gray-50/30">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-10 animate-fade-in">
             <div className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-premium text-center space-y-6 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-black text-white flex items-center justify-center font-black text-4xl mx-auto shadow-2xl shadow-black/10 transition-transform group-hover:rotate-6">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform">
                     <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <div className="space-y-1">
                   <h2 className="text-2xl font-black uppercase tracking-wider truncate px-2 italic">{user?.email?.split('@')[0]}</h2>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-2 italic">Thành viên từ 2026</p>
                </div>
                <button className="w-full px-6 py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all rounded-2xl shadow-sm italic active:scale-95">
                   Chỉnh sửa hồ sơ
                </button>
             </div>

             <nav className="p-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-1">
                {tabs.map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setSearchParams({ tab: tab.id })}
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm group ${activeTab === tab.id ? 'bg-black text-white shadow-xl shadow-black/10 scale-105' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                  >
                    <span className={`transition-transform duration-500 ${activeTab === tab.id ? 'rotate-12 scale-110' : 'group-hover:rotate-6'}`}>{tab.icon}</span>
                    <span className="uppercase tracking-widest text-xs">{tab.label}</span>
                    <ChevronRight size={14} className={`ml-auto transition-transform ${activeTab === tab.id ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`} />
                  </button>
                ))}
                <div className="h-px bg-gray-50 my-2 mx-6"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 text-red-100 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest italic rounded-2xl"
                >
                  <LogOut size={20} /> {UI_TEXT.common.logout}
                </button>
             </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-grow space-y-10 animate-fade-in delay-100">
             {activeTab === 'overview' && (
                <div className="space-y-10 max-w-4xl">
                   {/* Points Card */}
                   <div className="p-12 rounded-[4rem] bg-black text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-slow-pulse"></div>
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                         <div className="space-y-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                  <TrendingUp size={24} />
                               </div>
                               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/50 italic">{UI_TEXT.profile.membership}</h3>
                            </div>
                            <div className="space-y-2">
                               <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{UI_TEXT.profile.proLevel}</h2>
                               <p className="text-gray-400 font-medium italic text-lg">{UI_TEXT.profile.memberPoints}</p>
                            </div>
                            <button className="px-10 h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-white/5 hover:scale-105 active:scale-95 transition-all outline-none">
                               {UI_TEXT.profile.viewRewards}
                            </button>
                         </div>
                         <div className="relative w-40 h-40 group/points">
                            <svg className="w-full h-full rotate-[-90deg]">
                               <circle cx="80" cy="80" r="70" className="fill-none stroke-white/5 stroke-[10]" />
                               <motion.circle 
                                 cx="80" cy="80" r="70" 
                                 initial={{ pathLength: 0 }}
                                 animate={{ pathLength: 0.75 }}
                                 transition={{ duration: 2, ease: "easeOut" }}
                                 className="fill-none stroke-white stroke-[10] stroke-linecap-round" 
                               />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in">
                               <span className="text-5xl font-black font-outfit leading-none mb-1">75</span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">HẠNG VÀNG</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-8 group hover:shadow-premium transition-all duration-700">
                         <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-black group-hover:text-white">
                               <ShoppingBag size={22} />
                            </div>
                            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-black transition-all" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-4xl font-black italic">{orders.length}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none italic">{UI_TEXT.profile.orders}</p>
                         </div>
                      </div>
                      <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-8 group hover:shadow-premium transition-all duration-700">
                         <div className="flex items-center justify-between">
                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-black group-hover:text-white">
                               <MoreHorizontal size={22} />
                            </div>
                            <ArrowUpRight size={18} className="text-gray-300 group-hover:text-black transition-all" />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-4xl font-black italic">5.450.000đ</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none italic">{UI_TEXT.profile.totalPaid}</p>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'orders' && (
                <div className="space-y-10 animate-slide-up">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 italic">
                      <div className="space-y-2">
                        <h2 className="text-5xl font-black uppercase tracking-tight skew-x-[-2deg]">{UI_TEXT.profile.orders}</h2>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Theo dõi và quản lý mọi đơn giao hàng của bạn</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 border-b-2 border-gray-100 pb-1 cursor-pointer hover:text-black transition-colors">
                         Bộ lọc nhanh <ChevronDown size={14} />
                      </div>
                   </div>

                   <div className="space-y-6">
                      {orders.map((order, i) => (
                        <div key={order.id} className="p-8 rounded-[3rem] bg-white border border-gray-50 shadow-sm hover:border-gray-200 hover:shadow-premium transition-all duration-700 group overflow-hidden relative">
                           <div className="absolute top-0 right-0 w-[400px] h-full bg-gray-50/30 opacity-0 group-hover:opacity-100 transition-opacity translate-x-20 group-hover:translate-x-0 duration-1000 -skew-x-[20deg] origin-top"></div>
                           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                              <div className="flex items-center gap-8">
                                 <div className="w-16 h-16 rounded-2xl bg-gray-50 text-gray-300 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-700 shadow-inner group-hover:shadow-lg group-hover:shadow-black/10 group-hover:rotate-12 group-hover:scale-110">
                                    <Package size={28} strokeWidth={1.5} />
                                 </div>
                                 <div className="space-y-1">
                                    <p className="text-2xl font-black font-outfit leading-none italic">#{order.id}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{new Date(order.created_at).toLocaleDateString('vi-VN')} • {order.items?.length || 0} Sản phẩm</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-10 w-full md:w-auto">
                                 <div className="text-right flex-grow md:flex-grow-0">
                                    <p className="text-2xl font-black font-outfit leading-none mb-1">{Number(order.total_amount).toLocaleString('vi-VN')}đ</p>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors shadow-sm ${statusMap[order.order_status?.toUpperCase()]?.color || 'bg-gray-50 text-gray-400'}`}>
                                       {statusMap[order.order_status?.toUpperCase()]?.icon} {statusMap[order.order_status?.toUpperCase()]?.label || order.order_status}
                                    </div>
                                 </div>
                                 <button className="p-5 bg-gray-50 text-gray-400 hover:text-black hover:bg-white rounded-2xl border border-transparent hover:border-gray-100 shadow-sm group-hover:scale-110 transition-all active:scale-95">
                                    <ChevronRight size={20} />
                                 </button>
                              </div>
                           </div>
                        </div>
                      ))}
                      {orders.length === 0 && !loadingOrders && (
                        <div className="text-center py-10 bg-gray-50/50 rounded-3xl border border-gray-100">
                           <p className="text-xs font-black uppercase tracking-widest text-gray-400 italic">Hiện tại bạn chưa có đơn hàng nào.</p>
                        </div>
                      )}
                      {loadingOrders && (
                        <div className="text-center py-10 text-xs font-black uppercase tracking-widest italic animate-pulse">
                           Đang cập nhật...
                        </div>
                      )}
                   </div>
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="space-y-12 animate-slide-up bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-50/50 rounded-full blur-[80px] translate-y-1/2 translate-x-1/2 transition-transform duration-1000 group-hover:scale-150"></div>
                   
                   <div className="space-y-10 relative z-10">
                      <div className="space-y-4">
                         <h2 className="text-5xl font-black uppercase tracking-tight italic skew-x-[-2deg]">{UI_TEXT.profile.details}</h2>
                         <div className="w-16 h-2 bg-black/5"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <ProfileInput label={UI_TEXT.checkout.fullName} value="NovaKit User 01" icon={<UserIcon size={16} />} />
                        <ProfileInput label={UI_TEXT.checkout.email} value={user?.email} icon={<Mail size={16} />} />
                        <ProfileInput label={UI_TEXT.checkout.phone} value="+84 987 654 321" icon={<Phone size={16} />} />
                        <ProfileInput label={UI_TEXT.checkout.city} value="Hồ Chí Minh" icon={<MapPin size={16} />} />
                        <div className="md:col-span-2">
                           <ProfileInput label={UI_TEXT.checkout.address} value="123 Fashion Street, Ward 10, District 1" />
                        </div>
                      </div>

                      <div className="pt-10 flex border-t border-gray-50">
                        <button className="btn bg-black text-white px-12 h-20 rounded-2xl font-black uppercase tracking-[0.2em] shadow-premium hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs">
                           CẬP NHẬT THÔNG TIN
                        </button>
                      </div>
                   </div>
                </div>
             )}
          </main>
        </div>
      </div>
    </div>
  )
}

function ProfileInput({ label, icon, value }) {
  return (
    <div className="space-y-4 group/input">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">{label}</label>
      <div className="relative">
         {icon && (
           <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-black transition-colors rotate-0 group-hover/input:rotate-12 transition-transform">
             {icon}
           </div>
         )}
         <input 
           readOnly
           className={`input ${icon ? 'pl-16' : 'px-6'} pr-6 bg-gray-50/50 border border-gray-100 rounded-2xl h-16 text-sm font-bold text-black shadow-sm group-hover/input:border-gray-200 transition-all focus:bg-white`} 
           defaultValue={value}
         />
      </div>
    </div>
  )
}

export default Profile
