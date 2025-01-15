import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  priority?: boolean;
  blurDataURL?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  blurDataURL,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    disabled: priority,
  });

  useEffect(() => {
    // Preload priority images immediately
    if (priority && imgRef.current) {
      const img = new Image();
      img.src = src;
      img.onload = () => setLoaded(true);
    }
  }, [src, priority]);

  // Update placeholder URL generation to use blurDataURL if provided
  const placeholderUrl = blurDataURL || src?.replace('/image/', '/image/thumbnails/');

  return (
    <div 
      ref={targetRef} 
      className={cn(
        "relative overflow-hidden bg-gray-100",
        className
      )}
      style={{ aspectRatio: width && height ? `${width}/${height}` : 'auto' }}
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
            style={{ backgroundImage: `url(${placeholderUrl})` }}
          />
          <ImageIcon className="w-1/3 h-1/3 text-gray-400 animate-pulse relative z-10" />
        </div>
      )}
      
      {(isIntersecting || priority) && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;