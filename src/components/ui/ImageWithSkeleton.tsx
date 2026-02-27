import { type ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src?: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fallback?: ReactNode;
}

const ImageWithSkeleton = ({
  src,
  alt,
  className,
  wrapperClassName,
  fallback,
}: ImageWithSkeletonProps) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryTick, setRetryTick] = useState(0);
  const normalizedSrc = useMemo(() => src?.trim() ?? "", [src]);

  useEffect(() => {
    setLoaded(false);
    setHasError(false);
    setRetryTick(0);
  }, [normalizedSrc]);

  useEffect(() => {
    if (!normalizedSrc) return;

    let cancelled = false;
    const preload = new Image();
    preload.src = normalizedSrc;

    const markLoaded = () => {
      if (!cancelled) {
        setLoaded(true);
        setHasError(false);
      }
    };

    const markError = () => {
      if (!cancelled) {
        setHasError(true);
      }
    };

    if (preload.complete) {
      if (preload.naturalWidth > 0) {
        markLoaded();
      } else {
        markError();
      }
    } else {
      preload.onload = markLoaded;
      preload.onerror = markError;
    }

    return () => {
      cancelled = true;
    };
  }, [normalizedSrc, retryTick]);

  useEffect(() => {
    if (!normalizedSrc || !hasError || retryTick > 0) return;

    const timer = setTimeout(() => {
      setHasError(false);
      setRetryTick(1);
    }, 800);

    return () => clearTimeout(timer);
  }, [normalizedSrc, hasError, retryTick]);

  const showFallback = !normalizedSrc || hasError;

  return (
    <div className={cn("relative", wrapperClassName)}>
      {!showFallback && !loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}

      {!showFallback ? (
        <img
          src={normalizedSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          className={cn(
            "w-full h-full opacity-0 transition-opacity duration-300",
            loaded && "opacity-100",
            className,
          )}
        />
      ) : (
        fallback ?? (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground text-sm font-medium">
            Sem imagem
          </div>
        )
      )}
    </div>
  );
};

export default ImageWithSkeleton;
