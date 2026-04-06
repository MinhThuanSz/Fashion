import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, ChevronRight, CheckCircle2, XCircle, AlertCircle, ShoppingBag,
  ArrowLeft, Loader2, RefreshCw, CreditCard
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ordersApi } from '../../services/api'
import { UI_TEXT } from '../../constants/text'

const OrderManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await ordersApi.getAll()
      const payload = res?.data ?? res?.orders ?? res
      const data = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.orders)
          ? payload.orders
          : Array.isArray(payload?.data)
            ? payload.data
            : []

      setOrders(data)
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đơn hàng')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const statusMap = {
    'SUCCESS':   { color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 size={12}/>, label: 'Đã hoàn tất' },
    'DELIVERED': { color: 'bg-blue-50 text-blue-500 border-blue-100',    icon: <CheckCircle2 size={12}/>, label: 'Đã giao hàng' },
    'SHIPPED':   { color: 'bg-purple-50 text-purple-500 border-purple-100', icon: <ChevronRight size={12}/>, label: 'Đang vận chuyển' },
    'CONFIRMED': { color: 'bg-cyan-50 text-cyan-500 border-cyan-100',    icon: <CheckCircle2 size={12}/>, label: 'Đã xác nhận' },
    'PENDING':   { color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: <AlertCircle size={12}/>, label: 'Chờ xử lý' },
    'CANCELLED': { color: 'bg-red-50 text-red-500 border-red-100',       icon: <XCircle size={12}/>,      label: 'Đã huỷ' },
  }
  const paymentMap = {
    'PAID':   { color: 'bg-green-50 text-green-600 border-green-100', label: 'Đã thanh toán' },
    'UNPAID': { color: 'bg-orange-50 text-orange-500 border-orange-100', label: 'Chưa thanh toán' },
  }

  const handleUpdateStatus = async (id, status, paymentStatus) => {
    try {
      await ordersApi.updateStatus(id, status, paymentStatus)
      toast.success('Cập nhật đơn hàng thành công!', { icon: '📦' })
      setOrders(prev => prev.map(o => o.id === id
        ? { ...o, order_status: status || o.order_status, payment_status: paymentStatus || o.payment_status }
        : o
      ))
    } catch (error) {
      toast.error('Lỗi khi cập nhật đơn hàng: ' + (error.response?.data?.message || error.message))
    }
  }


  const orderList = Array.isArray(orders) ? orders : []
  const filtered = orderList.filter(o => {
    const matchStatus = selectedStatus === 'all' || o.order_status?.toUpperCase() === selectedStatus
    const matchSearch = (o.receiver_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        String(o.id).includes(searchTerm)
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">{UI_TEXT.admin.orders}</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 italic">
            <ShoppingBag size={16}/> Đang theo dõi {orders.length} đơn hàng trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={fetchOrders} className="flex items-center gap-2 px-6 h-12 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-black transition-all">
            <RefreshCw size={16}/> Làm mới
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex bg-gray-100 p-2 rounded-2xl gap-2 overflow-x-auto scrollbar-hide shadow-inner">
        {['all','PENDING','CONFIRMED','SHIPPED','DELIVERED','SUCCESS','CANCELLED'].map(s => (
          <button key={s} onClick={() => setSelectedStatus(s)}
            className={`px-6 h-10 rounded-xl transition-all text-[10px] font-black uppercase tracking-wider whitespace-nowrap
              ${selectedStatus === s ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black hover:bg-white'}`}>
            {s === 'all' ? 'TẤT CẢ' : (statusMap[s]?.label || s)}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-6 h-14 w-full lg:max-w-md group focus-within:border-black transition-all shadow-sm">
        <Search size={18} className="text-gray-300 group-focus-within:text-black transition-colors shrink-0"/>
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm theo tên khách hàng hoặc mã đơn..."
          className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full font-bold text-black"/>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={40} className="animate-spin text-black"/>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 italic">Đang tải...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-30"/>
            <p className="text-sm font-black uppercase italic">Không có đơn hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  {['Mã đơn', 'Khách hàng', 'Sản phẩm / Giá', 'Trạng thái đơn', 'Thanh toán', 'Tổng tiền', 'Hành động'].map(h => (
                    <th key={h} className="px-6 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gray-300 italic whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => {
                  const statusKey = order.order_status?.toUpperCase()
                  const payKey = order.payment_status?.toUpperCase()
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <p className="font-black text-xl italic tracking-tighter">#{order.id}</p>
                        <p className="text-[10px] text-gray-400 font-bold italic mt-1">
                          {new Date(order.created_at || order.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-black text-sm shrink-0">
                            {(order.receiver_name || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-sm text-black">{order.receiver_name}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{order.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-2">
                          <p className="font-black text-sm text-black">{order.items?.[0]?.variant?.product?.name || order.items?.[0]?.variant?.productName || 'Sản phẩm'}</p>
                          <p className="text-[10px] text-gray-500 font-bold">
                            {order.items?.length || 0} sản phẩm
                          </p>
                          <p className="text-[10px] text-gray-500 font-bold">
                            {order.items?.slice(0, 2).map(item => `${item.quantity} x ${Number(item.unitPrice || item.unit_price || 0).toLocaleString('vi-VN')}đ`).join(' • ')}
                            {order.items?.length > 2 ? ` • +${order.items.length - 2} sản phẩm` : ''}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={order.order_status?.toUpperCase() || 'PENDING'}
                          onChange={e => handleUpdateStatus(order.id, e.target.value, undefined)}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border cursor-pointer focus:outline-none ${statusMap[statusKey]?.color || 'bg-gray-50 text-gray-500 border-gray-100'}`}
                        >
                          {['PENDING','CONFIRMED','SHIPPED','DELIVERED','SUCCESS','CANCELLED'].map(s => (
                            <option key={s} value={s}>{statusMap[s]?.label || s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={order.payment_status?.toUpperCase() || 'UNPAID'}
                          onChange={e => handleUpdateStatus(order.id, undefined, e.target.value)}
                          className={`text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border cursor-pointer focus:outline-none ${paymentMap[payKey]?.color || 'bg-gray-50 text-gray-400 border-gray-100'}`}
                        >
                          <option value="UNPAID">Chưa thanh toán</option>
                          <option value="PAID">Đã thanh toán</option>
                        </select>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-black text-xl italic">{Number(order.total_amount).toLocaleString('vi-VN')}đ</p>
                        <p className="text-[10px] text-gray-400 italic">{order.items?.length || 0} SP • {order.payment_method}</p>
                      </td>
                      <td className="px-6 py-5">
                        <button className="p-3 bg-black text-white rounded-2xl hover:opacity-80 transition-all">
                          <ChevronRight size={18}/>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-8 py-5 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-300 italic">
          {filtered.length} / {orders.length} ĐƠN HÀNG
        </div>
      </div>
    </div>
  )
}

export default OrderManagement

