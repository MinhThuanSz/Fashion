import React from 'react'
import { Filter, X, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { UI_TEXT } from '../../constants/text'

const FilterSidebar = ({ categoryFilter, setCategoryFilter, brandFilter, setBrandFilter }) => {
  const categories = [
    { key: 'all', label: UI_TEXT.common.all },
    { key: 'clothing', label: UI_TEXT.common.clothing },
    { key: 'shoes', label: UI_TEXT.common.shoes },
    { key: 'accessories', label: UI_TEXT.common.accessories }
  ]
  
  const brandsArr = ['all', 'Nike', 'Adidas', 'Jordan', 'Zara', 'Uniqlo']

  return (
    <aside className="w-full lg:w-80 space-y-20 shrink-0 sticky top-32">
      <Section title={UI_TEXT.products.category}>
        <div className="flex flex-col gap-3">
          {categories.map(cat => (
            <button 
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`flex items-center justify-between py-4 px-6 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all group relative overflow-hidden ${categoryFilter === cat.key ? 'bg-black text-white shadow-xl shadow-black/10 scale-105' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
            >
               <span className="flex items-center gap-4 relative z-10 italic">
                  <div className={`w-2 h-2 rounded-full transition-all duration-700 ${categoryFilter === cat.key ? 'bg-white w-6' : 'bg-gray-200 group-hover:bg-black group-hover:w-4'}`}></div>
                  {cat.label}
               </span>
               <ChevronRight size={14} className={`relative z-10 transition-transform duration-500 ${categoryFilter === cat.key ? 'translate-x-0 rotate-90' : '-translate-x-4 opacity-0'}`} />
            </button>
          ))}
        </div>
      </Section>

      <Section title={UI_TEXT.products.brand}>
        <div className="flex flex-wrap gap-3">
           {brandsArr.map(brand => (
             <button 
               key={brand}
               onClick={() => setBrandFilter(brand)}
               className={`px-8 h-14 rounded-2xl text-[9px] font-black uppercase tracking-widest border-2 transition-all duration-500 ${brandFilter === brand ? 'bg-black text-white border-black shadow-xl shadow-black/10 scale-110 rotate-2' : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
             >
                {brand === 'all' ? 'TẤT CẢ' : brand}
             </button>
           ))}
        </div>
      </Section>

      <Section title={UI_TEXT.products.priceRange}>
         <div className="space-y-8 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-50 shadow-inner group">
            <div className="h-2 bg-gray-200/50 rounded-full relative overflow-hidden">
               <div className="absolute inset-y-0 left-[10%] right-[30%] bg-black transition-all group-hover:shadow-[0_0_10px_rgba(0,0,0,0.2)]"></div>
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
               <span className="italic">Min: 0đ</span>
               <span className="italic">Max: 5.0M+</span>
            </div>
         </div>
      </Section>

      <Section title={UI_TEXT.products.size}>
         <div className="grid grid-cols-4 gap-3">
            {['S', 'M', 'L', 'XL', '38', '39', '40', '41'].map(size => (
               <button key={size} className="w-12 h-12 rounded-2xl border-2 border-gray-50 bg-gray-50 text-gray-400 flex items-center justify-center text-[10px] font-black hover:bg-black hover:text-white hover:border-black transition-all duration-500 active:scale-95 shadow-sm">
                  {size}
               </button>
            ))}
         </div>
      </Section>

      {/* Luxury Message */}
      <div className="p-10 rounded-[3rem] bg-black text-white space-y-6 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
         <div className="flex items-center gap-4 relative z-10">
            <ShieldCheck size={32} strokeWidth={1} className="text-primary" />
            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] font-outfit leading-none italic">Đảm bảo <br /> Chính hãng</h5>
         </div>
         <p className="text-[10px] font-medium text-gray-400 italic leading-relaxed relative z-10 uppercase tracking-widest leading-[1.8]">Mọi món quà từ NovaKit đều đi kèm giấy chứng nhận nguồn gốc xuất xứ cao cấp.</p>
      </div>
    </aside>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex items-center gap-5">
          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-black italic leading-none shrink-0">{title}</h4>
          <div className="h-px bg-gray-100 w-full mb-0.5"></div>
       </div>
       {children}
    </div>
  )
}

export default FilterSidebar
