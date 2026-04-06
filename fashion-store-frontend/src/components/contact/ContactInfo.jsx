import React from 'react'
import { MapPin, Phone, Mail, Clock, Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react'
import { UI_TEXT } from '../../constants/text'

const ContactInfo = () => {
  const infoItems = [
    { 
       icon: <MapPin size={24} />, 
       label: UI_TEXT.contact.address, 
       value: 'NovaKit Hub, Quận 1, Hồ Chí Minh', 
       isLink: true 
    },
    { 
       icon: <Phone size={24} />, 
       label: 'Số điện thoại', 
       value: '+84 (24) 8888-999', 
       isLink: true 
    },
    { 
       icon: <Mail size={24} />, 
       label: 'Email hỗ trợ', 
       value: 'support@novakit.com', 
       isLink: true 
    },
    { 
       icon: <Clock size={24} />, 
       label: UI_TEXT.contact.workingHours, 
       value: UI_TEXT.contact.workingHoursSub, 
       isLink: false 
    },
  ]

  const socials = [
    { icon: <Instagram size={18} />, href: 'https://instagram.com' },
    { icon: <Twitter size={18} />, href: 'https://twitter.com' },
    { icon: <Facebook size={18} />, href: 'https://facebook.com' },
  ]

  return (
    <div className="space-y-16 animate-fade-in">
       <div className="space-y-12">
          {infoItems.map((item, i) => (
             <div key={i} className="flex gap-8 group">
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-[1.5rem] flex items-center justify-center border border-gray-100 group-hover:bg-primary group-hover:text-white group-hover:rotate-12 transition-all duration-700 shadow-sm group-hover:shadow-premium">
                   {item.icon}
                </div>
                <div className="space-y-2 flex-grow overflow-hidden">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic mb-1">{item.label}</p>
                   <p className="text-xl font-black italic tracking-tighter truncate group-hover:text-primary transition-colors">{item.value}</p>
                   {item.isLink && (
                      <button className="text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-primary transition-all flex items-center gap-2 italic hover:translate-x-1 underline decoration-2 underline-offset-4 decoration-primary/5">
                        XEM TRÊN BẢN ĐỒ <ArrowUpRight size={12} />
                      </button>
                   )}
                </div>
             </div>
          ))}
       </div>

       <div className="pt-16 border-t border-gray-100 space-y-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic">Theo dõi chúng tôi trên nền tảng số</p>
          <div className="flex gap-4">
             {socials.map((social, i) => (
                <a key={i} href={social.href} className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-sm group hover:scale-110">
                   {social.icon}
                </a>
             ))}
          </div>
       </div>

       {/* Map Placeholder Container */}
       <div className="relative aspect-video rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-premium group/map">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-10 transition-opacity duration-1000" />
          <div className="absolute inset-0 flex items-center justify-center p-12 text-center flex-col gap-4">
             <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <MapPin size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic group-hover/map:text-primary transition-colors">NOVAKIT HUB - ĐỊA CHỈ HÀNG ĐẦU</p>
          </div>
       </div>
    </div>
  )
}

export default ContactInfo
