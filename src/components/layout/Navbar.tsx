import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ArrowRight } from 'lucide-react';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Offers', href: '#offers', id: 'offers' },
  { label: 'Membership', href: '#packages', id: 'packages' },
  { label: 'Coaches', href: '#coaches', id: 'coaches' },
  { label: 'Reviews', href: '#reviews', id: 'reviews' },
  { label: 'Gallery', href: '#facilities', id: 'facilities' },
] as const;

export function Navbar() {
  const scrollY = useScrollPosition();
  const prefersReducedMotion = useReducedMotion();
  const { openEnquiryModal } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isManuallyScrolling = useRef(false);

  // Always solid, but we can keep scrollY if we want to change shadow or border
  const isScrolled = scrollY > 10;

  useEffect(() => {

  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    isManuallyScrolling.current = true;
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    // Re-enable observer after animation
    setTimeout(() => {
      isManuallyScrolling.current = false;
    }, 800);
  };

  return (
    <>
      {/* Desktop / Main Navbar */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 bg-background transition-all duration-500 ease-vault ${
          isScrolled ? 'border-b border-outline/50 shadow-sm' : 'border-b border-transparent'
        }`}
        initial={prefersReducedMotion ? {} : { y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="section-container">
          <nav className="flex items-center justify-between h-16 md:h-20" role="navigation" aria-label="Main navigation">
            {/* Logo */}
            <a
              href="#"
              className="font-display tracking-wider text-xl md:text-2xl text-on-surface hover:text-primary transition-colors duration-300"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
              }}
            >
              Fitness <span className="text-primary">Club</span>
            </a>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="font-headline text-sm uppercase tracking-widest transition-colors duration-300 relative group text-zinc-400 hover:text-white"
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <button
                  className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2"
                  onClick={() => logout()}
                >
                  <User size={14} />
                  Logout
                </button>
              ) : (
                <button
                  className="btn-ghost text-xs px-5 py-2.5 flex items-center gap-2"
                  onClick={() => navigate('/login')}
                >
                  <User size={14} />
                  Client Login
                </button>
              )}
              <button
                className="btn-gold text-xs px-5 py-2.5 flex items-center gap-2"
                id="nav-enquire"
                onClick={() => openEnquiryModal()}
              >
                Enquire Now
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden text-on-surface p-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
              id="nav-mobile-toggle"
            >
              <Menu size={24} />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-background flex flex-col"
            initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 h-16 md:h-20 border-b border-outline/20">
              <span className="font-display text-2xl tracking-wider">
                Fitness <span className="text-primary">Club</span>
              </span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="text-on-surface p-2 hover:text-primary transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {NAV_LINKS.map((link, i) => {
                return (
                  <motion.button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className="font-display text-4xl md:text-5xl uppercase transition-colors duration-300 text-left py-3 text-zinc-400 hover:text-white"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Drawer CTAs */}
            <div className="px-8 pb-10 flex flex-col gap-3">
              {user ? (
                <button 
                  onClick={() => {
                    setIsMobileOpen(false);
                    logout();
                  }}
                  className="btn-ghost w-full text-sm py-4 flex items-center justify-center gap-2"
                >
                  <User size={16} />
                  Logout
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigate('/login');
                  }}
                  className="btn-ghost w-full text-sm py-4 flex items-center justify-center gap-2"
                >
                  <User size={16} />
                  Client Login
                </button>
              )}
              <button
                className="btn-gold w-full text-sm py-4 flex items-center justify-center gap-2"
                onClick={() => {
                  setIsMobileOpen(false);
                  openEnquiryModal();
                }}
              >
                Enquire Now
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
