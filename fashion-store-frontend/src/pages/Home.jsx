import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Zap, Award, ShieldCheck, Heart, Sparkles, TrendingUp, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { UI_TEXT } from '../constants/text'
import products from '../data/products'
import ProductCard from '../components/product/ProductCard'

const Home = () => {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4)
  const newArrivals = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4)

  const categories = [
    { title: UI_TEXT.common.clothing, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800', path: '/products?category=clothing', badge: 'New Styles' },
    { title: UI_TEXT.common.shoes, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800', path: '/products?category=shoes', badge: 'Nova Drops' },
    { title: UI_TEXT.common.accessories, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', path: '/products?category=accessories', badge: 'Essential' },
  ]

  const features = [
    { icon: <Zap size={32} />, title: 'Bùng nổ phong cách', desc: 'Slogan: Chạm đỉnh phong cách nova cùng NovaKit.', color: 'bg-primary/10 text-primary' },
    { icon: <Award size={32} />, title: 'Chất lượng tinh tuyển', desc: 'Mọi đường kim mũi chỉ đều được chế tác với sự tỉ mỉ tối đa.', color: 'bg-secondary/10 text-secondary' },
    { icon: <ShieldCheck size={32} />, title: 'Bảo mật tuyệt đối', desc: 'Giao dịch và thông tin khách hàng được bảo vệ 100%.', color: 'bg-green-50 text-green-500' },
  ]

  return (
    <div className="space-y-40 pb-40 animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[110vh] min-h-[900px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>

        <div className="container-custom relative z-10 text-white">
           <motion.div 
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="max-w-4xl space-y-12"
           >
              <div className="flex items-center gap-6">
                <span className="inline-block px-8 py-3 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl shadow-primary/40 italic animate-slow-pulse">
                   {UI_TEXT.home.heroBadge}
                </span>
                <div className="w-16 h-px bg-white/40"></div>
                <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.4em] italic">NovaKit - Bứt phá mọi giới hạn</span>
              </div>
              
              <h1 className="text-8xl md:text-[14rem] font-black font-outfit leading-[0.8] tracking-tighter italic uppercase" dangerouslySetInnerHTML={{ __html: UI_TEXT.home.heroTitle }}>
              </h1>

              <div className="flex flex-col md:flex-row md:items-center gap-10">
                 <p className="text-xl md:text-2xl text-gray-300 max-w-xl leading-relaxed font-bold italic opacity-90">
                    {UI_TEXT.home.heroSub}
                 </p>
                 <div className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] hidden lg:flex flex-col gap-2 group hover:bg-primary/10 hover:border-primary transition-all duration-700 shadow-2xl">
                    <Sparkles className="text-primary mb-2 animate-bounce" size={24} />
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Ưu đãi Nova Membership</p>
                    <p className="text-sm font-black text-white italic tracking-tighter">Giảm ngay 20% cho thành viên mới</p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-10 pt-10">
                <Link to="/products" className="btn bg-primary text-white hover:bg-primary-hover px-16 h-28 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-5 group/btn italic">
                   {UI_TEXT.home.shopNow} <ArrowRight size={24} className="group-hover/btn:translate-x-3 transition-transform duration-500" />
                </Link>
                <Link to="/products?category=shoes" className="btn bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black px-12 h-28 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-5 group/btn2 italic">
                   {UI_TEXT.home.viewFootwear} <Zap size={22} className="group-hover/btn2:rotate-12 transition-transform duration-500" />
                </Link>
              </div>
           </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30 font-black text-[9px] uppercase tracking-[0.5em] italic">
           CUỘN XUỐNG KHÁM PHÁ
           <div className="w-1 h-20 bg-white/10 rounded-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-primary rounded-full animate-bounce"></div>
           </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -15 }}
              className="p-16 rounded-[4.5rem] bg-gray-50/50 border border-transparent hover:border-primary/10 transition-all duration-700 shadow-sm hover:shadow-premium group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
              <div className={`${feature.color} w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 shadow-xl group-hover:rotate-12 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{feature.title}</h3>
              <p className="text-gray-400 font-bold italic leading-relaxed text-sm opacity-80 uppercase tracking-widest">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container-custom space-y-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-gray-100 pb-16 relative overflow-hidden group">
           <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">THẾ GIỚI NOVAKIT</span>
                 <div className="w-12 h-px bg-primary/20"></div>
              </div>
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic skew-x-[-2deg] leading-none">{UI_TEXT.home.popularCategories}</h2>
              <p className="text-gray-400 font-black italic uppercase tracking-[0.3em] opacity-40">Mỗi thiết kế là một tuyên ngôn cá tính bùng nổ</p>
           </div>
           <Link to="/products" className="flex items-center gap-5 px-14 h-24 bg-black text-white hover:bg-primary rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 italic group/all">
              {UI_TEXT.home.viewAll} <ArrowRight size={22} className="group-hover/all:translate-x-3 transition-transform duration-500" />
           </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map((cat, index) => (
            <Link key={index} to={cat.path} className="group relative aspect-[3/4] overflow-hidden rounded-[4rem] shadow-premium hover:shadow-2xl transition-all duration-1000">
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent"></div>
              <div className="absolute top-8 right-8">
                 <span className="px-6 py-3 bg-white/20 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0 italic">
                    {cat.badge}
                 </span>
              </div>
              <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between translate-y-4 group-hover:translate-y-0 transition-all duration-1000">
                <div className="space-y-4">
                  <h3 className="text-white text-5xl font-black uppercase italic tracking-tighter leading-none">{cat.title}</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic group-hover:text-primary transition-colors">KHÁM PHÁ NGAY</p>
                </div>
                <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform shadow-2xl">
                   <ArrowRight size={28} className="text-black group-hover:text-primary transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-custom space-y-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-gray-100 pb-16">
          <div className="space-y-8">
             <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">NOVA HIGHLIGHTS</span>
                <div className="w-12 h-px bg-secondary/20"></div>
             </div>
             <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">{UI_TEXT.home.featuredProducts}</h2>
          </div>
          <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-[2rem] border border-gray-100 h-20 items-center overflow-x-auto scrollbar-hide shadow-inner">
             <button className="px-10 h-14 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-black/10 scale-105 active:scale-95 italic transition-all italic">Hàng Bán Chạy</button>
             <button className="px-10 h-14 text-gray-300 hover:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 italic transition-all italic">Giảm Giá</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals with Banner */}
      <section className="bg-black py-48 mx-4 rounded-[6rem] relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-[3s]">
            <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover blur-2xl" />
         </div>
         <div className="container-custom relative z-10 space-y-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 text-white border-b border-white/5 pb-20">
               <div className="space-y-8">
                  <h3 className="text-6xl md:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">{UI_TEXT.home.newArrivals}</h3>
                  <div className="flex items-center gap-6">
                     <div className="w-32 h-1 bg-primary"></div>
                     <p className="text-lg text-white/50 font-bold italic tracking-widest uppercase">NovaKit Drops - Bùng nổ xu hướng</p>
                  </div>
               </div>
               <Link to="/products?sort=newest" className="group flex items-center gap-8 bg-white/5 backdrop-blur-md p-6 pr-10 rounded-full border border-white/10 hover:bg-white hover:text-black hover:border-white transition-all duration-700">
                  <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center font-black italic shadow-2xl group-hover:rotate-45 transition-transform group-hover:bg-primary group-hover:text-white">NOV</div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Xem tất cả hàng mới</p>
               </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20">
               {newArrivals.map(product => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>
         </div>
      </section>

      {/* Loyalty/Experience Tip */}
      <section className="container-custom py-20 relative">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative aspect-square lg:aspect-video rounded-[4rem] overflow-hidden shadow-premium group">
               <img src="https://images.unsplash.com/photo-1542062700-9b61ccbc1696?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2s]" />
               <div className="absolute inset-x-8 bottom-8 p-12 bg-white/95 backdrop-blur-xl rounded-[3rem] border border-gray-100 shadow-2xl group-hover:translate-y-[-20px] transition-transform duration-1000">
                  <div className="flex items-center gap-6 mb-6">
                     <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg"><Heart size={24} /></div>
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Ưu quyền tối thượng</p>
                  </div>
                  <h4 className="text-3xl font-black italic uppercase italic tracking-tighter mb-4">Hội viên đặc quyền NovaKit</h4>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed italic">Trải nghiệm dịch vụ chăm sóc hoàn hảo, ưu đãi sinh nhật và quyền truy cập sớm các bộ sưu tập giới hạn.</p>
               </div>
            </div>
            <div className="space-y-16">
               <div className="flex items-start gap-12 group/item transition-all duration-700 hover:ml-6">
                   <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-xl group-hover/item:rotate-12">01</div>
                   <div className="space-y-4">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter">Đặt hàng NovaKit</h4>
                      <p className="text-[10px] font-black italic uppercase tracking-[0.3em] text-gray-400 leading-relaxed uppercase">Quy trình chọn lọc và thanh toán được tinh giản tối đa cho trải nghiệm mượt mà.</p>
                   </div>
               </div>
               <div className="flex items-start gap-12 group/item transition-all duration-700 hover:ml-6">
                   <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shrink-0 group-hover/item:bg-secondary group-hover/item:text-white transition-all shadow-xl group-hover/item:rotate-12">02</div>
                   <div className="space-y-4">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter">Nhận diện phong cách</h4>
                      <p className="text-[10px] font-black italic uppercase tracking-[0.3em] text-gray-400 leading-relaxed uppercase">Hệ thống gợi ý thông minh dựa trên sở thích và xu hướng mới nhất từ NovaKit.</p>
                   </div>
               </div>
               <div className="flex items-start gap-12 group/item transition-all duration-700 hover:ml-6">
                   <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shrink-0 group-hover/item:bg-black group-hover/item:text-white transition-all shadow-xl group-hover/item:rotate-12">03</div>
                   <div className="space-y-4">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter">Bùng nổ cộng đồng</h4>
                      <p className="text-[10px] font-black italic uppercase tracking-[0.3em] text-gray-400 leading-relaxed uppercase">Chia sẻ phong cách của bạn và truyền cảm hứng cho hàng ngàn người yêu thời trang.</p>
                   </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}

export default Home
