import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginThunk, registerThunk } from '../store/slices/authSlice'
import { Mail, Lock, User, ArrowRight, Github, Chrome, Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { UI_TEXT } from '../constants/text'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '', name: '' })
  const [loading, setLoading] = useState(false)
  
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await dispatch(loginThunk(formData)).unwrap()
      } else {
        await dispatch(registerThunk(formData)).unwrap()
      }
      navigate('/')
    } catch (error) {
       toast.error(error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.', { 
         style: { background: '#ef4444', color: '#fff', borderRadius: '1.5rem', fontWeight: 'black' }
       })
    } finally {
       setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/30 p-6 md:p-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-slow-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 animate-slow-pulse"></div>

      <div className="w-full max-w-[1200px] min-h-[700px] bg-white rounded-[4rem] shadow-2xl border border-gray-100 flex overflow-hidden relative z-10 group">
        
        {/* Left Side: Brand & Visual */}
        <div className="hidden lg:flex w-1/2 bg-black relative p-20 flex-col justify-between overflow-hidden">
           <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-110 transition-transform duration-[3s]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
           </div>

           <div className="relative z-10">
              <Link to="/" className="text-3xl font-outfit font-bold tracking-tight text-white flex items-center gap-3">
                  <span className="bg-primary text-white w-12 h-12 flex items-center justify-center rounded-2xl leading-none shadow-2xl shadow-primary/40 font-black italic transform -rotate-12">N</span>
                  <span className="uppercase tracking-[0.1em] text-2xl font-black">Nova<span className="text-primary italic">Kit</span></span>
              </Link>
           </div>

           <div className="relative z-10 space-y-10">
               <div className="space-y-6">
                  <div className="w-20 h-1 bg-primary"></div>
                  <h2 className="text-6xl font-black text-white italic tracking-tighter leading-[0.9] uppercase">
                    Bắt đầu <br /> 
                    <span className="text-white/40">phong cách</span> <br />
                    của riêng bạn.
                  </h2>
               </div>
               <div className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] space-y-6">
                  <div className="flex items-center gap-4">
                     <Sparkles className="text-primary" size={24} />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Đánh giá người dùng</p>
                  </div>
                  <p className="text-[11px] font-bold text-gray-300 italic leading-relaxed uppercase tracking-widest">
                    "NovaKit là nơi bộ sưu tập của Trâm bắt đầu. Chất lượng đỉnh cao cùng trải nghiệm mua sắm vô cùng bùng nổ."
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20"></div>
                     <div>
                        <p className="text-xs font-black text-white italic tracking-tighter">Bảo Trâm</p>
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic">Fashion Influencer</p>
                     </div>
                  </div>
               </div>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-10 md:p-24 flex flex-col justify-center">
           <div className="max-w-md mx-auto w-full space-y-12">
              <div className="space-y-4">
                 <h1 className="text-5xl font-black uppercase italic tracking-tighter text-black">
                    {isLogin ? UI_TEXT.common.login : UI_TEXT.common.register}
                 </h1>
                 <p className="text-gray-400 font-bold italic text-sm uppercase tracking-widest">{isLogin ? 'Vui lòng đăng nhập để tiếp tục trải nghiệm NovaKit Hub' : 'Đăng ký thành viên để nhận ưu đãi Nova độc quyền'}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 {!isLogin && (
                   <div className="space-y-3 group/input">
                      <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em] ml-2 italic group-focus-within/input:text-primary transition-colors">{UI_TEXT.checkout.fullName}</label>
                      <div className="relative">
                         <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-primary transition-colors" size={20} />
                         <input 
                           type="text" 
                           name="name"
                           value={formData.name}
                           onChange={handleChange}
                           className="w-full h-16 bg-gray-50 border-none rounded-2xl pl-16 pr-8 text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all font-outfit uppercase tracking-widest placeholder:text-gray-200" 
                           placeholder="HỌ VÀ TÊN"
                         />
                      </div>
                   </div>
                 )}
                 <div className="space-y-3 group/input">
                    <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em] ml-2 italic group-focus-within/input:text-primary transition-colors">{UI_TEXT.checkout.email}</label>
                    <div className="relative">
                       <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-primary transition-colors" size={20} />
                       <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-16 bg-gray-50 border-none rounded-2xl pl-16 pr-8 text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all font-outfit uppercase tracking-widest placeholder:text-gray-200" 
                        placeholder="EMAIL"
                       />
                    </div>
                 </div>
                 <div className="space-y-3 group/input">
                    <label className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em] ml-2 italic group-focus-within/input:text-primary transition-colors">Mật khẩu bảo mật</label>
                    <div className="relative">
                       <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-primary transition-colors" size={20} />
                       <input 
                        type="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full h-16 bg-gray-50 border-none rounded-2xl pl-16 pr-8 text-xs font-bold focus:ring-2 focus:ring-primary/10 transition-all font-outfit tracking-widest placeholder:text-gray-200" 
                        placeholder="••••••••"
                       />
                    </div>
                 </div>

                 <button type="submit" disabled={loading} className="w-full h-20 bg-black text-white hover:bg-primary rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-black/10 active:scale-95 transition-all text-xs italic group/btn disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? UI_TEXT.common.login : UI_TEXT.common.register)}
                    {!loading && <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform duration-500" />}
                 </button>
              </form>

              <div className="space-y-10">
                 <div className="flex items-center gap-6">
                    <div className="h-px bg-gray-100 flex-grow"></div>
                    <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest italic">Hoặc bằng tài khoản khác</span>
                    <div className="h-px bg-gray-100 flex-grow"></div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <SocialButton icon={<Chrome size={20} />} label="GOOGLE" />
                    <SocialButton icon={<Github size={20} />} label="GITHUB" />
                 </div>
              </div>

              <div className="text-center">
                 <button onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-primary transition-all italic">
                    {isLogin ? 'Bạn chưa có tài khoản NovaKit? Đăng ký ngay' : 'Bạn đã là thành viên Nova? Đăng nhập tại đây'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

function SocialButton({ icon, label }) {
  return (
    <button className="flex items-center justify-center gap-4 h-16 border-2 border-gray-50 rounded-2xl hover:border-primary/20 hover:bg-gray-50 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black italic">
       {icon} {label}
    </button>
  )
}

export default Auth
