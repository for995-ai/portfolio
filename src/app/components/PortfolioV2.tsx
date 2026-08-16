import {
  projectCount,
  competitionCount,
  researchCount,
  TUTORING_HOURS,
} from '@/data/portfolioV2';
import { Header }     from '@/components/v2/Header';
import { Hero }       from '@/components/v2/Hero';
import { Education }  from '@/components/v2/Education';
import { Experience } from '@/components/v2/Experience';
import { Projects }   from '@/components/v2/Projects';
import { GitHub }     from '@/components/v2/GitHub';
import { Research }   from '@/components/v2/Research';
import { Awards }     from '@/components/v2/Awards';
import { Leadership } from '@/components/v2/Leadership';
import { Footer }     from '@/components/v2/Footer';
import { Container, Section } from '@/components/v2/primitives';
import { useInView } from '@/hooks/useInView';

// ── Section heading ───────────────────────────────────────────────────────────

interface SectionHeadingProps { en: string; zh: string; }

function SectionHeading({ en, zh }: SectionHeadingProps) {
  return (
    <div className="v2-section-divider" data-section-heading>
      <h2
        style={{
          fontFamily: 'var(--font-family-v2-display)',
          fontSize: 'var(--v2-text-h2)',
          fontWeight: 700,
          lineHeight: 1.2,
          color: 'var(--v2-text)',
        }}
      >
        {en}
      </h2>
      <span
        style={{
          fontSize: '0.8125rem',
          fontWeight: 400,
          color: 'var(--v2-text-muted)',
        }}
      >
        {zh}
      </span>
    </div>
  );
}

// ── About — intro paragraph ───────────────────────────────────────────────────

function AboutIntro() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  return (
    <div ref={ref} className={`v2-reveal ${inView ? 'is-visible' : ''}`}>
      <p
        className="mx-auto text-center leading-[1.7] text-v2-text-sec md:leading-[1.75]"
        style={{
          maxWidth: '1000px',
          fontSize: 'clamp(1.0625rem, 3.4vw, 1.75rem)',
          fontFamily: 'var(--font-family-v2-display)',
          fontWeight: 400,
          textWrap: 'pretty',
        }}
      >
        以資訊管理為基礎，探索{' '}
        <span style={{ color: 'var(--v2-purple)', fontWeight: 600 }}>UI/UX 設計</span>
        、
        <span style={{ color: 'var(--v2-purple)', fontWeight: 600 }}>前端互動開發</span>
        {' '}與{' '}
        <span style={{ color: 'var(--v2-cyan)', fontWeight: 700 }}>AI 應用</span>
        {' '}在互動學習與文化科技領域的設計可能。
      </p>
    </div>
  );
}

// ── Stat cards ────────────────────────────────────────────────────────────────

const STATS = [
  { value: projectCount,     label: '件作品',  context: 'UI/UX · 前端 · AI'  },
  { value: competitionCount, label: '項競賽',  context: '創意・設計・解題'      },
  { value: researchCount,    label: '篇研討會', context: 'Conference Paper'    },
  { value: TUTORING_HOURS,   label: '小時課輔', context: '偏鄉教育服務'         },
] as const;

function StatCards() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className={`v2-reveal ${inView ? 'is-visible' : ''} mt-8 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-5`}
    >
      {STATS.map(({ value, label, context }) => (
        <div key={label} className="v2-stat-card px-5 py-6 text-center">
          <p
            className="font-bold leading-none text-v2-text"
            style={{ fontFamily: 'var(--font-family-v2-display)', fontSize: 'clamp(2rem, 3.5vw, 2.5rem)' }}
          >
            {value}
          </p>
          <p
            className="mt-2 text-v2-text"
            style={{ fontFamily: 'var(--font-family-v2-display)', fontSize: '0.82rem', fontWeight: 500 }}
          >
            {label}
          </p>
          <p className="mt-2 font-mono text-v2-text-faint" style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
            {context}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function PortfolioV2() {
  return (
    <div className="min-h-svh bg-v2-bg text-v2-text">
      <Header />

      <main>
        <Hero />

        {/* 01 — About / Intro + Stats */}
        <Section id="about" className="py-12 md:py-14">
          <Container>
            <AboutIntro />
            <StatCards />
          </Container>
        </Section>

        {/* 02 — Education */}
        <Section id="education" className="py-12 md:py-14">
          <Container>
            <SectionHeading en="Education" zh="教育背景" />
            <Education />
          </Container>
        </Section>

        {/* 03 — Experience */}
        <Section id="experience" className="py-12 md:py-14">
          <Container>
            <SectionHeading en="Experience" zh="工作經歷" />
            <Experience />
          </Container>
        </Section>

        {/* 04 — Projects */}
        <Section id="projects" className="py-12 md:py-14">
          <Container>
            <SectionHeading en="Projects" zh="專案作品" />
            <Projects />
          </Container>
        </Section>

        {/* 05 — GitHub */}
        <Section id="github" className="py-12 md:py-14">
          <Container>
            <SectionHeading en="GitHub" zh="開發主頁" />
            <GitHub />
          </Container>
        </Section>

        {/* 06 — Research & Competitions */}
        <Section id="research" className="py-12 md:py-14">
          <Container>
            <SectionHeading en="Research" zh="研究與實作" />
            <Research />
          </Container>
        </Section>

        {/* 07 — Awards & Certifications */}
        <Section id="awards" className="py-12 md:py-14">
          <Container>
            <SectionHeading en="Awards & Certifications" zh="獎項證明" />
            <Awards />
          </Container>
        </Section>

        {/* 08 — Leadership & Service */}
        <Section id="leadership" className="py-12 md:py-14">
          <Container>
            <SectionHeading en="Leadership & Service" zh="社團與服務" />
            <Leadership />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
