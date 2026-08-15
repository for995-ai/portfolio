import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { Quest } from '@/data/quests';

interface QuestModalProps {
  quest: Quest | null;
  onClose: () => void;
}

/**
 * 專案詳情 Modal（像素視窗）。
 * a11y 行為沿用既有 Lightbox：Esc 關閉、鎖捲動、焦點移轉與還原、aria-modal。
 * 僅渲染資料中確實存在的欄位，缺欄不顯示（不虛構內容）。
 */
export function QuestModal({ quest, onClose }: QuestModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!quest) return;
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prevFocusRef.current?.focus();
    };
  }, [quest, onClose]);

  if (!quest) return null;

  const hasImage = quest.image != null && 'src' in quest.image;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] grid place-items-center overflow-y-auto bg-px-night/90 p-3 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${quest.title} 專案詳情`}
      onClick={onClose}
    >
      <div
        className="px-panel px-window my-auto w-full max-w-3xl p-5 pt-7 md:p-7 md:pt-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="px-title text-[0.55rem] text-px-coral">
              STAGE {quest.id}
              {quest.category && <span className="ml-2 text-px-peach">{quest.category}</span>}
            </p>
            <h3 className="zh-heading mt-2 text-xl leading-[1.5] text-px-white md:text-2xl">
              {quest.title}
            </h3>
            {quest.subtitle && (
              <p className="mt-1.5 text-sm leading-[1.6] text-px-peach">{quest.subtitle}</p>
            )}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="關閉專案詳情"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[2px] border-2 border-px-ink bg-px-panel-hi text-px-cream"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {(quest.award || quest.badge) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {quest.award && <span className="px-tag px-tag--coral">{quest.award}</span>}
            {quest.badge && (
              <span className="rounded-[2px] border-2 border-px-ink bg-px-night/60 px-2.5 py-1 text-xs leading-[1.6] text-px-peach">
                {quest.badge}
              </span>
            )}
          </div>
        )}

        {hasImage && quest.image && 'src' in quest.image && (
          <div className="px-frame mt-5 overflow-hidden">
            <img
              src={encodeURI(quest.image.src)}
              alt={quest.image.alt}
              className="max-h-[46svh] w-full object-contain"
            />
          </div>
        )}

        {quest.positioning && (
          <>
            <p className="px-title mt-6 text-[0.55rem] text-px-coral">OVERVIEW / 專案定位</p>
            <p className="zh-body mt-2 max-w-[68ch] text-base leading-[1.75] text-px-cream">
              {quest.positioning}
            </p>
          </>
        )}

        <p className="px-title mt-5 text-[0.55rem] text-px-coral">MISSION / 內容與成果</p>
        <p className="zh-body mt-2 max-w-[68ch] text-base leading-[1.75] text-px-peach">
          {quest.narrative}
        </p>

        {quest.quote && (
          <>
            <p className="px-title mt-5 text-[0.55rem] text-px-coral">REFLECTION / 挑戰與反思</p>
            <p className="zh-body mt-2 max-w-[68ch] border-l-4 border-px-magenta pl-4 text-base italic leading-[1.75] text-px-peach">
              {quest.quote}
            </p>
          </>
        )}

        <p className="px-title mt-5 text-[0.55rem] text-px-coral">TOOLS / 使用技術</p>
        <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
          {quest.techs.map((t) => (
            <li key={t} className="px-tag">
              {t}
            </li>
          ))}
        </ul>

        {quest.link && (
          <a
            href={quest.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-btn px-btn--primary mt-6"
          >
            查看完整專案 ↗
          </a>
        )}
      </div>
    </div>,
    document.body,
  );
}
