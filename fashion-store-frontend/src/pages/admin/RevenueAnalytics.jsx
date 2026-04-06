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
  const [filterPeriod, setFilterPeriod] = useState('month') // day, month, year
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
      const revenueCall = filterPeriod === 'day'
        ? adminApi.getRevenueByDay()
        : filterPeriod === 'year'
          ? adminApi.getRevenueByYear()
          : adminApi.getRevenueByMonth()

      const results = await Promise.allSettled([
        adminApi.getSummary(),
        revenueCall,
        adminApi.getTopProducts(),
        adminApi.getRevenueByCategory()
      ])

      const [summaryRes, revenueRes, productsRes, categoryRes] = results

      if (summaryRes.status === 'fulfilled' && summaryRes.value.success) {
        setSummary(summaryRes.value.data)
      }

      if (revenueRes.status === 'fulfilled' && revenueRes.value.success) {
        setRevenueData(revenueRes.value.data.map(item => ({
          ...item,
          date: item.date || item.month || item.year || String(item.createdAt || '')
        })))
      } else {
        console.warn('Revenue data load failed:', revenueRes)
      }

      if (productsRes.status === 'fulfilled' && productsRes.value.success) {
        setTopProducts(productsRes.value.data.map(prod => ({
          ...prod,
          quantitySold: Number(prod.quantitySold || prod.quantity_sold || 0),
          totalRevenue: Number(prod.totalRevenue || prod.total_revenue || 0),
          avgPrice: Number(prod.totalRevenue || prod.total_revenue || 0) / Number(prod.quantitySold || prod.quantity_sold || 1)
        })))
      } else {
        console.warn('Top products load failed:', productsRes)
      }

      if (categoryRes.status === 'fulfilled' && categoryRes.value.success) {
        const categories = categoryRes.value.data.map(cat => ({
          name: cat.categoryName || cat.category_name || cat.name,
          value: Number(cat.revenue || cat.totalRevenue || 0)
        }))
        const total = categories.reduce((sum, item) => sum + item.value, 0) || 1
        setCategoryRevenue(categories.map(cat => ({
          ...cat,
          percentage: Math.round((cat.value / total) * 100)
        })))
      } else {
        console.warn('Category revenue load failed:', categoryRes)
      }

      const hasAnySuccess = [summaryRes, revenueRes, productsRes, categoryRes].some(result => result.status === 'fulfilled' && result.value?.success)
      if (!hasAnySuccess) {
        throw new Error('Không thể tải dữ liệu phân tích doanh số từ máy chủ.')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi tải dữ liệu phân tích doanh số'
      toast.error(errorMessage)
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
        {['day', 'month', 'year'].map(period => (
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
      <div className="text-xs uppercase tracking-widest text-gray-400 px-4">
        Doanh thu chỉ tính cho đơn hàng đã thanh toán hoặc đã hoàn tất. Khi đơn hàng thanh toán thành công, giá trị này sẽ được cộng vào báo cáo doanh số.
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

        {/* Top Products */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-wider">Top Sản Phẩm Bán Chạy</h2>
              <p className="text-sm text-gray-500">Dữ liệu doanh thu theo sản phẩm từ các đơn hàng thành công</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-gray-400">Sản phẩm</p>
              <p className="text-2xl font-black text-gray-900">{topProducts.length}</p>
              {topProducts.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Giá TB: {(topProducts.reduce((sum, prod) => sum + prod.avgPrice, 0) / topProducts.length / 1000).toFixed(0)}K đ
                </p>
              )}
            </div>
          </div>

          {/* Product Price Chart */}
          {topProducts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-700">Phân Phối Giá Sản Phẩm</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="productName" 
                    stroke="#9ca3af" 
                    fontSize={10}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#9ca3af" fontSize={10} />
                  <Tooltip 
                    formatter={(value) => `${(value / 1000).toFixed(0)}K đ`}
                    labelStyle={{ fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="avgPrice" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 text-xs uppercase font-black tracking-widest text-gray-400">#</th>
                  <th className="py-4 px-4 text-xs uppercase font-black tracking-widest text-gray-400">Sản Phẩm</th>
                  <th className="py-4 px-4 text-xs uppercase font-black tracking-widest text-gray-400 text-right">Số Lượng</th>
                  <th className="py-4 px-4 text-xs uppercase font-black tracking-widest text-gray-400 text-right">Giá TB</th>
                  <th className="py-4 px-4 text-xs uppercase font-black tracking-widest text-gray-400 text-right">Doanh Thu</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((prod, index) => (
                  <tr key={prod.productId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-gray-900">{index + 1}</td>
                    <td className="py-4 px-4 text-gray-800 font-semibold">{prod.productName}</td>
                    <td className="py-4 px-4 text-right text-gray-600">{prod.quantitySold}</td>
                    <td className="py-4 px-4 text-right font-bold text-green-600">{(prod.avgPrice / 1000).toFixed(0)}K đ</td>
                    <td className="py-4 px-4 text-right font-black text-blue-600">{(prod.totalRevenue / 1000000).toFixed(1)}M đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
