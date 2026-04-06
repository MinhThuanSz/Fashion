import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-premium overflow-hidden border border-gray-100"
            onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-10 pb-6 border-b border-gray-50">
             <h3 className="text-3xl font-black uppercase tracking-wider">{title}</h3>
             <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all duration-300">
                <X size={24} />
             </button>
          </div>

          {/* Body */}
          <div className="p-10 max-h-[70vh] overflow-y-auto pr-8 scrollbar-thin">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-10 pt-6 border-t border-gray-50 flex justify-end gap-4 bg-gray-50/30">
               {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default Modal
