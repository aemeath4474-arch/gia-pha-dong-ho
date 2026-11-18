import React, { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ArchivalImageProps {
  src?: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
}

export const ArchivalImage: React.FC<ArchivalImageProps> = ({
  src,
  alt,
  caption,
  className = '',
  imgClassName = '',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EBE6DF] border border-[#D6CEBE] text-[#57534E] p-8 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="w-7 h-7 text-[#8C2D19] mb-3 opacity-80" strokeWidth={1.5} />
        <p className="font-display text-base text-[#1C1917] font-medium max-w-xs">{alt}</p>
        {caption && <p className="text-xs text-[#57534E] mt-1.5 max-w-xs">{caption}</p>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      onError={() => setHasError(true)}
      className={`select-none ${imgClassName || 'w-full h-full object-cover'}`}
    />
  );
};
