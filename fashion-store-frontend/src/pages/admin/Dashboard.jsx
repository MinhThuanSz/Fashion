import React, { useEffect, useState } from 'react'
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Package, Clock,
  ChevronRight, Calendar, Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { adminApi } from '../../services/api'
import { UI_TEXT } from '../../constants/text'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts'

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)
  const [revenueDay, setRevenueDay] = useState([])
  const [revenueMonth, setRevenueMonth] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, dayRes, monthRes] = await Promise.all([
          adminApi.getSummary(),
          adminApi.getRevenueByDay(),
          adminApi.getRevenueByMonth()
        ])
        
        if (sumRes.success) setSummary(sumRes.data)
        if (dayRes.success) setRevenueDay(dayRes.data)
        if (monthRes.success) setRevenueMonth(monthRes.data)
      } catch (error) {
        console.error("Dashboard data fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-black animate-spin" />
        <p className="font-black uppercase tracking-widest text-sm italic">Synchronizing Data...</p>
      </div>
    )
  }

  const stats = [
    { label: UI_TEXT.admin.totalRevenue, value: `${(summary?.totalRevenue || 0).toLocaleString('vi-VN')}đ`, icon: <DollarSign size={24} />, color: 'bg-primary/10 text-primary' },
    { label: UI_TEXT.admin.totalOrders, value: summary?.totalOrders || 0, icon: <ShoppingBag size={24} />, color: 'bg-secondary/10 text-secondary' },
    { label: UI_TEXT.admin.totalCustomers, value: summary?.totalUsers || 0, icon: <Users size={24} />, color: 'bg-blue-50 text-blue-500' },
    { label: UI_TEXT.common.products, value: summary?.totalProducts || 0, icon: <TrendingUp size={24} />, color: 'bg-purple-50 text-purple-500' },
  ]

  const chartThemeColor = "#0ea5e9"; // Nova Blue

  return (
    <div className="space-y-10">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
             <h1 className="text-4xl font-black uppercase tracking-wider">{UI_TEXT.admin.dashboard}</h1>
             <p className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Today: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </p>
          </div>
          <button className="btn btn-primary px-10 h-16 rounded-2xl font-black text-lg shadow-xl shadow-black/10">
             {UI_TEXT.admin.downloadReport}
          </button>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: i * 0.1 }}
               className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6 hover:shadow-premium transition-all duration-500"
             >
                <div className="flex items-center justify-between">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color} shadow-inner`}>
                      {stat.icon}
                   </div>
                </div>
                <div className="space-y-1">
                   <h3 className="text-3xl font-black font-outfit">{stat.value}</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic leading-none">{stat.label}</p>
                </div>
             </motion.div>
          ))}
       </div>

       {/* Revenue Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase italic tracking-widest">Doanh thu theo ngày</h3>
                <span className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest">30 ngày qua</span>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={revenueDay}>
                      <defs>
                         <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartThemeColor} stopOpacity={0.1}/>
                            <stop offset="95%" stopColor={chartThemeColor} stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                         formatter={(value) => [`${value.toLocaleString()}đ`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke={chartThemeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase italic tracking-widest">Doanh thu theo tháng</h3>
                <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase tracking-widest">12 tháng qua</span>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={revenueMonth}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#ccc' }} />
                      <YAxis hide />
                      <Tooltip 
                         cursor={{fill: 'transparent'}}
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                         formatter={(value) => [`${value.toLocaleString()}đ`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" radius={[10, 10, 10, 10]} barSize={20}>
                         {revenueMonth.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === revenueMonth.length - 1 ? chartThemeColor : '#e5e7eb'} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row gap-10">
          {/* Recent Orders Card */}
          <div className="flex-1 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-10">
             <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
                      <Clock size={20} />
                   </div>
                   <h3 className="text-2xl font-black uppercase tracking-wider italic">{UI_TEXT.admin.recentTransactions}</h3>
                </div>
             </div>

             <div className="space-y-2">
                {summary?.recentOrders && summary.recentOrders.length > 0 ? summary.recentOrders.map((order, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                            <Package size={22} strokeWidth={1} />
                         </div>
                         <div className="space-y-1">
                            <h4 className="font-bold text-lg">{order.User?.full_name || 'Khách vãng lai'}</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic leading-none">ORDER ID: #{order.id}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <div className="text-right">
                              <p className="font-black text-xl">{Number(order.total_amount).toLocaleString('vi-VN')}đ</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic leading-none">{new Date(order.created_at).toLocaleDateString()}</p>
                         </div>
                         <div className="w-24 text-center">
                            <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                               order.order_status === 'Success' ? 'bg-green-50 text-green-500 border-green-100' :
                               order.order_status === 'Pending' ? 'bg-yellow-50 text-yellow-500 border-yellow-100' :
                               'bg-blue-50 text-blue-500 border-blue-100'
                            }`}>
                               {order.order_status}
                            </span>
                         </div>
                      </div>
                  </div>
                )) : (
                   <div className="py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Không có đơn hàng gần đây</div>
                )}
             </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:w-[350px] space-y-6">
              <div className="bg-black rounded-[3rem] p-10 text-white space-y-8 shadow-2xl">
                 <h3 className="text-xl font-black uppercase italic tracking-widest">{UI_TEXT.admin.inventoryHealth}</h3>
                 <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Mức tồn kho</p>
                       <p className="text-xl font-black">92% Khỏe mạnh</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                       <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Sắp hết hàng</p>
                       <p className="text-xl font-black">12 Skus</p>
                    </div>
                 </div>
                 <button className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Danh sách nhập hàng</button>
              </div>
          </div>
       </div>
    </div>
  )
}

export default DashboardAdmin
