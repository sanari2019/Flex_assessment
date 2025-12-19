import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SplashScreenProps {
  isVisible?: boolean;
  onClose: () => void;
}

export function SplashScreen({ isVisible: externalVisible, onClose }: SplashScreenProps) {
  const [internalVisible, setInternalVisible] = useState(true);
  const isVisible = externalVisible ?? internalVisible;

  const handleClose = () => {
    setInternalVisible(false);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    // Auto-close after 3 seconds
    const timer = setTimeout(handleClose, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-x-0 top-0 z-[100] bg-primary flex items-center justify-center py-3 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <div className="text-center px-6">
        <p className="text-sm md:text-base font-medium text-primary-foreground">
          Flex Living is now{' '}
          <span className="font-bold">the Flex.</span>
        </p>
      </div>
      
      <button
        onClick={handleClose}
        className="absolute right-4 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
