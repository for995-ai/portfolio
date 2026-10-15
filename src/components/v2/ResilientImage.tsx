import {
  type ImgHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ResilientImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> {
  src: string;
  /** Rendered after the last retry. Pass null for decorative images. */
  fallback?: ReactNode;
  maxRetries?: number;
  retryDelayMs?: number;
  onPermanentError?: () => void;
}

const HAKKA_DRAGON_COVER =
  'https://hakka-dragon-web-vercel-git-main-sms-projects-f4d9e27e.vercel.app/assets/intro/camera-01/qa-browser-final.png?v=20261015';

function resolveImageSrc(src: string): string {
  if (src.includes('project-hakkadragon-cover')) return HAKKA_DRAGON_COVER;
  return src;
}

function retryUrl(src: string, attempt: number): string {
  if (attempt === 0) return src;
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}image-retry=${attempt}`;
}

/**
 * An image that retries transient CDN/network failures without leaving a
 * browser broken-image icon in the layout.
 *
 * The HakkaDragon portfolio cover is served directly from the deployed project
 * so the card uses the same high-resolution final artwork as the live app.
 */
export function ResilientImage({
  src,
  fallback = <span className="v2-image-fallback">圖片暫時無法載入</span>,
  maxRetries = 2,
  retryDelayMs = 450,
  onPermanentError,
  onLoad,
  style,
  ...imgProps
}: ResilientImageProps) {
  const resolvedSrc = resolveImageSrc(src);
  const [attempt, setAttempt] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setAttempt(0);
    setWaiting(false);
    setFailed(false);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [resolvedSrc]);

  if (failed) return <>{fallback}</>;

  return (
    <img
      {...imgProps}
      key={attempt}
      src={retryUrl(resolvedSrc, attempt)}
      style={{ ...style, visibility: waiting ? 'hidden' : style?.visibility }}
      onLoad={event => {
        setWaiting(false);
        onLoad?.(event);
      }}
      onError={() => {
        if (attempt >= maxRetries) {
          setFailed(true);
          onPermanentError?.();
          return;
        }

        setWaiting(true);
        timer.current = window.setTimeout(() => {
          setAttempt(value => value + 1);
          setWaiting(false);
        }, retryDelayMs * (attempt + 1));
      }}
    />
  );
}
