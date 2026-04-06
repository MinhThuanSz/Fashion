import React from 'react'
import { motion } from 'framer-motion'
import { Info, Sparkles, User, Mail, Phone, Send } from 'lucide-react'
import { UI_TEXT } from '../constants/text'
import ContactForm from '../components/contact/ContactForm'
import ContactInfo from '../components/contact/ContactInfo'

const ContactPage = () => {
  return (
    <div className="pt-32 pb-48 min-h-screen container-custom">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between border-b border-gray-100 pb-20 gap-12 mb-32 group">
         <motion.div 
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8 }}
           className="space-y-8"
         >
            <div className="flex items-center gap-4">
               <span className="inline-block px-5 py-2 rounded-full bg-gray-50 text-[10px] font-black uppercase tracking-[0.4em] italic border border-gray-100 shadow-sm animate-fade-in group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                  KẾT NỐI NGAY
               </span>
               <div className="w-12 h-px bg-gray-100 group-hover:w-24 group-hover:bg-black transition-all duration-1000"></div>
            </div>
            <h1 className="text-6xl md:text-[8.5rem] font-black font-outfit leading-[0.9] tracking-tighter italic uppercase" dangerouslySetInnerHTML={{ __html: UI_TEXT.contact.title }}>
            </h1>
            <p className="text-xl text-gray-400 max-w-xl leading-relaxed font-medium italic">
               {UI_TEXT.contact.subtitle}
            </p>
         </motion.div>
         
         <div className="flex items-center gap-6 p-6 md:p-10 bg-gray-50/50 rounded-[3.5rem] border-2 border-dashed border-gray-100 hover:border-black hover:bg-white transition-all duration-1000 group/pulse relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 rounded-full blur-3xl group-hover/pulse:scale-110 transition-transform"></div>
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-black shadow-premium border border-gray-100 group-hover/pulse:rotate-12 transition-transform">
               <Sparkles size={28} className="animate-slow-pulse" />
            </div>
            <div className="space-y-1">
               <h4 className="text-sm font-black uppercase tracking-widest italic leading-none">{UI_TEXT.contact.infoTitle}</h4>
               <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic group-hover/pulse:text-black transition-colors">Tư vấn tận tâm từ chuyên gia thời trang</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start animate-fade-in">
         {/* Form Section */}
         <div className="space-y-16">
            <div className="space-y-6">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic border-b border-gray-50 pb-2">Hộp thư hỗ trợ</span>
                <p className="text-gray-500 font-medium italic leading-relaxed text-lg italic pr-12">
                   Đội ngũ chuyên viên chăm sóc của Antigrav sẽ phản hồi yêu cầu của bạn trong vòng <span className="text-black font-black underline decoration-2 underline-offset-8 decoration-black/5">2 - 4 giờ làm việc</span>. Mọi thắc mắc về đơn hàng, kích thước hay hợp tác đều được ưu tiên xử lý.
                </p>
            </div>
            <ContactForm />
         </div>

         {/* Info Section */}
         <div className="space-y-16">
            <div className="space-y-6">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic border-b border-gray-50 pb-2">Trực tiếp tại trụ sở</span>
                <p className="text-gray-500 font-medium italic leading-relaxed text-lg italic">
                  Ghé thăm không gian mua sắm chuyên biệt của chúng tôi để được tư vấn kích thước và chất liệu một cách trực quan nhất.
                </p>
            </div>
            <ContactInfo />
         </div>
      </div>

      {/* Featured Guarantee Admin Tip */}
      <div className="mt-48 p-12 lg:p-24 bg-black rounded-[4.5rem] text-white relative overflow-hidden group">
         <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/5 to-transparent"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="space-y-8 flex-grow">
               <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.95] max-w-xl">
                 Antigrav cam kết bảo mật <br /> <span className="text-white/40">thông tin của bạn.</span>
               </h3>
               <p className="text-gray-400 font-medium italic text-lg leading-relaxed max-w-xl">
                 Hệ thống mã hóa dữ liệu đầu cuối đảm bảo mọi liên lạc và giao dịch của khách hàng tại Hub đều được bảo vệ tuyệt đối theo tiêu chuẩn quốc tế.
               </p>
            </div>
            <div className="w-full md:w-80 h-96 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-2xl p-12 flex flex-col justify-between group-hover:scale-105 transition-all duration-700 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 animate-slow-pulse"></div>
               <div className="w-20 h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center border border-white/20 group-hover:rotate-12 transition-transform">
                  <Info size={32} />
               </div>
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic mb-2">QUY TRÌNH HỖ TRỢ</p>
                  <p className="text-xs font-bold leading-relaxed italic text-gray-300">
                    B1. Tiếp nhận yêu cầu <br />
                    B2. Phân loại chuyên viên <br />
                    B3. Tư vấn trực tiếp <br />
                    B4. Theo dõi phản hồi
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

export default ContactPage
