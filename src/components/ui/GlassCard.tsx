import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export function GlassCard({ children, className = '', onClick, id }: GlassCardProps) {
  return (
    <motion.div
      id={id}
      className={`glass-card p-6 cursor-pointer group ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02, borderColor: 'rgba(245, 166, 35, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
