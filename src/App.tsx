import { lazy, Suspense } from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { EnquiryModal } from '@/components/ui/EnquiryModal';
import { useAuthStore } from '@/stores/authStore';

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'));
const ParQForm = lazy(() => import('@/pages/ParQForm'));
const PtContract = lazy(() => import('@/pages/PtContract'));
const TrialWaiver = lazy(() => import('@/pages/TrialWaiver'));
const Login = lazy(() => import('@/pages/Login'));

function LoadingFallback() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-outline border-t-primary animate-spin" />
        <span className="font-headline text-sm uppercase tracking-widest text-on-surface-variant">
          Loading
        </span>
      </div>
    </div>
  );
}

export default function App() {
  const { initializeAuthListener } = useAuthStore();

  useEffect(() => {
    initializeAuthListener();
  }, [initializeAuthListener]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {/* Grain texture overlay */}
      <GrainOverlay />

      {/* Navigation */}
      <Navbar />

      {/* Global Modals */}
      <EnquiryModal />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#FFFFFF',
            border: '1px solid #2A2A2A',
            borderRadius: '0px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#F5A623',
              secondary: '#000000',
            },
          },
        }}
      />

      {/* Routes */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/par-q" element={<ParQForm />} />
          <Route path="/pt-contract" element={<PtContract />} />
          <Route path="/trial-waiver" element={<TrialWaiver />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>

      {/* Floating Action Buttons */}
      <FloatingActions />
    </BrowserRouter>
  );
}
