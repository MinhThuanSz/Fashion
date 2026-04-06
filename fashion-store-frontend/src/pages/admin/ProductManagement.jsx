import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, Edit2, Trash2, Search, Filter, 
  ChevronRight, MoreVertical, LayoutGrid, 
  List as ListIcon, Star, Package, Tag, ArrowLeft, ArrowUpRight, Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'
import { UI_TEXT } from '../../constants/text'
import { productsApi } from '../../services/api'

const ProductManagement = () => {
  const [viewType, setViewType] = useState('list')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
     name: '',
     sku: '',
     description: '',
     price: 0,
     discount_price: 0,
     category_id: 1,
     brand_id: 1,
     status: 'active',
     image_url: ''
  })

  useEffect(() => {
     fetchProducts()
  }, [])

  const fetchProducts = async () => {
     try {
        setLoading(true)
        const res = await productsApi.getAll()
        if (res.success) {
           setProducts(res.data.products || [])
        }
     } catch (error) {
        toast.error('Lỗi lấy dữ liệu sản phẩm từ hệ thống')
     } finally {
        setLoading(false)
     }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.')) {
        try {
           await productsApi.delete(id)
           toast.success('Đã xóa sản phẩm thành công!')
           fetchProducts()
        } catch (error) {
           toast.error('Lỗi khi xóa sản phẩm.')
        }
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
       name: product.name,
       sku: product.sku || '',
       description: product.description || '',
       price: product.price || 0,
       discount_price: product.discount_price || 0,
       category_id: product.category_id || 1,
       brand_id: product.brand_id || 1,
       status: product.status || 'active',
       image_url: product.images?.[0]?.image_url || ''
    })
    setIsModalOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedProduct(null)
    setFormData({
       name: '', sku: '', description: '', price: 0, discount_price: 0, category_id: 1, brand_id: 1, status: 'active', image_url: ''
    })
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
     setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
     try {
        // Build clean payload that matches productSchema exactly
        const payload = {
           name: formData.name.trim(),
           description: formData.description || '',
           price: Number(formData.price),
           discount_price: formData.discount_price ? Number(formData.discount_price) : null,
           category_id: Number(formData.category_id),
           brand_id: Number(formData.brand_id),
           status: formData.status === 'active' || formData.status === 1 ? 1 : 0,
           image_url: formData.image_url || ''
        }

        if (selectedProduct) {
           await productsApi.update(selectedProduct.id, payload)
           toast.success('Đã cập nhật thông tin sản phẩm!', { icon: '✅' })
        } else {
           await productsApi.create(payload)
           toast.success('Thêm sản phẩm thành công!', { icon: '✅' })
        }
        setIsModalOpen(false)
        fetchProducts()
     } catch (error) {
        const msg = error.response?.data?.errors?.join(', ') || error.response?.data?.message || 'Lỗi khi lưu sản phẩm'
        toast.error(`Lỗi: ${msg}`)
        console.error('Save product error:', error)
     }
  }
  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => 
     (p?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  )
  return (
    <div className="space-y-16 lg:space-y-24 animate-fade-in pb-20">
       <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-gray-100 pb-16">
          <div className="space-y-6">
             <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic mb-4">
                <Link to="/admin" className="flex items-center gap-2 hover:text-black transition-colors"><ArrowLeft size={14} /> QUAY LẠI TRANG CHỦ</Link>
             </div>
             <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">{UI_TEXT.admin.products || 'SẢN PHẨM'}</h1>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 italic">
                <Sparkles size={16} className="text-primary" /> Bạn đang quản lý {filteredProducts.length} Mẫu thiết kế NovaKit
             </p>
          </div>
          <div className="flex flex-wrap items-center gap-6">
             <div className="bg-gray-100 p-2 rounded-2xl flex gap-1 shadow-inner border border-gray-100 h-16 items-center">
                <button onClick={() => setViewType('grid')} className={`p-3 rounded-xl transition-all h-12 w-12 flex items-center justify-center ${viewType === 'grid' ? 'bg-white text-black shadow-premium' : 'text-gray-400 hover:text-black'}`}>
                   <LayoutGrid size={20} />
                </button>
                <button onClick={() => setViewType('list')} className={`p-3 rounded-xl transition-all h-12 w-12 flex items-center justify-center ${viewType === 'list' ? 'bg-white text-black shadow-premium' : 'text-gray-400 hover:text-black'}`}>
                   <ListIcon size={20} />
                </button>
             </div>
             <button 
                onClick={handleCreateNew}
                className="btn bg-black text-white px-12 h-20 rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl shadow-black/10 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
             >
                <Plus size={24} /> {UI_TEXT.admin.newProduct || 'THÊM MỚI'}
             </button>
          </div>
       </div>

       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center bg-white border border-gray-100 rounded-[2rem] px-8 h-20 w-full lg:max-w-[480px] group focus-within:ring-2 focus-within:ring-black/5 transition-all shadow-sm">
             <Search size={22} className="text-gray-300 group-focus-within:text-black transition-colors" />
             <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm tên sản phẩm, SKU, thương hiệu..." className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full font-bold uppercase tracking-wider italic" />
          </div>
          <div className="flex items-center gap-6">
             <button className="flex items-center gap-3 px-10 h-16 border-2 border-gray-100 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all shadow-sm hover:translate-y-[-2px] duration-500">
                <Filter size={18} /> BỘ LỌC NÂNG CAO
             </button>
             <button className="flex items-center gap-3 px-10 h-16 border-2 border-gray-100 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all shadow-sm hover:translate-y-[-2px] duration-500">
                <ArrowUpRight size={18} /> XUẤT FILE CSV
             </button>
          </div>
       </div>

       <div className="bg-white rounded-[4.5rem] border border-gray-50 shadow-premium overflow-hidden group min-h-[400px]">
          {loading ? (
             <div className="flex justify-center flex-col items-center py-20 opacity-50">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-xs font-black uppercase tracking-widest italic text-gray-500">Đang tải dữ liệu...</p>
             </div>
          ) : filteredProducts.length === 0 ? (
             <div className="text-center py-24 text-gray-400">
                 <Package size={48} className="mx-auto mb-4 opacity-50" />
                 <p className="text-sm font-black uppercase tracking-widest italic">Không có dữ liệu sản phẩm</p>
             </div>
          ) : (
             <div className="overflow-x-auto min-w-full">
                <table className="w-full text-left border-collapse">
                   <thead className="bg-gray-50/50 border-b border-gray-100">
                      <tr>
                         <th className="px-12 py-10 text-[10px] uppercase font-black tracking-[0.4em] text-gray-300 italic w-[40%]">Sản phẩm chi tiết</th>
                         <th className="px-6 py-10 text-[10px] uppercase font-black tracking-[0.4em] text-gray-300 italic">Mã SKU</th>
                         <th className="px-6 py-10 text-[10px] uppercase font-black tracking-[0.4em] text-gray-300 italic">Giá niêm yết (VND)</th>
                         <th className="px-6 py-10 text-[10px] uppercase font-black tracking-[0.4em] text-gray-300 italic">Trạng thái</th>
                         <th className="px-12 py-10 text-[10px] uppercase font-black tracking-[0.4em] text-gray-300 italic text-right">Thao tác</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {filteredProducts.map((product) => (
                         <tr key={product.id} className="group hover:bg-gray-50/50 transition-all duration-700">
                            <td className="px-12 py-10">
                               <div className="flex items-center gap-8">
                                  <div className="w-20 h-28 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 group-hover:scale-105 transition-transform duration-[1.5s] shadow-inner relative overflow-hidden group/img">
                                     <img src={product.images?.[0]?.image_url || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                                  </div>
                                  <div className="space-y-3 overflow-hidden">
                                     <h4 className="font-black text-2xl text-black truncate italic transition-colors group-hover:text-primary">{product.name}</h4>
                                     <div className="flex items-center gap-5 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                        <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full"><Tag size={12} /> {product.category?.name || 'Chưa phân loại'}</span>
                                        <span className="w-px h-2 bg-gray-200"></span>
                                        <span className="flex items-center gap-2 uppercase tracking-[0.2em]">{product.brand?.name || 'No Brand'}</span>
                                     </div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-10">
                               <p className="font-black italic text-sm">{product.sku}</p>
                            </td>
                            <td className="px-6 py-10">
                               <div className="space-y-1">
                                  <p className="font-black text-2xl font-outfit italic text-black">{Number(product.price).toLocaleString('vi-VN')}đ</p>
                                  {product.discount_price && <p className="text-[10px] text-gray-400 line-through italic font-bold tracking-widest opacity-60">{Number(product.discount_price).toLocaleString('vi-VN')}đ</p>}
                               </div>
                            </td>
                            <td className="px-6 py-10">
                               <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-colors shadow-sm ${product.status === 'active' ? 'bg-green-50 text-green-500 border-green-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                                  {product.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                               </div>
                            </td>
                            <td className="px-12 py-10 text-right space-x-4 whitespace-nowrap">
                               <button onClick={() => handleEdit(product)} className="p-4 bg-white border-2 border-gray-50 text-gray-300 hover:text-black hover:border-black rounded-[1.5rem] shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-500 active:scale-90">
                                  <Edit2 size={22} strokeWidth={1.5} />
                               </button>
                               <button onClick={() => handleDelete(product.id)} className="p-4 bg-white border-2 border-gray-50 text-red-100 hover:text-red-500 hover:border-red-500 rounded-[1.5rem] shadow-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-500 active:scale-90">
                                  <Trash2 size={22} strokeWidth={1.5} />
                               </button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}
          <div className="p-12 border-t border-gray-50 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 bg-gray-50/20 italic">
             <div className="flex items-center gap-6">
                HIỂN THỊ <span className="text-black font-black not-italic border-b border-black">{filteredProducts.length > 0 ? '1' : '0'} - {filteredProducts.length}</span> / TỔNG <span className="text-black not-italic">{filteredProducts.length}</span> SẢN PHẨM KHỚP
             </div>
             <div className="flex gap-4">
                <button className="flex items-center gap-3 p-4 hover:text-black transition-all disabled:opacity-20 cursor-not-allowed group">TRANG TRƯỚC</button>
                <button className="flex items-center gap-3 p-4 text-black hover:translate-x-3 transition-all">TRANG KẾ TIẾP <ChevronRight size={18} /></button>
             </div>
          </div>
       </div>

       {/* Add/Edit Modal Admin */}
       <Modal 
         isOpen={isModalOpen} 
         onClose={() => setIsModalOpen(false)} 
         title={selectedProduct ? 'CẬP NHẬT SẢN PHẨM' : 'TẠO MỚI SẢN PHẨM'}
         footer={
            <>
               <button onClick={() => setIsModalOpen(false)} className="btn bg-white border border-gray-100 hover:bg-gray-50 text-gray-400 font-bold px-10 h-14 rounded-2xl uppercase tracking-widest text-[10px]">HỦY BỎ</button>
               <button onClick={handleSave} className="btn bg-black text-white px-14 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/10 italic">LƯU SẢN PHẨM</button>
            </>
         }
       >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-8">
                <div className="space-y-4">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">TÊN SẢN PHẨM (*)</label>
                   <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="input px-6 bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-black transition-colors text-black text-sm font-bold h-16 rounded-2xl shadow-sm w-full outline-none" placeholder="VD: Nike Dunk Low Retro" required/>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">DANH MỤC (*)</label>
                      <select name="category_id" value={formData.category_id} onChange={handleFormChange} className="input px-6 bg-gray-50/50 border border-gray-100 w-full focus:bg-white appearance-none h-16 rounded-2xl shadow-sm font-bold text-black text-xs transition-colors">
                         <option value={1}>Quần áo</option>
                         <option value={2}>Giày dép</option>
                         <option value={3}>Phụ kiện</option>
                      </select>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">THƯƠNG HIỆU (*)</label>
                      <select name="brand_id" value={formData.brand_id} onChange={handleFormChange} className="input px-6 bg-gray-50/50 border border-gray-100 w-full focus:bg-white appearance-none h-16 rounded-2xl shadow-sm font-bold text-black text-xs transition-colors">
                         <option value={1}>Nike</option>
                         <option value={2}>Adidas</option>
                         <option value={3}>Puma</option>
                      </select>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">GIÁ BÁN (VND)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleFormChange} className="input px-6 bg-gray-50/50 border border-gray-100 w-full focus:bg-white focus:border-black text-black text-sm font-bold h-16 rounded-2xl shadow-sm outline-none" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">TRẠNG THÁI</label>
                        <select name="status" value={formData.status} onChange={handleFormChange} className="input px-6 bg-gray-50/50 border border-gray-100 w-full focus:bg-white appearance-none h-16 rounded-2xl shadow-sm font-bold text-black text-xs transition-colors outline-none cursor-pointer">
                           <option value="active">Hoạt động</option>
                           <option value="inactive">Tạm ẩn</option>
                        </select>
                     </div>
                 </div>
             </div>
             
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">ĐƯỜNG DẪN ẢNH (URL)</label>
                    <input type="text" name="image_url" value={formData.image_url} onChange={handleFormChange} className="input px-6 bg-gray-50/50 border border-gray-100 w-full focus:bg-white focus:border-black text-black text-sm font-bold h-16 rounded-2xl shadow-sm outline-none" placeholder="https://example.com/product.jpg" />
                    {formData.image_url && (
                      <div className="mt-2 w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                      </div>
                    )}
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">MÔ TẢ CHI TIẾT</label>
                    <textarea name="description" value={formData.description} onChange={handleFormChange} rows="4" className="input bg-gray-50/50 border-gray-100 focus:bg-white resize-none text-xs text-black w-full transition-colors border focus:border-black font-bold tracking-widest rounded-[2rem] p-8 shadow-sm leading-relaxed outline-none" placeholder="Mô tả sự đẳng cấp của sản phẩm này..."></textarea>
                 </div>
          </div>
       </Modal>
    </div>
  )
}

export default ProductManagement
