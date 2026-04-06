import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, ShieldCheck, Zap, Heart, TrendingUp, Users, ShoppingBag } from 'lucide-react'
import { UI_TEXT } from '../constants/text'

const AboutPage = () => {
  const stats = [
    { label: 'Khách hàng thân thiết', value: '50K+', icon: <Users size={24} /> },
    { label: 'Sản phẩm cao cấp', value: '1.2K+', icon: <ShoppingBag size={24} /> },
    { label: 'Showroom toàn quốc', value: '12', icon: <Star size={24} /> },
    { label: 'Đánh giá 5 sao', value: '15K+', icon: <TrendingUp size={24} /> },
  ]

  const values = [
    { 
       title: UI_TEXT.about.quality, 
       desc: UI_TEXT.about.qualitySub, 
       icon: <ShieldCheck size={32} /> 
    },
    { 
       title: UI_TEXT.about.design, 
       desc: UI_TEXT.about.designSub, 
       icon: <Zap size={32} /> 
    },
    { 
       title: UI_TEXT.about.service, 
       desc: UI_TEXT.about.serviceSub, 
       icon: <Heart size={32} /> 
    },
  ]

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920" 
            alt="About Hero" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        </div>

        <div className="container-custom relative z-10 text-white">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="max-w-3xl space-y-8"
           >
              <div className="flex items-center gap-4">
                 <span className="inline-block px-5 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.4em] border border-primary/20 italic shadow-xl shadow-primary/20">
                   NOVAKIT HUB
                 </span>
                 <div className="w-12 h-px bg-white/20"></div>
              </div>
              <h1 className="text-6xl md:text-9xl font-black font-outfit leading-[0.9] tracking-tighter italic uppercase" dangerouslySetInnerHTML={{ __html: UI_TEXT.about.heroTitle }}>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl leading-relaxed font-medium italic">
                {UI_TEXT.about.heroSub}
              </p>
           </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container-custom py-40">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                  <span className="text-xs font-black text-primary uppercase tracking-[0.4em] italic border-b border-primary/10 pb-2 inline-block">Sứ mệnh NovaKit</span>
                  <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight italic skew-x-[-2deg]">{UI_TEXT.about.visionTitle}</h2>
               </div>
               <p className="text-lg text-gray-500 font-medium leading-relaxed italic border-l-4 border-primary pl-8 py-4">
                  {UI_TEXT.about.visionSub}
               </p>
               <div className="pt-8 space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 italic">{UI_TEXT.about.coreValues}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {values.map((v, i) => (
                        <div key={i} className="group p-8 bg-gray-50 rounded-[2.5rem] border border-gray-50 hover:border-primary/10 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-premium">
                           <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-all shadow-lg shadow-primary/20">
                              {v.icon}
                           </div>
                           <h5 className="font-black text-sm uppercase tracking-widest mb-2">{v.title}</h5>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">{v.desc}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="relative">
               <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10">
                  <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-primary/5 rounded-[4rem] -z-0 hidden md:block border border-primary/10"></div>
               <div className="absolute top-1/2 -left-20 -translate-y-1/2 p-10 bg-black text-white border-2 border-primary/10 rounded-[3rem] shadow-2xl hidden xl:block z-20 hover:scale-105 transition-transform duration-700">
                  <p className="text-5xl font-black font-outfit italic tracking-tighter mb-1 text-primary">10+</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Năm phát triển</p>
               </div>
            </div>
         </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-black py-40 mx-4 rounded-[5rem] relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]">
            <img src="https://images.unsplash.com/photo-1470309232475-699adba53576?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover blur-2xl" />
         </div>
         <div className="container-custom relative z-10">
            <div className="text-center mb-24 space-y-4">
                <span className="text-xs font-black text-primary uppercase tracking-[0.5em] italic">{UI_TEXT.about.statsTitle}</span>
                <div className="w-20 h-1 bg-primary/30 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-20">
               {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center gap-6 text-center group/stat"
                  >
                     <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center text-white border border-white/10 group-hover/stat:bg-primary group-hover/stat:text-white group-hover/stat:border-primary transition-all duration-700 shadow-2xl">
                        {stat.icon}
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-5xl font-black font-outfit text-white tracking-tighter italic">{stat.value}</h4>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">{stat.label}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* History Timeline */}
      <section className="container-custom py-48">
         <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-10 mb-32">
            <span className="text-xs font-black text-primary uppercase tracking-[0.4em] italic border-b border-primary/10 pb-2">{UI_TEXT.about.historyTitle}</span>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight italic skew-x-[-2deg]">{UI_TEXT.about.historySub}</h2>
         </div>

         <div className="space-y-32">
            {[
              { year: '2016', title: 'Khởi đầu tại Sài Gòn', content: 'NovaKit được thành lập với mục tiêu mang đến phong cách thời trang năng động và rực rỡ xu hướng cho giới trẻ sành điệu.', image: 'https://images.unsplash.com/photo-1542062700-9b61ccbc1696?auto=format&fit=crop&q=80&w=1200' },
              { year: '2019', title: 'Nâng tầm chất liệu', content: 'Thương hiệu vươn ra thế giới, hợp tác với các nhà cung cấp từ Nhật Bản và Châu Âu để nâng cấp chất liệu sản phẩm.', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200' },
              { year: '2023', title: 'Kỷ nguyên NovaKit', content: 'Ra mắt hệ thống NovaKit Hub hiện đại và nền tảng mua sắm kết nối phong cách cá nhân.', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200' },
            ].map((step, i) => (step.image && (
              <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-20 items-center group`}>
                 <div className="flex-grow aspect-[16/9] md:aspect-square lg:aspect-video rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-premium overflow-hidden">
                    <img src={step.image} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                 </div>
                 <div className="max-w-lg space-y-8">
                    <div className="text-7xl font-black font-outfit text-gray-100 italic group-hover:text-primary transition-colors duration-1000 leading-none">{step.year}</div>
                    <div className="space-y-4">
                       <h3 className="text-3xl font-black uppercase tracking-tighter italic">{step.title}</h3>
                       <p className="text-gray-500 font-medium italic leading-relaxed">{step.content}</p>
                    </div>
                 </div>
              </div>
            )))}
         </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom pb-48">
         <div className="relative rounded-[4rem] overflow-hidden bg-white py-32 px-12 md:px-24 shadow-2xl border border-gray-100 group">
            <div className="absolute inset-x-0 bottom-0 h-full bg-primary/5 -z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-1000"></div>
            <div className="flex flex-col items-center text-center space-y-12">
               <h2 className="text-5xl md:text-8xl font-black text-black leading-[0.95] tracking-tighter uppercase italic py-4">
                  Sẵn sàng gia nhập <br /> <span className="text-primary group-hover:text-black transition-colors duration-1000 uppercase">thế giới novakit?</span>
               </h2>
               <Link to="/products" className="btn bg-black text-white hover:bg-primary px-16 h-24 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 italic group/btn">
                  {UI_TEXT.about.viewProducts} <ArrowRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  )
}

export default AboutPage
