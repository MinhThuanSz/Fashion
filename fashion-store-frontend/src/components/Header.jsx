import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Settings, ShieldCheck } from 'lucide-react'
import { logout } from '../store/slices/authSlice'
import { UI_TEXT } from '../constants/text'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const cartItems = useSelector(state => state.cart.items)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const { user, isAuthenticated } = useSelector(state => state.auth)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth')
    setIsUserMenuOpen(false)
  }

  const navLinks = [
    { title: UI_TEXT.common.home, path: '/' },
    { title: UI_TEXT.common.products, path: '/products' },
    { title: 'Giới thiệu', path: '/about' },
    { title: 'Liên hệ', path: '/contact' },
  ]

  const isActive = (path) => {
     if (path === '/products' && location.pathname.startsWith('/products')) return true
     return location.pathname === path
  }

  const Logo = () => (
    <Link to="/" className="text-2xl font-outfit font-bold tracking-tight text-black flex items-center gap-3">
        <span className="bg-primary text-white w-10 h-10 flex items-center justify-center rounded-2xl leading-none shadow-xl shadow-primary/20 font-black italic transform -rotate-6 group-hover:rotate-0 transition-transform">N</span>
        <span className="uppercase tracking-[0.1em] text-xl font-black">Nova<span className="text-primary italic">Kit</span></span>
    </Link>
  )

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass shadow-xl py-2' : 'bg-transparent py-6'}`}>
      <div className="container-custom flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10 lg:gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.title} 
              to={link.path} 
              className={`nav-link text-[11px] font-black uppercase tracking-[0.2em] italic transition-all relative py-2 ${isActive(link.path) ? 'text-primary' : 'text-gray-400 hover:text-black'}`}
            >
              {link.title}
              {isActive(link.path) && (
                 <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in shadow-[0_0_10px_rgba(14,165,233,0.5)]"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 md:gap-5">
          <div className="hidden lg:flex items-center bg-gray-100/30 rounded-2xl px-5 py-3 w-72 group focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all border border-transparent focus-within:border-primary/10 shadow-sm relative overflow-hidden">
            <Search size={18} className="text-gray-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder={UI_TEXT.header.searchPlaceholder} 
              className="bg-transparent border-none focus:outline-none ml-3 text-xs font-bold w-full uppercase tracking-widest italic" 
            />
          </div>
          
          <Link to="/cart" className="relative p-3 text-gray-700 hover:text-primary transition-colors group bg-white/50 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100/50">
            <ShoppingCart size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-6 h-6 flex items-center justify-center rounded-full font-black shadow-xl border-2 border-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="relative">
             <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-3 text-gray-700 hover:text-primary transition-colors group bg-white/50 rounded-2xl shadow-sm hover:shadow-lg border border-gray-100/50"
             >
              <User size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-6 w-80 glass-premium p-5 rounded-[2.5rem] shadow-2xl animate-fade-in border border-primary/5 origin-top-right overflow-hidden bg-white/80">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                {isAuthenticated ? (
                  <div className="space-y-4 relative z-10">
                    <div className="px-6 py-6 border-b border-gray-50 mb-2 bg-gray-50/50 rounded-3xl group">
                       <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-[0.4em] mb-2 italic leading-none">{UI_TEXT.header.signedInAs}</p>
                       <p className="text-sm font-black truncate text-black italic tracking-tighter group-hover:text-primary transition-colors">{user?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <MenuButton to="/profile" icon={<Settings size={18} />} label={UI_TEXT.profile.settings} onClick={() => setIsUserMenuOpen(false)} />
                      <MenuButton to="/profile?tab=orders" icon={<Package size={18} />} label={UI_TEXT.header.myOrders} onClick={() => setIsUserMenuOpen(false)} />
                      {user?.role === 'Admin' && (
                         <MenuButton to="/admin" icon={<ShieldCheck size={18} />} label={UI_TEXT.common.admin} onClick={() => setIsUserMenuOpen(false)} variant="primary" />
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:text-red-500 hover:bg-red-50 transition-all font-black text-[10px] uppercase tracking-widest italic rounded-2xl mt-4 border-t border-red-50/50"
                      >
                        <LogOut size={18} /> {UI_TEXT.common.logout}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-1 space-y-3 relative z-10">
                    <Link to="/auth" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-8 py-5 bg-primary text-white hover:bg-primary-hover rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] justify-center transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 italic">
                       {UI_TEXT.common.login}
                    </Link>
                    <Link to="/auth?mode=register" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all text-gray-300 hover:text-black justify-center italic">
                       {UI_TEXT.common.register}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl md:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
           <div 
             className="fixed top-0 left-0 h-full w-[340px] bg-white p-12 shadow-2xl transition-transform animate-slide-right flex flex-col rounded-r-[4rem]"
             onClick={e => e.stopPropagation()}
           >
              <div className="flex items-center justify-between mb-20">
                  <Logo />
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-gray-50 rounded-3xl hover:bg-black hover:text-white transition-all shadow-inner"><X size={24}/></button>
              </div>

              <div className="mb-14">
                <div className="flex items-center bg-gray-50 rounded-[2.5rem] px-8 py-6 group focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all border border-transparent focus-within:border-gray-100 shadow-inner">
                  <Search size={18} className="text-gray-300 group-focus-within:text-primary" />
                  <input type="text" placeholder={UI_TEXT.header.searchPlaceholder} className="bg-transparent border-none focus:outline-none ml-3 text-xs font-bold w-full uppercase tracking-[0.2em] italic" />
                </div>
              </div>

              <nav className="flex flex-col gap-2">
                 {navLinks.map((link) => (
                    <Link 
                      key={link.title} 
                      to={link.path} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-[12px] font-black uppercase tracking-[0.4em] py-8 transition-all border-b border-gray-50 last:border-0 italic flex items-center justify-between group ${isActive(link.path) ? 'text-primary pl-6' : 'text-gray-300 hover:text-black hover:pl-6'}`}
                    >
                      {link.title}
                      <X size={14} className="rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
              </nav>

              <div className="mt-auto pt-10 border-t border-gray-50 flex flex-col gap-6">
                 {isAuthenticated ? (
                   <button 
                     onClick={handleLogout}
                     className="flex items-center gap-4 text-red-500 font-extrabold text-[12px] uppercase tracking-[0.3em] bg-red-50 p-6 rounded-[2rem] justify-center transition-all shadow-sm italic"
                   >
                     <LogOut size={20} /> {UI_TEXT.common.logout}
                   </button>
                 ) : (
                   <div className="flex flex-col gap-6">
                      <Link 
                        to="/auth" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 font-black uppercase tracking-[0.3em] bg-primary text-white p-8 justify-center rounded-[2.5rem] shadow-2xl shadow-primary/20 active:scale-95 transition-all text-xs italic"
                      >
                        {UI_TEXT.common.login}
                      </Link>
                      <Link 
                        to="/auth?mode=register" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 font-black text-gray-300 p-5 justify-center text-[10px] uppercase tracking-widest italic"
                      >
                        {UI_TEXT.common.register}
                      </Link>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </header>
  )
}

function MenuButton({ to, icon, label, onClick, variant }) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:translate-x-2 ${variant === 'primary' ? 'bg-primary/5 text-primary border border-primary/10' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
    >
      {icon} {label}
    </Link>
  )
}

export default Header
