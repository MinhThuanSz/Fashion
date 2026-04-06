import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react'
import { UI_TEXT } from '../constants/text'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: UI_TEXT.footer.shop,
      links: [
        { label: UI_TEXT.common.products, href: '/products' },
        { label: UI_TEXT.common.clothing, href: '/products?category=clothing' },
        { label: UI_TEXT.common.shoes, href: '/products?category=shoes' },
        { label: UI_TEXT.common.newArrivals, href: '/products?sort=newest' },
        { label: 'Thương hiệu', href: '/#brands' },
      ]
    },
    {
      title: UI_TEXT.footer.support,
      links: [
        { label: 'Theo dõi đơn hàng', href: '/profile?tab=orders' },
        { label: 'Đổi trả & Hoàn tiền', href: '/support/returns' },
        { label: 'Thông tin vận chuyển', href: '/support/shipping' },
        { label: 'Bảng quy đổi kích cỡ', href: '/support/size-guide' },
        { label: 'Câu hỏi thường gặp (FAQs)', href: '/support/faqs' },
      ]
    },
    {
      title: UI_TEXT.footer.company,
      links: [
        { label: 'Về chúng tôi', href: '/about' },
        { label: 'Cơ hội nghề nghiệp', href: '/careers' },
        { label: 'Tìm kiếm cửa hàng', href: '/stores' },
        { label: 'Số tay thời trang (Blog)', href: '/blog' },
        { label: 'Liên hệ', href: '/contact' },
      ]
    }
  ]

  const socials = [
    { icon: <Instagram size={18} />, href: 'https://instagram.com' },
    { icon: <Twitter size={18} />, href: 'https://twitter.com' },
    { icon: <Facebook size={18} />, href: 'https://facebook.com' },
    { icon: <Youtube size={18} />, href: 'https://youtube.com' },
  ]

  return (
    <footer className="bg-white pt-32 pb-16 border-t border-gray-100/50">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          {/* Logo & Contact */}
          <div className="flex flex-col gap-10">
            <Link to="/" className="text-3xl font-outfit font-bold tracking-tight text-black flex items-center gap-3 group">
                <span className="bg-primary text-white w-12 h-12 flex items-center justify-center rounded-2xl leading-none shadow-premium font-black italic transform -rotate-12 group-hover:rotate-0 transition-transform">N</span>
                <span className="uppercase tracking-[0.1em] text-2xl font-black">Nova<span className="text-primary italic">Kit</span></span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs font-bold italic opacity-80">
              {UI_TEXT.footer.description}
            </p>
            <div className="space-y-6 pt-2">
              <ContactItem icon={<Mail size={20} />} text="support@novakit.com" />
              <ContactItem icon={<Phone size={20} />} text="+84 (24) 8888-999" />
              <ContactItem icon={<MapPin size={20} />} text="NovaKit Hub, Quận 1, TP. HCM" />
            </div>
          </div>

          {/* Nav Links */}
          {footerLinks.map((section) => (
             <div key={section.title}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-gray-300 italic border-b border-gray-50 pb-5">
                  {section.title}
                </h4>
                <ul className="space-y-6">
                   {section.links.map((link) => (
                     <li key={link.label}>
                       <Link to={link.href} className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all hover:translate-x-3 inline-block duration-500 italic">
                         {link.label}
                       </Link>
                     </li>
                   ))}
                </ul>
             </div>
          ))}
        </div>

        {/* Newsletter & Bottom */}
        <div className="pt-20 border-t border-gray-100 flex flex-col xl:flex-row items-center justify-between gap-16">
           <div className="flex flex-col gap-8 w-full xl:w-auto">
              <div className="space-y-3">
                 <p className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-3">
                   {UI_TEXT.footer.subscribe} <Send size={16} />
                 </p>
                 <p className="text-[10px] text-gray-300 font-bold italic uppercase tracking-widest">Gia nhập cộng đồng NovaKit bùng nổ xu hướng</p>
              </div>
              <form className="flex gap-3 max-w-md w-full">
                 <input 
                  type="email" 
                  placeholder={UI_TEXT.footer.subscribePlaceholder} 
                  className="bg-gray-50 px-8 py-5 rounded-[2rem] text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none w-full shadow-sm border border-transparent focus:border-primary/10 italic"
                 />
                 <button type="submit" className="bg-black text-white px-10 h-16 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-black/10 active:scale-95 italic">
                    {UI_TEXT.footer.join}
                 </button>
              </form>
           </div>

           <div className="flex flex-col items-center xl:items-end gap-10">
              <div className="flex items-center gap-4">
                 {socials.map((social, i) => (
                    <a key={i} href={social.href} className="w-14 h-14 flex items-center justify-center bg-gray-50 hover:bg-primary hover:text-white text-gray-300 rounded-[1.5rem] transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/20 hover:scale-110">
                       {social.icon}
                    </a>
                 ))}
              </div>
              <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.3em] text-center xl:text-right italic max-w-sm leading-relaxed">
                 &copy; {currentYear} NovaKit Fashion Hub. {UI_TEXT.footer.rights}
              </p>
           </div>
        </div>
      </div>
    </footer>
  )
}

function ContactItem({ icon, text }) {
  return (
    <div className="flex items-start gap-5 group text-gray-400 hover:text-black transition-colors cursor-pointer">
      <div className="mt-0.5 text-gray-200 group-hover:text-primary transition-colors transform group-hover:scale-110">
         {React.cloneElement(icon, { size: 18 })}
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] italic leading-relaxed">{text}</span>
    </div>
  )
}

export default Footer
