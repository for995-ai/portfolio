import { useEffect, useState } from 'react';

/**
 * IntersectionObserver scrollspy — returns the id of the section
 * currently occupying the viewport's "active zone".
 * rootMargin mirrors V1 HudHeader: centre-band only (-35% top, -55% bottom).
 */
export function useScrollspy(
  ids: string[],
  rootMargin = '-35% 0px -55% 0px',
): string {
  const [activeId, setActiveId] = useState('');
  const idsKey = ids.join(',');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, rootMargin]);

  return activeId;
}
