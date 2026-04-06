import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, ShoppingBag, Users, 
  BarChart3, Settings, LogOut, Menu, X, 
  Bell, Search, ChevronRight, Package, Tag,
  ShieldCheck, ArrowRight
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { UI_TEXT } from '../constants/text'

const AdminLayout = () => {
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  // Use effect to close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const menuItems = [
    { title: UI_TEXT.admin.dashboard, path: '/admin', icon: <LayoutDashboard size={22} /> },
    { title: UI_TEXT.admin.products, path: '/admin/products', icon: <ShoppingBag size={22} /> },
    { title: UI_TEXT.admin.orders, path: '/admin/orders', icon: <Package size={22} /> },
    { title: 'Người dùng', path: '/admin/users', icon: <Users size={22} /> },
    { title: 'Thương hiệu', path: '/admin/brands', icon: <Tag size={22} /> },
    { title: UI_TEXT.admin.analytics, path: '/admin/analytics', icon: <BarChart3 size={22} /> },
    { title: 'Cài đặt hệ thống', path: '/admin/settings', icon: <Settings size={22} /> },
  ]

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
  }

  // Derived states for classes
  const sidebarWidthClass = isDesktopExpanded ? 'w-[300px]' : 'w-[100px]'
  
  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-outfit text-white">
      
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside 
        className={`fixed lg:relative z-50 h-screen bg-[#070707] border-r border-white/5 shadow-2xl flex flex-col transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0 w-[300px]' : '-translate-x-full lg:translate-x-0 ' + sidebarWidthClass}
        `}
      >
        {/* Sidebar Header / Logo */}
        <div className={`h-[120px] flex items-center border-b border-white/5 relative overflow-hidden transition-all duration-300 ${isDesktopExpanded || isMobileOpen ? 'px-8 justify-start' : 'px-0 justify-center'}`}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           
           <Link to="/admin" className="flex items-center gap-4 relative z-10 w-full group">
              <div className="min-w-[48px] h-12 bg-primary text-white flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20 font-black italic -rotate-6 group-hover:rotate-0 transition-transform">N</div>
              
              <div className={`flex flex-col transition-all duration-300 whitespace-nowrap overflow-hidden ${isDesktopExpanded || isMobileOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0'}`}>
                <span className="uppercase tracking-[0.1em] text-xl font-black text-white">Nova<span className="text-primary italic">Kit</span></span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary italic leading-none mt-1">QUẢN TRỊ</span>
              </div>
           </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link 
                key={item.path} 
                to={item.path}
                title={!isDesktopExpanded && !isMobileOpen ? item.title : ''}
                className={`flex items-center rounded-2xl transition-all group overflow-hidden relative cursor-pointer
                  ${isDesktopExpanded || isMobileOpen ? 'px-5 py-4' : 'justify-center py-5'} 
                  ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                  <div className="relative z-10 min-w-[22px] flex items-center justify-center">
                    {item.icon}
                  </div>
                  
                  <div className={`flex items-center justify-between transition-all duration-300 whitespace-nowrap overflow-hidden
                    ${isDesktopExpanded || isMobileOpen ? 'opacity-100 w-full ml-5' : 'opacity-0 w-0'}
                  `}>
                     <span className="text-[11px] font-black uppercase tracking-widest italic">{item.title}</span>
                     {isActive && <ChevronRight size={14} className="opacity-100" />}
                  </div>

                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60 opacity-100 z-0 pointer-events-none"></div>}
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 bg-[#070707]/80 backdrop-blur-xl">
           <button 
             onClick={handleLogout}
             title={!isDesktopExpanded && !isMobileOpen ? 'Đăng xuất' : ''}
             className={`w-full flex items-center text-red-400 hover:text-red-500 hover:bg-red-50/5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest italic border border-transparent hover:border-red-50/10 
               ${isDesktopExpanded || isMobileOpen ? 'p-5 gap-4 justify-start' : 'p-5 justify-center'}
             `}
           >
              <div className="min-w-[20px] flex items-center justify-center"><LogOut size={20} /></div>
              <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isDesktopExpanded || isMobileOpen ? 'opacity-100 w-auto ml-1' : 'opacity-0 w-0'}`}>
                 ĐĂNG XUẤT
              </span>
           </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="flex-1 flex flex-col min-w-0 h-screen relative transition-all duration-300">
        
        {/* Header */}
        <header className="h-[120px] sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-12 flex-shrink-0">
           
           <div className="flex items-center gap-6">
              {/* Toggle Buttons */}
              <button 
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-3 bg-white/5 text-gray-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5"
              >
                <Menu size={22} />
              </button>
              
              <button 
                onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
                className="hidden lg:flex p-3 bg-white/5 text-gray-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all shadow-inner border border-white/5"
              >
                <Menu size={22} />
              </button>

              {/* Search */}
              <div className="hidden sm:flex items-center bg-white/5 rounded-2xl px-6 w-[250px] md:w-[350px] lg:w-[400px] h-16 group/search focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-white/5">
                 <Search size={18} className="text-gray-500 group-focus-within/search:text-primary transition-colors flex-shrink-0" />
                 <input type="text" placeholder="Tìm kiếm..." className="bg-transparent border-none focus:outline-none ml-4 text-[10px] font-black uppercase tracking-widest italic text-white flex-1 min-w-0" />
              </div>
           </div>

           <div className="flex items-center gap-4 lg:gap-8">
              {/* User Profile */}
              <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-[2rem] border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                 <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20">
                    {user?.email?.[0].toUpperCase()}
                 </div>
                 <div className="hidden md:block">
                    <p className="text-[10px] font-black text-white italic tracking-tighter truncate max-w-[120px]">{user?.email}</p>
                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] italic mt-1 flex items-center gap-1">
                       <ShieldCheck size={10} /> ROOT API
                    </p>
                 </div>
              </div>

              {/* Notifications */}
              <button className="relative p-4 bg-white/5 text-gray-300 rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5 group/bell flex-shrink-0">
                 <Bell size={22} className="group-hover/bell:rotate-12 transition-transform" />
                 <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-black animate-pulse"></span>
              </button>
           </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-12 relative w-full">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 animate-slow-pulse pointer-events-none"></div>
           <div className="max-w-[1600px] mx-auto w-full">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

