import { useInView } from '@/hooks/useInView';
import { ARTICLES } from '@/data/portfolioData';

const sortedArticles = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

function ArchiveCard({
  article,
  index,
}: {
  article: (typeof ARTICLES)[number];
  index: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={`arcade-reveal arcade-reveal-soft ${inView ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${(index % 3) * 60}ms` }}
    >
      {/* 僅左側 2px 細線，無框無漸層（刻意最安靜） */}
      <article className="group flex h-full flex-col border-l-4 border-px-magenta py-1 pl-5">
        <p className="font-mono text-xs tracking-[0.2em] text-arcade-muted">
          {article.date}
        </p>
        <h3 className="zh-heading mt-3 font-sans text-base leading-relaxed text-arcade-text transition-colors duration-[120ms] group-hover:text-dopa-cyan">
          {article.title}
        </h3>
        <p className="zh-body mt-2 max-w-[68ch] flex-1 text-sm text-arcade-text-sec">
          {article.desc}
        </p>
        {/* TODO_待補連結：文章尚無外部網址，先以佔位呈現 */}
        <a
          href="#"
          className="mt-4 inline-block w-fit font-mono text-xs tracking-widest text-arcade-muted transition-colors duration-[120ms] hover:text-arcade-text"
        >
          [ 閱讀文章 ]
        </a>
      </article>
    </div>
  );
}

/**
 * ARCHIVE — 研究筆記：標題左對齊、下方大量留白後才開始內容
 * （結構刻意不同於他區）。無霓虹、無漸層，傳達嚴肅思考。
 */
export function Archive() {
  const title = useInView<HTMLHeadingElement>();

  return (
    <section id="archive" aria-label="文章" className="sgap-11">
      <div className="arcade-container">
        <h2
          ref={title.ref}
          className={`arcade-reveal zh-heading text-h2 whitespace-nowrap font-sans text-px-white ${
            title.inView ? 'is-visible' : ''
          }`}
        >
          <span className="px-title block text-[0.6rem] text-px-coral">NOTES</span>
          文章
        </h2>

        {/* 刻意大量留白 */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:mt-24 md:grid-cols-3">
          {sortedArticles.map((article, i) => (
            <ArchiveCard key={article.title} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
