import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#181922] border border-[#ffdb1a]/50 text-white rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md"
        >
          <div className="w-7 h-7 rounded-lg bg-[#ffdb1a]/20 text-[#ffdb1a] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold font-display text-white">{message}</div>
            <div className="text-[10px] font-mono text-[#ffdb1a]">+1 Contribution • Heatmap Brightened</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#787989] hover:text-white rounded ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
