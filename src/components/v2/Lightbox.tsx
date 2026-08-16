import { useEffect, useRef } from 'react';

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function Lightbox({ src, alt, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`圖片：${alt}`}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(10,8,22,0.80)', backdropFilter: 'blur(4px)' }}
        aria-hidden
      />

      {/* Image wrapper — stops propagation so clicking image doesn't close */}
      <div
        className="relative"
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          style={{
            maxWidth: '88vw',
            maxHeight: '85vh',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 16px 56px rgba(0,0,0,0.45)',
            display: 'block',
          }}
        />

        <button
          ref={closeRef}
          type="button"
          aria-label="關閉圖片"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-14px',
            right: '-14px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            border: 'none',
            background: '#fff',
            color: '#171525',
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.22)',
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
