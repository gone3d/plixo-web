import { useState } from 'react';
import { cn } from '../../utils/cn';

export interface SlideInImageProps {
  src: string;
  alt: string;
  imageClassName?: string;
  tabClassName?: string;
  verticalOffset?: number; // Vertical offset in pixels for image container only
}

const SlideInImage = ({
  src,
  alt,
  imageClassName,
  tabClassName,
  verticalOffset = 0,
}: SlideInImageProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Preview Tab */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleToggle();
        }}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 left-0 z-50',
          'bg-slate-700/60 hover:bg-slate-600/80 text-white/90 hover:text-white',
          'w-5 h-12 flex items-center justify-center backdrop-blur-sm',
          'border border-slate-600/50 hover:border-slate-500/70',
          'transition-all duration-200 cursor-pointer rounded-r-md',
          'animate-pulse hover:animate-none shadow-lg',
          'pointer-events-auto',
          tabClassName
        )}
        title={`${isOpen ? 'Hide' : 'Show'} preview`}
      >
        <svg
          className="w-4 h-4 transform transition-transform duration-200 hover:scale-110 pointer-events-none"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </button>

      {/* Slide-in Image Container - overlays description and tech sections only */}
      <div
        className={cn(
          'absolute left-0 right-0 z-40 transition-all duration-500 ease-in-out overflow-hidden',
          isOpen ? 'translate-x-0 opacity-100 pointer-events-auto' : '-translate-x-full opacity-0 pointer-events-none',
          'bg-slate-900 border-l border-slate-700 shadow-2xl'
        )}
        style={{
          top: `${80 + verticalOffset}px`,
          bottom: `${80 - verticalOffset}px`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-50 bg-slate-800/80 hover:bg-slate-700/80 text-white p-2 rounded-full transition-colors duration-200"
          title="Close preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            imageClassName
          )}
        />
      </div>
    </>
  );
};

export default SlideInImage;