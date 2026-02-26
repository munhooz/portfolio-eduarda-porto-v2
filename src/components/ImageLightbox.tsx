import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageLightboxProps {
  images: { src: string; alt: string }[];
  initialIndex: number;
  onClose: () => void;
}

const ImageLightbox = ({ images, initialIndex, onClose }: ImageLightboxProps) => {
  const [current, setCurrent] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prev = useCallback(() => setCurrent((c) => (c > 0 ? c - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c < images.length - 1 ? c + 1 : 0)), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) diff > 0 ? next() : prev();
    setTouchStart(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Prev */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 md:left-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Image */}
        <motion.img
          key={current}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          src={images[current].src}
          alt={images[current].alt}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg select-none"
        />

        {/* Next */}
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageLightbox;
