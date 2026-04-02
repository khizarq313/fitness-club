import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Instagram, MapPin } from 'lucide-react';

export function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Expanding Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.8 }}
            transition={{ duration: 0.2, staggerChildren: 0.05 }}
            className="flex flex-col gap-3 items-end mb-2"
          >
            {/* Directions / Maps */}
            <motion.a 
              href="https://www.google.com/maps/search/?api=1&query=Amravati" 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 bg-[#1A1A1A] border border-outline rounded-full flex items-center justify-center text-red-500 shadow-xl hover:bg-red-500/10 hover:border-red-500/50 transition-all"
            >
              <MapPin className="w-[22px] h-[22px]" />
            </motion.a>
            {/* Phone / Call */}
            <motion.a 
              href="tel:9876543210" 
              className="w-12 h-12 bg-[#1A1A1A] border border-outline rounded-full flex items-center justify-center text-blue-400 shadow-xl hover:bg-blue-400/10 hover:border-blue-400/50 transition-all"
            >
              <Phone className="w-[22px] h-[22px]" />
            </motion.a>
            {/* Instagram */}
            <motion.a 
              href="https://www.instagram.com/cristiano" 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 bg-[#1A1A1A] border border-outline rounded-full flex items-center justify-center text-pink-500 shadow-xl hover:bg-pink-500/10 hover:border-pink-500/50 transition-all"
            >
              <Instagram className="w-[22px] h-[22px]" />
            </motion.a>
            {/* WhatsApp */}
            <motion.a 
              href="https://wa.me/9876543210" 
              target="_blank" 
              rel="noreferrer"
              className="w-12 h-12 bg-[#1A1A1A] border border-outline rounded-full flex items-center justify-center text-[#25D366] shadow-xl hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[24px] h-[24px]" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Premium Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 flex items-center justify-center shadow-2xl transition-all duration-300 bg-[#0A0A0A] border border-primary/30 rounded-full hover:shadow-[0_0_24px_rgba(245,166,35,0.2)] hover:border-primary z-10"
        aria-label="Toggle contact options"
        aria-expanded={isOpen}
      >
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 15 }}
          className="material-symbols-outlined text-primary text-2xl"
        >
          {isOpen ? 'close' : 'forum'}
        </motion.span>
      </button>
    </div>
  );
}
