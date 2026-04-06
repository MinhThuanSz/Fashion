import React, { useEffect, useState } from 'react'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import { 
  Calendar, Download, Filter, TrendingUp, DollarSign, 
  ShoppingCart, Loader2, RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { adminApi, ordersApi } from '../../services/api'

const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const RevenueAnalytics = () => {
  const [loading, setLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState('month') // day, week, month, year
  const [revenueData, setRevenueData] = useState([])
  const [summary, setSummary] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [categoryRevenue, setCategoryRevenue] = useState([])

  useEffect(() => {
    fetchAnalytics()
  }, [filterPeriod])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [summaryRes, revenueRes] = await Promise.all([
        adminApi.getSummary(),
        filterPeriod === 'month' ? adminApi.getRevenueByMonth() : adminApi.getRevenueByDay()
      ])

      if (summaryRes.success) setSummary(summaryRes.data)
      if (revenueRes.success) setRevenueData(revenueRes.data)
      
      // Generate mock category data
      generateCategoryData()
    } catch (error) {
      toast.error('Lỗi tải dữ liệu phân tích doanh số')
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateCategoryData = () => {
    const categories = [
      { name: 'Giày Thể Thao', value: 45000000, percentage: 35 },
      { name: 'Giày Casual', value: 32000000, percentage: 25 },
      { name: 'Giày Formal', value: 28000000, percentage: 22 },
      { name: 'Giày Khác', value: 14000000, percentage: 11 },
      { name: 'Phụ Kiện', value: 10000000, percentage: 7 }
    ]
    setCategoryRevenue(categories)
  }

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-blue-500 animate-spin" />
        <p className="font-bold text-gray-600">Đang tải dữ liệu phân tích...</p>
      </div>
    )
  }

  const totalRevenue = summary?.totalRevenue || 0
  const totalOrders = summary?.totalOrders || 0
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase tracking-wider">Phân Tích Doanh Số</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} /> Chi tiết doanh thu theo thời gian
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchAnalytics}
            className="btn btn-outline flex items-center gap-2 px-6 h-14 rounded-2xl font-bold"
          >
            <RefreshCw size={18} /> Làm mới
          </button>
          <button className="btn btn-primary flex items-center gap-2 px-6 h-14 rounded-2xl font-bold">
            <Download size={18} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Filter Period */}
      <div className="flex gap-2 bg-white p-4 rounded-2xl border border-gray-100">
        {['day', 'week', 'month', 'year'].map(period => (
          <button
            key={period}
            onClick={() => setFilterPeriod(period)}
            className={`px-6 py-2 rounded-xl font-bold text-sm uppercase transition-all ${
              filterPeriod === period
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {period === 'day' && 'Ngày'}
            {period === 'week' && 'Tuần'}
            {period === 'month' && 'Tháng'}
            {period === 'year' && 'Năm'}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl border border-blue-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-900">Tổng Doanh Thu</h3>
            <DollarSign size={24} className="text-blue-600" />
          </div>
          <p className="text-3xl font-black text-blue-900">
            {(totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-blue-700 mt-2">Đ</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl border border-green-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-green-900">Tổng Đơn Hàng</h3>
            <ShoppingCart size={24} className="text-green-600" />
          </div>
          <p className="text-3xl font-black text-green-900">{totalOrders}</p>
          <p className="text-xs text-green-700 mt-2">Đơn</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl border border-purple-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-purple-900">Giá Trị TB/Đơn</h3>
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <p className="text-3xl font-black text-purple-900">
            {(avgOrderValue / 1000).toFixed(0)}K
          </p>
          <p className="text-xs text-purple-700 mt-2">Đ</p>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <h2 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <TrendingUp size={20} /> Xu Hướng Doanh Thu
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px'
                }}
                formatter={(value) => `${(value / 1000000).toFixed(1)}M đ`}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Revenue */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
        >
          <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Doanh Thu Theo Danh Mục</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${(value / 1000000).toFixed(1)}M đ`} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Details Table */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2"
        >
          <h2 className="text-lg font-bold uppercase tracking-wider mb-6">Chi Tiết Doanh Thu Theo Danh Mục</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Danh Mục</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-700">Doanh Thu</th>
                  <th className="text-right py-4 px-4 font-bold text-gray-700">Tỷ Lệ</th>
                  <th className="text-left py-4 px-4 font-bold text-gray-700">Biểu Đồ</th>
                </tr>
              </thead>
              <tbody>
                {categoryRevenue.map((cat, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">{cat.name}</td>
                    <td className="text-right py-4 px-4 font-bold text-blue-600">
                      {(cat.value / 1000000).toFixed(1)}M đ
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        {cat.percentage}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RevenueAnalytics
