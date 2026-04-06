import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, Tag, RefreshCw, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { brandsApi } from '../../services/api'

const emptyForm = { name: '', description: '', logo_url: '', status: 1 }

const BrandManagement = () => {
  const [brands, setBrands]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState(null)
  const [formData, setFormData]   = useState(emptyForm)
  const [saving, setSaving]       = useState(false)

  useEffect(() => { fetchBrands() }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const res = await brandsApi.getAll()
      // Backend may return array directly or { data: [] }
      setBrands(Array.isArray(res) ? res : (res.data || []))
    } catch {
      toast.error('Lỗi tải danh sách thương hiệu')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setSelectedBrand(null)
    setFormData(emptyForm)
    setIsModalOpen(true)
  }

  const openEdit = (brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
      logo_url: brand.logo_url || '',
      status: brand.status ?? 1,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (brand) => {
    if (!window.confirm(`Xóa thương hiệu "${brand.name}"? Hành động này không thể hoàn tác.`)) return
    try {
      await brandsApi.delete(brand.id)
      toast.success('Đã xóa thương hiệu!')
      fetchBrands()
    } catch (err) {
      toast.error('Lỗi xóa thương hiệu: ' + (err.response?.data?.message || err.message))
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error('Vui lòng nhập tên thương hiệu!'); return }
    try {
      setSaving(true)
      const payload = {
        name: formData.name.trim(),
        description: formData.description || '',
        logo_url: formData.logo_url || '',
        status: Number(formData.status),
      }
      if (selectedBrand) {
        await brandsApi.update(selectedBrand.id, payload)
        toast.success('Đã cập nhật thương hiệu!', { icon: '✅' })
      } else {
        await brandsApi.create(payload)
        toast.success('Thêm thương hiệu thành công!', { icon: '✅' })
      }
      setIsModalOpen(false)
      fetchBrands()
    } catch (err) {
      toast.error('Lỗi lưu thương hiệu: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const filtered = brands.filter(b =>
    (b.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-none">THƯƠNG HIỆU</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 italic">
            <Building2 size={16} /> Quản lý {brands.length} thương hiệu trong hệ thống
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchBrands} className="flex items-center gap-3 px-6 h-14 border-2 border-gray-100 rounded-2xl font-black uppercase tracking-widest text-xs hover:border-black transition-all">
            <RefreshCw size={16} />
          </button>
          <button onClick={openCreate} className="flex items-center gap-3 px-10 h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-80 transition-all shadow-lg">
            <Plus size={18} /> THÊM THƯƠNG HIỆU
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-6 h-14 w-full lg:max-w-md group focus-within:border-black transition-all shadow-sm">
        <Search size={18} className="text-gray-300 shrink-0 group-focus-within:text-black transition-colors" />
        <input
          type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm thương hiệu..."
          className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full font-bold text-black"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 italic">Đang tải...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Tag size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm font-black uppercase italic">Chưa có thương hiệu nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  {['Logo', 'Tên thương hiệu', 'Mô tả', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="px-8 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gray-300 italic">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(brand => (
                  <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      {brand.logo_url ? (
                        <img src={brand.logo_url} alt={brand.name} className="w-12 h-12 object-contain rounded-xl bg-gray-50 p-1 border border-gray-100" onError={e => e.target.style.display='none'} />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-lg text-gray-400">
                          {(brand.name || 'B')[0].toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-black text-xl text-black italic">{brand.name}</p>
                    </td>
                    <td className="px-8 py-5 max-w-xs">
                      <p className="text-xs text-gray-500 font-bold truncate">{brand.description || '—'}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${brand.status === 1 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {brand.status === 1 ? 'Hoạt động' : 'Tạm ẩn'}
                      </span>
                    </td>
                    <td className="px-8 py-5 space-x-3 whitespace-nowrap">
                      <button onClick={() => openEdit(brand)} className="p-3 bg-white border-2 border-gray-100 text-gray-300 hover:text-black hover:border-black rounded-2xl transition-all">
                        <Edit2 size={18} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => handleDelete(brand)} className="p-3 bg-white border-2 border-gray-100 text-red-200 hover:text-red-500 hover:border-red-500 rounded-2xl transition-all">
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-8 py-5 border-t border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-300 italic">
          {filtered.length} / {brands.length} THƯƠNG HIỆU
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl mx-4 z-10">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">
              {selectedBrand ? 'CẬP NHẬT THƯƠNG HIỆU' : 'THÊM THƯƠNG HIỆU MỚI'}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">TÊN THƯƠNG HIỆU (*)</label>
                <input
                  type="text" value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full h-14 px-5 border-2 border-gray-100 rounded-2xl text-black font-bold text-sm focus:outline-none focus:border-black transition-all"
                  placeholder="VD: Nike, Adidas, Puma..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">URL LOGO</label>
                <input
                  type="text" value={formData.logo_url}
                  onChange={e => setFormData(p => ({ ...p, logo_url: e.target.value }))}
                  className="w-full h-14 px-5 border-2 border-gray-100 rounded-2xl text-black font-bold text-sm focus:outline-none focus:border-black transition-all"
                  placeholder="https://example.com/logo.png"
                />
                {formData.logo_url && (
                  <div className="mt-3 w-20 h-20 rounded-2xl border border-gray-100 bg-gray-50 p-2 overflow-hidden">
                    <img src={formData.logo_url} alt="preview" className="w-full h-full object-contain" onError={e => e.target.style.display='none'} />
                  </div>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">MÔ TẢ</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full px-5 py-4 border-2 border-gray-100 rounded-2xl text-black font-bold text-sm focus:outline-none focus:border-black transition-all resize-none"
                  placeholder="Mô tả ngắn về thương hiệu..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">TRẠNG THÁI</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(p => ({ ...p, status: Number(e.target.value) }))}
                  className="w-full h-14 px-5 border-2 border-gray-100 rounded-2xl text-black font-bold text-sm focus:outline-none focus:border-black transition-all cursor-pointer"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Tạm ẩn</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-10 pt-8 border-t border-gray-100">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 h-14 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:border-black hover:text-black transition-all">
                HỦY BỎ
              </button>
              <button onClick={handleSave} disabled={saving} className="flex-1 h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all disabled:opacity-50">
                {saving ? 'ĐANG LƯU...' : 'LƯU THƯƠNG HIỆU'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BrandManagement
