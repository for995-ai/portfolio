import { useEffect, useState } from 'react';
import { Home as HomeIcon, Menu, X } from 'lucide-react';

export interface HudLink {
  /** 既有 section id（不新增／不更名既有錨點） */
  id: string;
  /** 像素英文小標 */
  en: string;
  /** 正式中文區塊名稱 */
  zh: string;
}

interface HudHeaderProps {
  links: HudLink[];
  /** 聯絡信箱（真實資料） */
  email: string;
}

/**
 * 遊戲 HUD 式頂部導覽：固定、深紫實色面板、像素框線、
 * 當前區塊 selected 狀態（IntersectionObserver scrollspy），手機為像素選單視窗。
 * 高度由 --hud-h 控制，與 section 的 scroll-margin-top 共用同一變數。
 */
export function HudHeader({ links, email }: HudHeaderProps) {
  const [activeId, setActiveId] = useState<string>(links[0]?.id ?? '');
  const [open, setOpen] = useState(false);

  /* scrollspy：視窗中段窄帶判定當前區塊（與既有 LevelIndicator 同一機制） */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    );
    for (const l of links) {
      const el = document.getElementById(l.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [links]);

  /* 手機選單開啟時鎖捲動 + Esc 關閉 */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b-[3px] border-px-ink bg-px-deep/95"
        style={{ height: 'var(--hud-h)' }}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center gap-3 px-3 md:px-6">
          {/* 左：Home 像素圖示 + Portfolio 名 */}
          <a
            href="#title-screen"
            className="flex shrink-0 items-center gap-2 text-px-cream"
            aria-label="回到頂端"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[2px] border-2 border-px-ink bg-px-magenta text-px-white">
              <HomeIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="px-title text-[0.6rem] md:text-[0.68rem]">SU MING-WEI</span>
          </a>

          {/* 中：桌機導覽 */}
          <nav
            aria-label="主要導覽"
            className="ml-auto hidden items-center gap-1 lg:flex"
          >
            {links.map((l) => {
              const active = l.id === activeId;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  aria-current={active ? 'true' : undefined}
                  className={`px-title rounded-[2px] border-2 px-2 py-1.5 text-[0.56rem] transition-colors duration-150 ${
                    active
                      ? 'border-px-ink bg-px-cream text-px-ink'
                      : 'border-transparent text-px-peach hover:border-px-ink hover:bg-px-violet hover:text-px-white'
                  }`}
                >
                  {l.en}
                </a>
              );
            })}
          </nav>

          {/* 右：聯絡（真實 mailto） */}
          <a
            href={`mailto:${email}`}
            className="px-btn px-btn--primary ml-auto hidden !min-h-[36px] !px-3 !py-1.5 !text-[0.56rem] lg:ml-3 lg:inline-flex"
          >
            CONTACT
          </a>

          {/* 手機：選單鈕（44×44 觸控區） */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="hud-menu"
            aria-label={open ? '關閉選單' : '開啟選單'}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-[2px] border-2 border-px-ink bg-px-violet text-px-cream lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </header>

      {/* 手機：像素選單視窗 */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-px-night/85 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            id="hud-menu"
            className="px-panel px-window mx-3 mt-[calc(var(--hud-h)+12px)] p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between pt-1">
              <span className="px-title text-[0.6rem] text-px-cream">MENU</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="關閉選單"
                className="flex h-11 w-11 items-center justify-center rounded-[2px] border-2 border-px-ink bg-px-panel-hi text-px-peach"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="行動版導覽" className="grid gap-1.5">
              {links.map((l) => {
                const active = l.id === activeId;
                return (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'true' : undefined}
                    className={`flex min-h-[44px] items-center justify-between rounded-[2px] border-2 border-px-ink px-3 ${
                      active ? 'bg-px-cream text-px-ink' : 'bg-px-panel-hi text-px-peach'
                    }`}
                  >
                    <span className="px-title text-[0.58rem]">{l.en}</span>
                    <span className="text-sm">{l.zh}</span>
                  </a>
                );
              })}
              <a
                href={`mailto:${email}`}
                onClick={() => setOpen(false)}
                className="px-btn px-btn--primary mt-1 w-full"
              >
                CONTACT
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
