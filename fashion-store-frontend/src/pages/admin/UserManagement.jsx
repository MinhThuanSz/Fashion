import React, { useState, useEffect } from 'react'
import { Search, Shield, UserCheck, UserX, ChevronDown, Users, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { usersApi, rolesApi } from '../../services/api'

const STATUS_LABELS = { 1: 'Hoạt động', 0: 'Bị khóa' }
const STATUS_STYLES = {
  1: 'bg-green-50 text-green-600 border-green-100',
  0: 'bg-red-50 text-red-500 border-red-100',
}

const UserManagement = () => {
  const [users, setUsers]         = useState([])
  const [roles, setRoles]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingRoleId, setEditingRoleId] = useState(null) // user.id being edited

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [usersRes, rolesRes] = await Promise.all([usersApi.getAll(), rolesApi.getAll()])
      setUsers(usersRes.data || [])
      setRoles(rolesRes.data || [])
    } catch (err) {
      toast.error('Lỗi tải dữ liệu người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRoleId) => {
    try {
      await usersApi.updateRole(userId, Number(newRoleId))
      toast.success('Đã cập nhật vai trò người dùng!', { icon: '✅' })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role_id: Number(newRoleId) } : u))
      setEditingRoleId(null)
    } catch (err) {
      toast.error('Lỗi cập nhật vai trò: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 1 ? 0 : 1
    const label = newStatus === 1 ? 'kích hoạt' : 'khóa'
    if (!window.confirm(`Bạn có chắc muốn ${label} tài khoản "${user.full_name}"?`)) return
    try {
      await usersApi.updateStatus(user.id, newStatus)
      toast.success(`Đã ${label} tài khoản thành công!`)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
    } catch (err) {
      toast.error('Lỗi cập nhật trạng thái người dùng')
    }
  }

  const filtered = users.filter(u => {
    const matchSearch = (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole   = filterRole === 'all' || String(u.role_id) === filterRole
    const matchStatus = filterStatus === 'all' || String(u.status) === filterStatus
    return matchSearch && matchRole && matchStatus
  })

  const getRoleName = (roleId) => {
    const role = roles.find(r => r.id === roleId)
    return role?.name || `Role #${roleId}`
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">NGƯỜI DÙNG</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 italic">
            <Users size={16} className="text-gray-400" /> Quản lý {filtered.length} tài khoản đăng ký
          </p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-3 px-8 h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-80 transition-all">
          <RefreshCw size={16} /> LÀM MỚI
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-6 h-14 w-full lg:max-w-md group focus-within:border-black transition-all shadow-sm">
          <Search size={18} className="text-gray-300 shrink-0 group-focus-within:text-black transition-colors" />
          <input
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên hoặc email..."
            className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full font-bold text-black"
          />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="h-14 px-6 border border-gray-100 bg-white rounded-2xl text-xs font-black text-black uppercase tracking-widest focus:outline-none focus:border-black transition-all cursor-pointer">
          <option value="all">Tất cả vai trò</option>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="h-14 px-6 border border-gray-100 bg-white rounded-2xl text-xs font-black text-black uppercase tracking-widest focus:outline-none focus:border-black transition-all cursor-pointer">
          <option value="all">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Bị khóa</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest italic">Đang tải dữ liệu...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm font-black uppercase tracking-widest italic">Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  {['ID', 'Họ tên', 'Email', 'Số điện thoại', 'Trạng thái', 'Vai trò', 'Ngày tạo', 'Thao tác'].map(h => (
                    <th key={h} className="px-6 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gray-300 italic whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 text-xs font-black text-gray-300 italic">#{user.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-sm text-gray-500 shrink-0">
                          {(user.full_name || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-black text-sm text-black">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-600">{user.email}</td>
                    <td className="px-6 py-5 text-xs font-bold text-gray-500">{user.phone || '—'}</td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${STATUS_STYLES[user.status] || STATUS_STYLES[0]}`}>
                        {STATUS_LABELS[user.status] || 'Không rõ'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {editingRoleId === user.id ? (
                        <select
                          defaultValue={user.role_id}
                          autoFocus
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                          onBlur={() => setEditingRoleId(null)}
                          className="text-xs font-black text-black bg-white border-2 border-black rounded-xl px-3 py-2 outline-none cursor-pointer"
                        >
                          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingRoleId(user.id)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-gray-200 bg-gray-50 text-gray-700 hover:border-black hover:bg-black hover:text-white transition-all"
                        >
                          <Shield size={11} /> {getRoleName(user.role_id)} <ChevronDown size={11} />
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-5 text-[10px] text-gray-400 font-bold italic whitespace-nowrap">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                          user.status === 1
                            ? 'border-red-100 text-red-400 hover:border-red-500 hover:text-red-500'
                            : 'border-green-100 text-green-500 hover:border-green-500'
                        }`}
                      >
                        {user.status === 1 ? <><UserX size={12} /> Khóa</> : <><UserCheck size={12} /> Mở khóa</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-8 py-6 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-300 italic">
          HIỂN THỊ {filtered.length} / {users.length} NGƯỜI DÙNG
        </div>
      </div>
    </div>
  )
}

export default UserManagement
