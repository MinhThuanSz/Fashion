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

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

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

  React.useEffect(() => {
     if (activeTab === 'orders' || activeTab === 'overview') {
        fetchMyOrders();
     }
  }, [activeTab]);

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true)
      const { ordersApi } = await import('../services/api');
      const res = await ordersApi.getMyOrders();
      if (res.success) {
         setOrders(res.data)
      }
    } catch (error) {
       console.error('Fetch Orders Error:', error);
       toast.error('Không thể tải dữ liệu đơn hàng')
    } finally {
      setLoadingOrders(false)
    }
  }

  // --- LOGIC RANK ---
  const totalSpent = orders.reduce((acc, order) => acc + Number(order.total_amount || 0), 0);
  const levels = [
    { name: 'Đồng', threshold: 0, voucher: '0%', color: 'text-orange-900', bg: 'bg-orange-100' },
    { name: 'Bạc', threshold: 2000000, voucher: '1%', color: 'text-slate-400', bg: 'bg-slate-50' },
    { name: 'Vàng', threshold: 4000000, voucher: '3%', color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { name: 'Bạch Kim', threshold: 6000000, voucher: '5%', color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { name: 'Kim Cương', threshold: 8000000, voucher: '7%', color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Cao Thủ', threshold: 10000000, voucher: '10%', color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Thách Đấu', threshold: 12000000, voucher: '15%', color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  const currentLevel = [...levels].reverse().find(l => totalSpent >= l.threshold) || levels[0];
  const nextLevel = levels[levels.indexOf(currentLevel) + 1] || null;
  const progressToNext = nextLevel ? ((totalSpent - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100 : 100;
  const amountToNext = nextLevel ? (nextLevel.threshold - totalSpent) : 0;

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
                <div className="relative">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-black text-white flex items-center justify-center font-black text-4xl mx-auto shadow-2xl shadow-black/10 transition-transform group-hover:rotate-6">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-lg">
                     <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <div className="space-y-1">
                   <h2 className="text-2xl font-black uppercase tracking-wider truncate px-2 italic">{user?.email?.split('@')[0]}</h2>
                   <p className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full inline-block ${currentLevel.bg} ${currentLevel.color}`}>
                      HẠNG {currentLevel.name}
                   </p>
                </div>
                <button 
                  onClick={() => setSearchParams({ tab: 'settings' })}
                  className="w-full px-6 py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all rounded-2xl shadow-sm italic active:scale-95"
                >
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
                  </button>
                ))}
                <div className="h-px bg-gray-50 my-2 mx-6"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-4 text-red-100 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest italic rounded-2xl"
                >
                   <LogOut size={20} /> ĐĂNG XUẤT
                </button>
             </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-grow space-y-10 animate-fade-in delay-100">
             
             {activeTab === 'overview' && (
                <div className="space-y-10">
                   {/* Level Card */}
                   <div className="p-12 rounded-[4rem] bg-black text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                         <div className="space-y-8">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                                  <TrendingUp size={24} />
                               </div>
                               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50 italic">HỆ THỐNG THÀNH VIÊN</h3>
                            </div>
                            <div className="space-y-2">
                               <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">HẠNG {currentLevel.name}</h2>
                               <p className="text-gray-400 font-medium italic text-lg">
                                  {nextLevel ? `Bạn còn cách ${amountToNext.toLocaleString('vi-VN')}đ để lên hạng ${nextLevel.name.toUpperCase()}` : 'Bạn đã đạt cấp độ Thách Đấu cao nhất!'}
                               </p>
                            </div>
                            <button className="px-10 h-16 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-white/5 hover:scale-105 active:scale-95 transition-all">
                               NHẬN VOUCHER {currentLevel.voucher}
                            </button>
                         </div>
                         
                         <div className="relative w-44 h-44">
                            <svg className="w-full h-full rotate-[-90deg]">
                               <circle cx="88" cy="88" r="80" className="fill-none stroke-white/5 stroke-[12]" />
                               <motion.circle 
                                 cx="88" cy="88" r="80" 
                                 initial={{ pathLength: 0 }}
                                 animate={{ pathLength: Math.min(1, progressToNext / 100) }}
                                 transition={{ duration: 2, ease: "easeOut" }}
                                 className="fill-none stroke-white stroke-[12] stroke-linecap-round shadow-lg" 
                               />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                               <span className="text-5xl font-black font-outfit leading-none">{Math.floor(Math.min(100, progressToNext))}%</span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">TIẾN TRÌNH</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Stats */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center"><ShoppingBag size={22} /></div>
                         <div>
                            <h4 className="text-4xl font-black italic">{orders.length}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Đơn hàng đã đặt</p>
                         </div>
                      </div>
                      <div className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center"><CreditCard size={22} /></div>
                         <div>
                            <h4 className="text-4xl font-black italic">{totalSpent.toLocaleString('vi-VN')}đ</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tổng tích lũy chi tiêu</p>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'orders' && (
                <div className="space-y-10">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100 italic">
                      <div className="space-y-2">
                        <h2 className="text-5xl font-black uppercase tracking-tight skew-x-[-2deg]">LỊCH SỬ ĐƠN HÀNG</h2>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Theo dõi và quản lý mọi đơn giao hàng của bạn</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      {orders.map((order) => (
                        <div key={order.id} className="p-8 rounded-[3rem] bg-white border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-10 group overflow-hidden relative">
                           <div className="flex items-center gap-8 relative z-10">
                              <div className="w-16 h-16 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center group-hover:bg-black transition-all">
                                 {order.representativeImage ? (
                                    <img src={order.representativeImage} className="w-full h-full object-cover" alt="Order" />
                                 ) : (
                                    <Package size={28} className="text-gray-300 group-hover:text-white" />
                                 )}
                              </div>
                              <div className="space-y-1">
                                 <p className="text-2xl font-black font-outfit italic">#{order.id}</p>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                                    {new Date(order.createdAt || order.created_at).toLocaleDateString('vi-VN')} • {order.items?.length || 0} Sản phẩm
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-10 relative z-10">
                              <div className="text-right">
                                 <p className="text-2xl font-black font-outfit mb-1">{Number(order.total_amount).toLocaleString('vi-VN')}đ</p>
                                 <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusMap[order.order_status?.toUpperCase()]?.color || 'bg-gray-50'}`}>
                                    {statusMap[order.order_status?.toUpperCase()]?.label || order.order_status}
                                 </div>
                              </div>
                              <ChevronRight size={20} className="text-gray-300" />
                           </div>
                        </div>
                      ))}
                      {orders.length === 0 && !loadingOrders && (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border border-gray-100 italic font-black text-gray-400 uppercase tracking-widest text-xs">
                           Hiện tại bạn chưa có đơn hàng nào.
                        </div>
                      )}
                   </div>
                </div>
             )}

             {activeTab === 'settings' && (
                <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-sm space-y-10">
                   <div className="space-y-4">
                      <h2 className="text-5xl font-black uppercase tracking-tight italic skew-x-[-2deg]">THÔNG TIN CÁ NHÂN</h2>
                      <div className="w-16 h-2 bg-black/5"></div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <ProfileInput label="HỌ VÀ TÊN" value="Đông Triều" icon={<UserIcon size={16} />} />
                     <ProfileInput label="EMAIL" value={user?.email} icon={<Mail size={16} />} />
                     <ProfileInput label="SỐ ĐIỆN THOẠI" value="0987 654 321" icon={<Phone size={16} />} />
                     <ProfileInput label="THÀNH PHỐ" value="Hồ Chí Minh" icon={<MapPin size={16} />} />
                     <div className="md:col-span-2">
                        <ProfileInput label="ĐỊA CHỈ GIAO HÀNG" value="123 Fashion Street, Ward 10, District 1" />
                     </div>
                   </div>

                   <div className="pt-10">
                     <button className="btn bg-black text-white px-12 h-20 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all text-xs">
                        LƯU THAY ĐỔI
                     </button>
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
    <div className="space-y-4 group">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">{label}</label>
      <div className="relative">
         {icon && <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors">{icon}</div>}
         <input 
           className={`input ${icon ? 'pl-16' : 'px-6'} pr-6 bg-gray-50/50 border border-gray-100 rounded-2xl h-16 text-sm font-bold text-black focus:bg-white transition-all`} 
           defaultValue={value}
         />
      </div>
    </div>
  )
}

export default Profile
