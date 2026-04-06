import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { products } from '../data/products'
import { ChevronDown, Search, X, SlidersHorizontal, Package, ArrowUp, ArrowRight } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useDebounce } from '../hooks/useDebounce'
import ProductCard from '../components/product/ProductCard'
import FilterSidebar from '../components/product/FilterSidebar'
import { UI_TEXT } from '../constants/text'

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  // Infinite Scroll State
  const [visibleItems, setVisibleItems] = useState(6)
  const { ref, inView } = useInView({ threshold: 0 })

  // Filters logic from query params
  const categoryFilter = searchParams.get('category') || 'all'
  const brandFilter = searchParams.get('brand') || 'all'

  useEffect(() => {
    if (inView && visibleItems < filteredProducts.length) {
       setVisibleItems(prev => Math.min(prev + 4, filteredProducts.length))
    }
  }, [inView])

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesBrand = brandFilter === 'all' || p.brand.toLowerCase() === brandFilter.toLowerCase()
    const matchesSearch = !debouncedSearch || p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || p.brand.toLowerCase().includes(debouncedSearch.toLowerCase())
    return matchesCategory && matchesBrand && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    return 0
  })

  // Synchronize sortBy state with query param
  useEffect(() => {
     const sort = searchParams.get('sort')
     if (sort && sort !== sortBy) {
       setSortBy(sort)
     }
  }, [searchParams])

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleItems(6)
  }, [categoryFilter, brandFilter, sortBy, debouncedSearch])

  // Content based on Category
  const getHeaderContent = () => {
     if (categoryFilter === 'clothing') {
        return {
           title: UI_TEXT.common.clothing,
           desc: UI_TEXT.products.clothingDesc,
           image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200'
        }
     }
     if (categoryFilter === 'shoes') {
        return {
           title: UI_TEXT.common.shoes,
           desc: UI_TEXT.products.shoesDesc,
           image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1200'
        }
     }
     if (sortBy === 'newest') {
        return {
           title: UI_TEXT.products.newArrivalsTitle,
           desc: UI_TEXT.products.newArrivalsDesc,
           image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200'
        }
     }
     return {
        title: UI_TEXT.products.title,
        desc: 'Khám phá thế giới thời trang cao cấp với bộ sưu tập tinh tuyển nhất sàn lọc từ những tinh hoa đương đại.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1200'
     }
  }

  const { title, desc, image } = getHeaderContent()

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-12 border-b border-gray-100 pb-4">
           <Link to="/">{UI_TEXT.common.home}</Link>
           <ChevronDown size={10} className="-rotate-90" />
           <span className="text-black not-italic">{UI_TEXT.common.products}</span>
           {categoryFilter !== 'all' && (
              <>
                 <ChevronDown size={10} className="-rotate-90" />
                 <span className="text-black not-italic">{categoryFilter === 'clothing' ? UI_TEXT.common.clothing : UI_TEXT.common.shoes}</span>
              </>
           )}
        </div>

        {/* Dynamic Category/Sort Banner */}
        <div className="relative rounded-[4rem] overflow-hidden mb-24 min-h-[400px] flex flex-col justify-center px-12 md:px-24 group border border-gray-100 shadow-2xl">
           <div className="absolute inset-0 z-0">
              <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] grayscale-0 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
           </div>
           <div className="relative z-10 max-w-xl space-y-6 text-white animate-fade-in">
              <div className="w-12 h-1 bg-white/30 mb-4"></div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-10 overflow-hidden line-clamp-2">{title}</h1>
              <p className="text-lg text-gray-300 font-medium italic leading-relaxed animate-slide-up">
                 {desc}
              </p>
           </div>
        </div>

        {/* Search & Sorting Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 border-b border-gray-100/50 pb-16">
           <div className="space-y-4">
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2 italic">
                 <Package size={14} /> {UI_TEXT.products.showing.replace('{count}', filteredProducts.length)}
              </p>
           </div>

           <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="flex items-center bg-gray-50/50 border border-gray-100/50 rounded-[2rem] px-6 py-4 w-full sm:w-80 group focus-within:ring-2 focus-within:ring-black/5 focus-within:bg-white transition-all shadow-sm">
                 <Search size={18} className="text-gray-400 group-focus-within:text-black" />
                 <input 
                    type="text" 
                    placeholder={UI_TEXT.header.searchPlaceholder} 
                    className="bg-transparent border-none focus:outline-none ml-2 text-xs font-medium w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && <button onClick={() => setSearchTerm('')}><X size={14} /></button>}
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <select 
                   value={sortBy}
                   onChange={(e) => {
                      const newSort = e.target.value
                      setSortBy(newSort)
                      setSearchParams({ ...Object.fromEntries(searchParams), sort: newSort })
                   }}
                   className="flex-grow sm:flex-grow-0 bg-gray-50/50 border border-gray-100/50 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm outline-none cursor-pointer focus:border-black transition-all appearance-none"
                 >
                    <option value="newest">{UI_TEXT.products.sortNewest}</option>
                    <option value="price-low">{UI_TEXT.products.sortPriceLow}</option>
                    <option value="price-high">{UI_TEXT.products.sortPriceHigh}</option>
                    <option value="popular">{UI_TEXT.products.sortPopular}</option>
                 </select>
                 <button 
                   onClick={() => setIsFilterOpen(true)}
                   className="lg:hidden p-4 bg-black text-white rounded-2xl shadow-xl shadow-black/10"
                 >
                    <SlidersHorizontal size={20} />
                 </button>
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
           {/* Sidebar Filters */}
           <div className="hidden lg:block shrink-0">
              <FilterSidebar 
                 categoryFilter={categoryFilter}
                 setCategoryFilter={(cat) => setSearchParams({ ...Object.fromEntries(searchParams), category: cat })}
                 brandFilter={brandFilter}
                 setBrandFilter={(brand) => setSearchParams({ ...Object.fromEntries(searchParams), brand: brand })}
              />
           </div>

           {/* Product Grid */}
           <div className="flex-grow space-y-20">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
                     {filteredProducts.slice(0, visibleItems).map((product) => (
                        <ProductCard key={product.id} product={product} />
                     ))}
                  </div>

                  {/* Intersection Anchor */}
                  <div ref={ref} className="h-20 flex items-center justify-center">
                      {visibleItems < filteredProducts.length && (
                         <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
                      )}
                  </div>
                </>
              ) : (
                <div className="py-48 text-center space-y-10 bg-gray-50/30 rounded-[4rem] border-2 border-dashed border-gray-100 transition-all duration-1000 rotate-[0.5deg]">
                   <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto text-gray-200 shadow-xl shadow-gray-100/50 -rotate-[0.5deg] border border-gray-50">
                      <Search size={64} strokeWidth={1} />
                   </div>
                   <div className="space-y-4">
                    <h3 className="text-4xl font-black uppercase italic tracking-wider">{UI_TEXT.common.noResults}</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest italic max-w-xs mx-auto leading-relaxed">
                       Chúng tôi không tìm thấy kết quả phù hợp. Thử thay đổi từ khóa hoặc bộ lọc để khám phá thêm.
                    </p>
                   </div>
                   <button 
                    onClick={() => { setSearchParams({}); setSearchTerm(''); }}
                    className="btn bg-black text-white px-16 h-20 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/10 hover:scale-105 active:scale-95 transition-all"
                   >
                     {UI_TEXT.products.clearFilters}
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
           <div className="absolute bottom-0 left-0 right-0 h-[85vh] bg-white rounded-t-[3rem] p-10 overflow-y-auto animate-slide-up shadow-2xl">
              <div className="flex items-center justify-between mb-12 border-b border-gray-50 pb-8">
                 <h2 className="text-3xl font-black uppercase tracking-widest italic">{UI_TEXT.common.filter}</h2>
                 <button onClick={() => setIsFilterOpen(false)} className="p-4 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all"><X size={24} /></button>
              </div>
              <FilterSidebar 
                  categoryFilter={categoryFilter}
                  setCategoryFilter={(cat) => setSearchParams({ ...Object.fromEntries(searchParams), category: cat })}
                  brandFilter={brandFilter}
                  setBrandFilter={(brand) => setSearchParams({ ...Object.fromEntries(searchParams), brand: brand })}
              />
              <div className="mt-12 flex gap-4 sticky bottom-0 bg-white pt-6 border-t border-gray-100">
                  <button onClick={() => { setSearchParams({}); setIsFilterOpen(false); }} className="flex-grow btn px-6 py-5 rounded-2xl border border-gray-100 font-bold uppercase tracking-widest text-[10px]">LÀM MỚI</button>
                  <button onClick={() => setIsFilterOpen(false)} className="flex-grow btn bg-black text-white px-6 py-5 rounded-2xl font-black italic shadow-xl shadow-black/10 uppercase tracking-widest text-xs">ÁP DỤNG</button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}

export default ProductList
