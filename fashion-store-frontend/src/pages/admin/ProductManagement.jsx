import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, Edit2, Trash2, Search,
  LayoutGrid, List as ListIcon, Package, Tag, ArrowLeft, Sparkles, RefreshCw
} from 'lucide-react'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'
import { UI_TEXT } from '../../constants/text'
import { productsApi, categoriesApi, brandsApi } from '../../services/api'

const emptyForm = {
  name: '',
  description: '',
  price: 0,
  discount_price: '',
  category_id: '',
  brand_id: '',
  status: 'active',
  image_url: ''
}

const ProductManagement = () => {
  const [viewType, setViewType]       = useState('list')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts]       = useState([])
  const [categories, setCategories]   = useState([])
  const [brands, setBrands]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [searchTerm, setSearchTerm]   = useState('')
  const [formData, setFormData]       = useState(emptyForm)

  useEffect(() => {
    fetchAll()
  }, [])

  // Fetch products, categories, brands in parallel
  const fetchAll = async () => {
    try {
      setLoading(true)
      const [productsRes, catsRes, brandsRes] = await Promise.allSettled([
        productsApi.getAll(),
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ])

      if (productsRes.status === 'fulfilled') {
        const res = productsRes.value
        setProducts(Array.isArray(res) ? res : (res.data?.products || res.data || []))
      }
      if (catsRes.status === 'fulfilled') {
        const res = catsRes.value
        setCategories(Array.isArray(res) ? res : (res.data || []))
      }
      if (brandsRes.status === 'fulfilled') {
        const res = brandsRes.value
        setBrands(Array.isArray(res) ? res : (res.data || []))
      }
    } catch (error) {
      toast.error('Lỗi tải dữ liệu hệ thống')
    } finally {
      setLoading(false)
    }
  }

  // Reload brands + categories fresh when opening modal (catches newly added brands)
  const refreshDropdowns = useCallback(async () => {
    try {
      const [catsRes, brandsRes] = await Promise.allSettled([
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ])
      if (catsRes.status === 'fulfilled') {
        const res = catsRes.value
        setCategories(Array.isArray(res) ? res : (res.data || []))
      }
      if (brandsRes.status === 'fulfilled') {
        const res = brandsRes.value
        setBrands(Array.isArray(res) ? res : (res.data || []))
      }
    } catch {}
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await productsApi.getAll()
      setProducts(Array.isArray(res) ? res : (res.data?.products || res.data || []))
    } catch {
      toast.error('Lỗi lấy dữ liệu sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sản phẩm này? Hành động không thể hoàn tác.')) return
    try {
      await productsApi.delete(id)
      toast.success('Đã xóa sản phẩm thành công!')
      fetchProducts()
    } catch {
      toast.error('Lỗi khi xóa sản phẩm.')
    }
  }

  const handleEdit = async (product) => {
    setSelectedProduct(product)
    setFormData({
      name:           product.name || '',
      description:    product.description || '',
      price:          product.price || 0,
      discount_price: product.discount_price || '',
      category_id:    String(product.category_id || ''),
      brand_id:       String(product.brand_id || ''),
      status:         product.status === 1 || product.status === 'active' ? 'active' : 'inactive',
      image_url:      product.images?.[0]?.image_url || '',
    })
    await refreshDropdowns()
    setIsModalOpen(true)
  }

  const handleCreateNew = async () => {
    setSelectedProduct(null)
    await refreshDropdowns()
    // Default to first available category/brand from DB
    setFormData(prev => ({
      ...emptyForm,
      category_id: categories[0] ? String(categories[0].id) : '',
      brand_id:    brands[0]    ? String(brands[0].id)    : '',
    }))
    setIsModalOpen(true)
  }

  // Update formData after refreshDropdowns so defaults are set correctly
  const openCreateModal = async () => {
    setSelectedProduct(null)
    const [catsRes, brandsRes] = await Promise.allSettled([
      categoriesApi.getAll(),
      brandsApi.getAll(),
    ])
    let freshCats = categories
    let freshBrands = brands
    if (catsRes.status === 'fulfilled') {
      const r = catsRes.value
      freshCats = Array.isArray(r) ? r : (r.data || [])
      setCategories(freshCats)
    }
    if (brandsRes.status === 'fulfilled') {
      const r = brandsRes.value
      freshBrands = Array.isArray(r) ? r : (r.data || [])
      setBrands(freshBrands)
    }
    setFormData({
      ...emptyForm,
      category_id: freshCats[0]   ? String(freshCats[0].id)   : '',
      brand_id:    freshBrands[0] ? String(freshBrands[0].id) : '',
    })
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim()) { toast.error('Vui lòng nhập tên sản phẩm!'); return }
    if (!formData.category_id) { toast.error('Vui lòng chọn danh mục!'); return }
    if (!formData.brand_id)    { toast.error('Vui lòng chọn thương hiệu!'); return }
    if (!formData.price || Number(formData.price) <= 0) { toast.error('Vui lòng nhập giá hợp lệ!'); return }

    try {
      setSaving(true)
      // Build strictly-typed payload
      const payload = {
        name:           formData.name.trim(),
        description:    formData.description || '',
        price:          Number(formData.price),
        discount_price: formData.discount_price ? Number(formData.discount_price) : null,
        category_id:    Number(formData.category_id),
        brand_id:       Number(formData.brand_id),
        status:         formData.status === 'active' ? 1 : 0,
        image_url:      formData.image_url || '',
      }

      console.log('[ProductManagement] Submit payload:', payload)

      if (selectedProduct) {
        await productsApi.update(selectedProduct.id, payload)
        toast.success('Đã cập nhật sản phẩm thành công!', { icon: '✅' })
      } else {
        await productsApi.create(payload)
        toast.success('Thêm sản phẩm thành công!', { icon: '✅' })
      }
      setIsModalOpen(false)
      fetchProducts()
    } catch (error) {
      const errors = error.response?.data?.errors
      const msg    = Array.isArray(errors) ? errors.join(', ') : (error.response?.data?.message || 'Lỗi khi lưu sản phẩm')
      toast.error(`Lỗi: ${msg}`)
      console.error('[ProductManagement] Save error:', error.response?.data || error)
    } finally {
      setSaving(false)
    }
  }

  const filteredProducts = (Array.isArray(products) ? products : []).filter(p =>
    (p?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  )

  return (
    <div className="space-y-16 lg:space-y-24 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-gray-100 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic mb-4">
            <Link to="/admin" className="flex items-center gap-2 hover:text-black transition-colors"><ArrowLeft size={14} /> QUAY LẠI</Link>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">{UI_TEXT.admin.products || 'SẢN PHẨM'}</h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 italic">
            <Sparkles size={16} className="text-primary" /> Quản lý {filteredProducts.length} sản phẩm
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="bg-gray-100 p-2 rounded-2xl flex gap-1 shadow-inner h-16 items-center">
            <button onClick={() => setViewType('grid')} className={`p-3 rounded-xl transition-all h-12 w-12 flex items-center justify-center ${viewType === 'grid' ? 'bg-white text-black shadow-premium' : 'text-gray-400 hover:text-black'}`}>
              <LayoutGrid size={20} />
            </button>
            <button onClick={() => setViewType('list')} className={`p-3 rounded-xl transition-all h-12 w-12 flex items-center justify-center ${viewType === 'list' ? 'bg-white text-black shadow-premium' : 'text-gray-400 hover:text-black'}`}>
              <ListIcon size={20} />
            </button>
          </div>
          <button onClick={fetchAll} className="flex items-center gap-3 px-8 h-16 border-2 border-gray-100 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:border-black transition-all">
            <RefreshCw size={18} /> LÀM MỚI
          </button>
          <button
            onClick={openCreateModal}
            className="btn bg-black text-white px-12 h-20 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-black/10 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={24} /> THÊM MỚI
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white border border-gray-100 rounded-[2rem] px-8 h-20 w-full lg:max-w-[480px] group focus-within:ring-2 focus-within:ring-black/5 transition-all shadow-sm">
        <Search size={22} className="text-gray-300 group-focus-within:text-black transition-colors" />
        <input
          type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          placeholder="Tìm tên sản phẩm..."
          className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full font-bold text-black"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[4.5rem] border border-gray-50 shadow-premium overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center flex-col items-center py-20 opacity-50">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-xs font-black uppercase tracking-widest italic text-gray-500">Đang tải...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-sm font-black uppercase tracking-widest italic">Không có sản phẩm nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-12 py-8 text-[11px] uppercase font-black tracking-[0.3em] text-gray-600 w-[40%]">Sản phẩm</th>
                  <th className="px-6 py-8 text-[11px] uppercase font-black tracking-[0.3em] text-gray-600">Danh mục</th>
                  <th className="px-6 py-8 text-[11px] uppercase font-black tracking-[0.3em] text-gray-600">Giá (VND)</th>
                  <th className="px-6 py-8 text-[11px] uppercase font-black tracking-[0.3em] text-gray-600">Trạng thái</th>
                  <th className="px-12 py-8 text-[11px] uppercase font-black tracking-[0.3em] text-gray-600 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                    <td className="px-12 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-22 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0" style={{height: '88px', width: '64px'}}>
                          <img
                            src={product.images?.[0]?.image_url || `https://placehold.co/64x88/f3f4f6/9ca3af?text=${encodeURIComponent(product.name?.[0] || '?')}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://placehold.co/64x88/f3f4f6/9ca3af?text=?' }}
                          />
                        </div>
                        <div className="space-y-2 overflow-hidden">
                          <h4 className="font-black text-lg text-gray-900 truncate group-hover:text-blue-700 transition-colors">{product.name}</h4>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                              <Tag size={10} /> {product.category?.name || product.Category?.name || '—'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">{product.brand?.name || product.Brand?.name || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <p className="font-semibold text-sm text-gray-700">{product.category?.name || product.Category?.name || '—'}</p>
                    </td>
                    <td className="px-6 py-8">
                      <p className="font-black text-xl text-gray-900">{Number(product.price).toLocaleString('vi-VN')}<span className="text-sm font-bold text-gray-500 ml-1">đ</span></p>
                    </td>
                    <td className="px-6 py-8">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                        product.status === 1
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {product.status === 1 ? '● Hoạt động' : '● Tạm ẩn'}
                      </div>
                    </td>
                    <td className="px-12 py-8 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEdit(product)} className="p-3 bg-white border-2 border-gray-200 text-gray-500 hover:text-black hover:border-black rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-90">
                        <Edit2 size={18} strokeWidth={1.5} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-3 bg-white border-2 border-gray-200 text-red-400 hover:text-red-600 hover:border-red-500 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-90">
                        <Trash2 size={18} strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-12 py-6 border-t border-gray-200 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-500">
          <span>HIỂN THỊ {filteredProducts.length} / {products.length} SẢN PHẨM</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProduct ? 'CẬP NHẬT SẢN PHẨM' : 'TẠO MỚI SẢN PHẨM'}
        footer={
          <>
            <button onClick={() => setIsModalOpen(false)} className="btn bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 font-bold px-10 h-14 rounded-2xl uppercase tracking-widest text-[10px]">HỦY BỎ</button>
            <button onClick={handleSave} disabled={saving} className="btn bg-black text-white px-14 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl disabled:opacity-50 italic">
              {saving ? 'ĐANG LƯU...' : 'LƯU SẢN PHẨM'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left column */}
          <div className="space-y-8">
            {/* Name */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">TÊN SẢN PHẨM (*)</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleFormChange}
                className="w-full h-16 px-6 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black text-black text-sm font-bold outline-none transition-all"
                placeholder="VD: Nike Dunk Low Retro"
              />
            </div>

            {/* Category & Brand dropdowns — loaded from API */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">DANH MỤC (*)</label>
                {categories.length === 0 ? (
                  <p className="text-xs text-red-400 font-bold italic">Chưa có danh mục. Vui lòng thêm danh mục trước.</p>
                ) : (
                  <select
                    name="category_id" value={formData.category_id} onChange={handleFormChange}
                    className="w-full h-16 px-5 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black text-black font-bold text-sm outline-none cursor-pointer appearance-none transition-all"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">THƯƠNG HIỆU (*)</label>
                {brands.length === 0 ? (
                  <p className="text-xs text-red-400 font-bold italic">Chưa có thương hiệu. Vui lòng thêm thương hiệu trước.</p>
                ) : (
                  <select
                    name="brand_id" value={formData.brand_id} onChange={handleFormChange}
                    className="w-full h-16 px-5 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black text-black font-bold text-sm outline-none cursor-pointer appearance-none transition-all"
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Price & Status */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">GIÁ BÁN (VND) (*)</label>
                <input
                  type="number" name="price" value={formData.price} onChange={handleFormChange} min="0"
                  className="w-full h-16 px-6 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black text-black font-bold text-sm outline-none transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">TRẠNG THÁI</label>
                <select
                  name="status" value={formData.status} onChange={handleFormChange}
                  className="w-full h-16 px-5 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black text-black font-bold text-sm outline-none cursor-pointer appearance-none transition-all"
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm ẩn</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8 flex flex-col">
            {/* Image URL + preview */}
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">ĐƯỜNG DẪN ẢNH (URL)</label>
              <input
                type="text" name="image_url" value={formData.image_url} onChange={handleFormChange}
                className="w-full h-16 px-6 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:border-black text-black font-bold text-sm outline-none transition-all"
                placeholder="https://example.com/product.jpg"
              />
              {formData.image_url && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img src={formData.image_url} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-4 flex-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">MÔ TẢ CHI TIẾT</label>
              <textarea
                name="description" value={formData.description} onChange={handleFormChange} rows={5}
                className="w-full px-6 py-5 border border-gray-100 rounded-[2rem] bg-gray-50/50 focus:bg-white focus:border-black text-black font-bold text-sm outline-none resize-none transition-all"
                placeholder="Mô tả sự đẳng cấp của sản phẩm..."
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProductManagement
