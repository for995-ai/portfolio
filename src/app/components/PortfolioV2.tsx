import { Header } from '@/components/v2/Header';
import { Container, Section, PixelMark } from '@/components/v2/primitives';

interface SectionHeadingProps {
  num: string;
  en: string;
  zh: string;
}

function SectionHeading({ num, en, zh }: SectionHeadingProps) {
  return (
    <div className="mb-12 md:mb-16">
      <PixelMark className="mb-3 block tracking-[0.2em] text-v2-text-muted">
        {num}
      </PixelMark>
      <h2
        className="font-bold leading-tight text-v2-text"
        style={{ fontFamily: 'var(--font-family-v2-display)', fontSize: 'var(--v2-text-h2)' }}
      >
        {en}
        <span className="ml-4 text-[0.6em] font-normal text-v2-text-muted">{zh}</span>
      </h2>
      <div className="mt-5 h-px bg-v2-border" />
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="rounded border border-dashed border-v2-text-faint px-6 py-12 text-center font-mono text-xs tracking-widest text-v2-text-faint">
      {label}
    </div>
  );
}

/** V2 Portfolio — single-page layout with section skeletons.
 *  Hero / section content filled in subsequent phases. */
export function PortfolioV2() {
  return (
    <div className="min-h-svh bg-v2-bg text-v2-text">
      <Header />

      <main>
        <Section id="profile" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="01" en="PROFILE" zh="簡介" />
            <Placeholder label="Profile / Hero — Phase 3" />
          </Container>
        </Section>

        <Section id="education" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="02" en="EDUCATION" zh="教育背景" />
            <Placeholder label="Education — Phase 5" />
          </Container>
        </Section>

        <Section id="experience" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="03" en="EXPERIENCE" zh="經歷" />
            <Placeholder label="Experience Timeline — Phase 6" />
          </Container>
        </Section>

        <Section id="projects" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="04" en="PROJECTS" zh="專案作品" />
            <Placeholder label="Projects — Phase 4" />
          </Container>
        </Section>

        <Section id="research" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="05" en="RESEARCH & AWARDS" zh="研究與競賽" />
            <Placeholder label="Research & Awards — Phase 7" />
          </Container>
        </Section>

        <Section id="skills" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="06" en="SKILLS & DEVELOPMENT" zh="技能與開發" />
            <Placeholder label="Skills & GitHub — Phase 8" />
          </Container>
        </Section>

        <Section id="certifications" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="07" en="CERTIFICATIONS" zh="證照" />
            <Placeholder label="Certifications — Phase 8" />
          </Container>
        </Section>

        <Section id="leadership" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="08" en="LEADERSHIP & SERVICE" zh="領導與服務" />
            <Placeholder label="Leadership — Phase 9" />
          </Container>
        </Section>

        <Section id="notes" className="pt-24 md:pt-32">
          <Container>
            <SectionHeading num="09" en="NOTES" zh="文章" />
            <Placeholder label="Notes — Phase 9" />
          </Container>
        </Section>

        <Section id="contact" className="pt-24 pb-32 md:pt-32">
          <Container>
            <SectionHeading num="10" en="CONTACT" zh="聯絡" />
            <Placeholder label="Contact — Phase 10" />
          </Container>
        </Section>
      </main>

      <footer className="border-t border-v2-border pb-8 pt-6">
        <div className="v2-container text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-v2-text-muted">
            © 2026 蘇洺崴 ｜ SU MING-WEI
          </p>
        </div>
      </footer>
    </div>
  );
}
