import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type BtnVariant = 'primary' | 'secondary' | 'ghost';
type BubbleVariant = 'primary' | 'secondary' | 'soft' | 'dark' | 'ghost';
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

// ── Legacy button system (kept for backward compat) ──────────────────────────

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

interface LinkButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: BtnVariant;
}
export function LinkButton({ variant = 'secondary', className, ...props }: LinkButtonProps) {
  return (
    <a className={cx(`v2-btn v2-btn--${variant}`, className)} {...props} />
  );
}

// ── Bubble Button system (pill shape, new design system) ────────────────────

interface BubbleButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: BubbleVariant;
}
export function BubbleButton({ variant = 'secondary', className, ...props }: BubbleButtonProps) {
  return (
    <button
      type="button"
      className={cx(`v2-bubble-btn v2-bubble-btn--${variant}`, className)}
      {...props}
    />
  );
}

interface BubbleLinkProps extends ComponentPropsWithoutRef<'a'> {
  variant?: BubbleVariant;
}
export function BubbleLink({ variant = 'secondary', className, ...props }: BubbleLinkProps) {
  return (
    <a className={cx(`v2-bubble-btn v2-bubble-btn--${variant}`, className)} {...props} />
  );
}

// ── Tag ──────────────────────────────────────────────────────────────────────

interface TagProps extends ComponentPropsWithoutRef<'span'> {
  variant?: TagVariant;
}
export function Tag({ variant = 'default', className, ...props }: TagProps) {
  const extra = variant === 'default' ? undefined : `v2-tag--${variant}`;
  return <span className={cx('v2-tag', extra, className)} {...props} />;
}

// ── PixelMark — aria-hidden decorative accent ────────────────────────────────

export function PixelMark({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx('v2-pixel-mark', className)} aria-hidden="true">
      {children}
    </span>
  );
}
