import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Settings, Store, Palette, CreditCard, Share2, 
  Save, ArrowLeft, Building2, Mail, Phone,
  MapPin, CheckCircle2, ChevronRight, Hash, Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'
import { UI_TEXT } from '../../constants/text'

const SettingsAdmin = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
     // Cửa hàng
     storeName: 'NovaKit Fashion Hub',
     slogan: 'Nâng Tầm Phong Cách Của Bạn',
     email: 'support@novakit.com',
     phone: '1900 1234 56',
     address: 'Số 1, Tòa tháp Bitexco, Q1, TP HCM',
     // Cấu hình
     primaryColor: '#000000',
     defaultOrderStatus: 'PENDING',
     paymentCod: true,
     paymentBank: false,
     // Mạng xã hội
     facebook: 'https://facebook.com/novakit',
     instagram: 'https://instagram.com/novakit_official',
     tiktok: 'https://tiktok.com/@novakit'
  })

  const handleChange = (e) => {
     const { name, value, type, checked } = e.target
     setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
     }))
  }

  const handleSave = () => {
     setLoading(true)
     setTimeout(() => {
        setLoading(false)
        toast.success('Lưu cấu hình hệ thống thành công!', { icon: '⚙️' })
     }, 1000)
  }

  return (
    <div className="space-y-16 animate-fade-in pb-20 text-white">
       <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b border-white/10 pb-16">
          <div className="space-y-6">
             <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] italic mb-4">
                <Link to="/admin" className="flex items-center gap-2 hover:text-white transition-colors border-b border-transparent hover:border-white"><ArrowLeft size={14} /> QUAY LẠI TRANG CHỦ</Link>
             </div>
             <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">{UI_TEXT.admin.settings || 'CÀI ĐẶT HỆ THỐNG'}</h1>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 italic">
                <Settings size={16} /> Quản lý cấu hình toàn cục NovaKit
             </p>
          </div>
          <button 
             onClick={handleSave} 
             disabled={loading}
             className="flex items-center gap-4 px-10 h-16 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
             {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
             LƯU THAY ĐỔI
          </button>
       </div>

       <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Settings Menus */}
          <div className="w-full lg:w-80 space-y-4 shrink-0">
             <button 
               onClick={() => setActiveTab('general')} 
               className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${activeTab === 'general' ? 'bg-white text-black shadow-premium' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
             >
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest italic">
                   <Store size={18} /> THÔNG TIN CHUNG
                </div>
                <ChevronRight size={16} />
             </button>

             <button 
               onClick={() => setActiveTab('appearance')} 
               className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${activeTab === 'appearance' ? 'bg-white text-black shadow-premium' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
             >
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest italic">
                   <Palette size={18} /> GIAO DIỆN & MÀU SẮC
                </div>
                <ChevronRight size={16} />
             </button>

             <button 
               onClick={() => setActiveTab('orders')} 
               className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-premium' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
             >
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest italic">
                   <CreditCard size={18} /> ĐƠN HÀNG & THANH TOÁN
                </div>
                <ChevronRight size={16} />
             </button>

             <button 
               onClick={() => setActiveTab('social')} 
               className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all ${activeTab === 'social' ? 'bg-white text-black shadow-premium' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
             >
                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest italic">
                   <Share2 size={18} /> MẠNG XÃ HỘI
                </div>
                <ChevronRight size={16} />
             </button>
          </div>

          {/* Settings Content Area */}
          <div className="flex-grow bg-white/5 border border-white/10 rounded-[3rem] p-10 lg:p-14">
             {activeTab === 'general' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-widest italic">Thông tin Cửa hàng</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Cập nhật thông tin cơ bản để hiển thị trên hóa đơn và footer trang web.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Tên Cửa hàng (*)</label>
                         <div className="relative">
                            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input name="storeName" value={formData.storeName} onChange={handleChange} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-16 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit uppercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" placeholder="NHẬP TÊN CỬA HÀNG" />
                         </div>
                      </div>
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Slogan Khẩu hiệu</label>
                         <div className="relative">
                            <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input name="slogan" value={formData.slogan} onChange={handleChange} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-16 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit uppercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" />
                         </div>
                      </div>
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Email liên hệ</label>
                         <div className="relative">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input name="email" value={formData.email} onChange={handleChange} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-16 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit lowercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" />
                         </div>
                      </div>
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Số điện thoại</label>
                         <div className="relative">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-16 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit lowercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" />
                         </div>
                      </div>
                      <div className="space-y-4 group md:col-span-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Địa chỉ Cửa hàng / Kho</label>
                         <div className="relative">
                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input name="address" value={formData.address} onChange={handleChange} className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-16 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit uppercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" />
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'appearance' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-widest italic">Giao diện Hiển thị</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Thay đổi nhận diện thương hiệu trên website.</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Màu sắc chủ đạo (Primary Color)</label>
                         <div className="flex items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                             <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-0" />
                             <span className="font-outfit font-black tracking-widest text-lg">{formData.primaryColor || '#000000'}</span>
                         </div>
                      </div>

                      <div className="space-y-4 md:col-span-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Thay đổi Logo Hệ thống</label>
                         <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                               <ImageIcon size={32} />
                            </div>
                            <div className="text-center">
                               <h4 className="font-black uppercase tracking-widest italic text-sm">Nhấp hoặc kéo thả logo vào đây</h4>
                               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic mt-2">Đinh dạng PNG, SVG (Không nền), Max 5MB</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'orders' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-widest italic">Quy trình Thanh toán & Đơn hàng</h3>
                   </div>
                   
                   <div className="space-y-10">
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Trạng thái Mặc định Của Đơn Mới</label>
                         <select name="defaultOrderStatus" value={formData.defaultOrderStatus} onChange={handleChange} className="w-full md:w-1/2 h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit uppercase tracking-widest text-white focus:bg-white/10">
                            <option value="PENDING" className="bg-black text-white">Chờ xử lý (Pending)</option>
                            <option value="PROCESSING" className="bg-black text-white">Đang xử lý (Processing)</option>
                            <option value="SHIPPED" className="bg-black text-white">Xác nhận và Xuất kho (Shipped)</option>
                         </select>
                      </div>

                      <div className="space-y-6">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Phương thức thanh toán khả dụng</label>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className={`w-6 h-6 rounded border flex items-center justify-center ${formData.paymentCod ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                     {formData.paymentCod && <CheckCircle2 size={16} className="text-white" />}
                                  </div>
                                  <span className="text-sm font-black uppercase tracking-widest italic">Thanh toán khi nhận hàng (COD)</span>
                               </div>
                               <input type="checkbox" name="paymentCod" checked={formData.paymentCod} onChange={handleChange} className="hidden" />
                            </label>

                            <label className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-primary/50 transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className={`w-6 h-6 rounded border flex items-center justify-center ${formData.paymentBank ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                                     {formData.paymentBank && <CheckCircle2 size={16} className="text-white" />}
                                  </div>
                                  <span className="text-sm font-black uppercase tracking-widest italic">Chuyển khoản / Bank Transfer</span>
                               </div>
                               <input type="checkbox" name="paymentBank" checked={formData.paymentBank} onChange={handleChange} className="hidden" />
                            </label>
                         </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'social' && (
                <div className="space-y-12 animate-fade-in">
                   <div className="space-y-4">
                      <h3 className="text-3xl font-black uppercase tracking-widest italic">Liên kết Mạng xã hội</h3>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Đồng bộ các kênh truyền thông chính thức của cửa hàng.</p>
                   </div>
                   
                   <div className="space-y-8">
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Facebook Page URL</label>
                         <input name="facebook" value={formData.facebook} onChange={handleChange} className="w-full md:w-2/3 h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit lowercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" placeholder="https://facebook.com/..." />
                      </div>
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">Instagram Profile URL</label>
                         <input name="instagram" value={formData.instagram} onChange={handleChange} className="w-full md:w-2/3 h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit lowercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" placeholder="https://instagram.com/..." />
                      </div>
                      <div className="space-y-4 group">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors italic">TikTok Handle</label>
                         <input name="tiktok" value={formData.tiktok} onChange={handleChange} className="w-full md:w-2/3 h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-outfit lowercase tracking-widest placeholder:text-gray-600 text-white focus:bg-white/10" placeholder="https://tiktok.com/@..." />
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </div>
  )
}

export default SettingsAdmin
