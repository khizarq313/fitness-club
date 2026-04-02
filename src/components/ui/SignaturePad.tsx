import { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export interface SignaturePadRef {
  /** Returns the signature as a base64 Data URL, or null if empty */
  toDataURL: () => string | null;
  /** Clears the current signature */
  clear: () => void;
  /** Returns true if the canvas has no signature drawn */
  isEmpty: () => boolean;
}

interface SignaturePadProps {
  label?: string;
  error?: string;
}

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ label = 'Signature', error }, ref) => {
    const padRef = useRef<SignatureCanvas>(null);

    useImperativeHandle(ref, () => ({
      toDataURL: () => {
        if (!padRef.current || padRef.current.isEmpty()) return null;
        // Trim whitespace and retrieve as PNG
        return padRef.current.getTrimmedCanvas().toDataURL('image/png');
      },
      clear: () => {
        if (padRef.current) {
          padRef.current.clear();
        }
      },
      isEmpty: () => {
        return padRef.current ? padRef.current.isEmpty() : true;
      },
    }));

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      if (padRef.current) {
        padRef.current.clear();
      }
    };

    return (
      <div className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {label} <span className="text-primary">*</span>
          </label>
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] uppercase tracking-widest font-headline text-on-surface-variant hover:text-primary transition-colors"
          >
            Clear
          </button>
        </div>

        <div
          className={`w-full bg-[#141414] border rounded-none overflow-hidden touch-none relative ${
            error ? 'border-red-500' : 'border-primary'
          }`}
        >
          {/* Subtle guide line */}
          <div className="absolute bottom-6 left-6 right-6 h-px bg-outline/30 pointer-events-none" />
          
          <SignatureCanvas
            ref={padRef}
            penColor="#F5A623"
            canvasProps={{
              className: 'w-full h-48 cursor-crosshair',
            }}
            backgroundColor="transparent"
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

SignaturePad.displayName = 'SignaturePad';
