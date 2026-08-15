import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type BtnVariant = 'primary' | 'secondary' | 'ghost';
type TagVariant = 'default' | 'featured' | 'meta';

function cx(...parts: (string | undefined | false)[]) {
  return parts.filter(Boolean).join(' ');
}

export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('v2-container', className)} {...props} />;
}

export function Section({ className, ...props }: ComponentPropsWithoutRef<'section'>) {
  return <section className={cx('v2-section', className)} {...props} />;
}

/** Button rendered as <button> */
interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: BtnVariant;
}
export function Button({ variant = 'secondary', className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(`v2-btn v2-btn--${variant}`, className)}
      {...props}
    />
  );
}

/** Button rendered as <a> — for navigation / external links */
interface LinkButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: BtnVariant;
}
export function LinkButton({ variant = 'secondary', className, ...props }: LinkButtonProps) {
  return (
    <a className={cx(`v2-btn v2-btn--${variant}`, className)} {...props} />
  );
}

/** Skill / tech / category tag */
interface TagProps extends ComponentPropsWithoutRef<'span'> {
  variant?: TagVariant;
}
export function Tag({ variant = 'default', className, ...props }: TagProps) {
  const extra = variant === 'default' ? undefined : `v2-tag--${variant}`;
  return <span className={cx('v2-tag', extra, className)} {...props} />;
}

/** ▚ pixel section-number accent — aria-hidden, decorative */
export function PixelMark({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('v2-pixel-mark', className)} aria-hidden="true">
      {children}
    </span>
  );
}
