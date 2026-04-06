import React from 'react'

const Loader = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center gap-6 animate-fade-in pointer-events-none">
         <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-2xl shadow-primary/20"></div>
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary ml-2 animate-pulse italic">NOVAKIT FASHION</p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
       <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-black animate-spin"></div>
    </div>
  )
}

export default Loader
