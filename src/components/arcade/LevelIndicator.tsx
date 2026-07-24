import { useEffect, useState } from 'react';

export interface LevelAnchor {
  id: string;
  label: string;
  name: string;
}

interface LevelIndicatorProps {
  levels: LevelAnchor[];
}

/**
 * 右側固定關卡指示器：當前為 dopa-cyan 實心點＋光暈＋左側短線滑入，
 * 其餘 arcade-faint 空心點；hover 顯示關卡名。手機（<1024px）隱藏。
 */
export function LevelIndicator({ levels }: LevelIndicatorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      // 視窗中段窄帶判定當前 section
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    for (const level of levels) {
      const el = document.getElementById(level.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [levels]);

  return (
    <nav
      aria-label="頁面導覽"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex"
    >
      {levels.map((level) => {
        const active = level.id === activeId;
        return (
          <a
            key={level.id}
            href={`#${level.id}`}
            aria-label={`${level.label} ${level.name}`.trim()}
            aria-current={active ? 'true' : undefined}
            className="group flex items-center gap-2"
          >
            {/* 當前項目左側 2px 短線滑入 */}
            <span
              className={`block h-[2px] bg-dopa-cyan transition-all duration-[220ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                active ? 'w-5 opacity-100' : 'w-0 opacity-0'
              }`}
              aria-hidden="true"
            />
            {/* 名稱：hover 或當前時顯示（無 LV. 前綴） */}
            <span
              className={`whitespace-nowrap font-mono text-xs tracking-widest transition-opacity duration-[120ms] ${
                active
                  ? 'text-dopa-cyan opacity-100'
                  : 'text-arcade-muted opacity-0 group-hover:opacity-100'
              }`}
            >
              {level.label}
              {level.name && (
                <span className={`cjk font-sans ${level.label ? 'ml-1.5' : ''}`}>
                  {level.name}
                </span>
              )}
            </span>
            {/* 點：當前實心 cyan＋光暈，其餘 faint 空心 */}
            <span
              className={`block h-2 w-2 rounded-full transition-colors duration-[220ms] ${
                active
                  ? 'bg-dopa-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]'
                  : 'border border-arcade-faint group-hover:border-arcade-muted'
              }`}
              aria-hidden="true"
            />
          </a>
        );
      })}
    </nav>
  );
}
