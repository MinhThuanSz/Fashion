import React, { useState } from 'react'
import { Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { UI_TEXT } from '../../constants/text'
import toast from 'react-hot-toast'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simple validation
    if (!formData.email.includes('@')) {
       toast.error(UI_TEXT.contact.sendError)
       setIsSubmitting(false)
       return
    }

    setTimeout(() => {
       setIsSubmitting(false)
       toast.success(UI_TEXT.contact.sendSuccess, {
          icon: '🚀',
          style: {
             borderRadius: '2rem',
             background: '#0ea5e9',
             color: '#fff',
             fontWeight: 'black',
             fontSize: '12px',
          }
       })
       setFormData({ name: '', email: '', phone: '', message: '' })
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-white p-12 lg:p-20 rounded-[4rem] border border-gray-100 shadow-premium relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
       
       <div className="relative z-10 space-y-12">
          <div className="space-y-4">
             <h3 className="text-4xl font-black uppercase tracking-tighter italic">{UI_TEXT.contact.formTitle}</h3>
             <div className="w-16 h-1 bg-primary/20"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4 group/input">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">{UI_TEXT.checkout.fullName}</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Nguyễn Văn A"
                  className="input bg-gray-50/50 border-gray-100 focus:bg-white text-xs font-bold h-16 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/10 transition-all font-outfit"
                />
             </div>
             <div className="space-y-4 group/input">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">{UI_TEXT.checkout.email}</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. name@domain.com"
                  className="input bg-gray-50/50 border-gray-100 focus:bg-white text-xs font-bold h-16 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/10 transition-all font-outfit"
                />
             </div>
             <div className="md:col-span-2 space-y-4 group/input">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">{UI_TEXT.checkout.phone}</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 0981 123 456"
                  className="input bg-gray-50/50 border-gray-100 focus:bg-white text-xs font-bold h-16 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/10 transition-all font-outfit"
                />
             </div>
             <div className="md:col-span-2 space-y-4 group/input">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] ml-1 italic">Nội dung chi tiết</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Bạn đang quan tâm đến sản phẩm nào? Hãy chia sẻ với NovaKit..."
                  className="input bg-gray-50/50 border-gray-100 focus:bg-white text-xs font-bold rounded-[2.5rem] p-10 shadow-sm focus:ring-2 focus:ring-primary/10 transition-all resize-none italic leading-relaxed font-outfit"
                ></textarea>
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn bg-primary text-white px-8 h-24 rounded-[3rem] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-6 hover:scale-105 active:scale-95 transition-all text-sm group/btn disabled:opacity-50 italic"
          >
             {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
             ) : (
                <>
                   {UI_TEXT.contact.submit} <Send size={24} className="group-hover/btn:translate-x-2 group-hover/btn:translate-y-[-4px] transition-transform duration-500" />
                </>
             )}
          </button>
       </div>
    </form>
  )
}

export default ContactForm
