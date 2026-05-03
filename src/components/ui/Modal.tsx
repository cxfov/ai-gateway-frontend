import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-[#292524] border border-[#E8DFD3] dark:border-[#44403C] rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}>
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD3] dark:border-[#44403C]">
                <h3 className="text-lg font-bold text-[#1C1917] dark:text-[#FAFAF9]">{title}</h3>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F5EDE4] dark:hover:bg-[#44403C] transition-colors text-[#A8A29E]">
                  <X size={20} />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
