import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import SEO from '../components/SEO';
import Slime from '../components/Slime';
import ViewSwitch from '../components/ViewSwitch';
import { getBlogsData } from '../services/dataService';
import { generateCV } from '../services/pdfGenerator';
import './Home.css';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'shipped', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];

const CATEGORIES = ['All', 'Computer Vision', 'AI & ML', 'Cybersecurity', 'Web Development', 'Desktop Application'];

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const SOCIAL = { GitHub: 'GitHub', LinkedIn: 'LinkedIn', 'X (Twitter)': 'X', Email: 'Email', YouTube: 'YouTube', Instagram: 'Instagram' };

const SECTION_LINE = {
  about: null,
  shipped: 'Explore my computer vision projects, models, and desktop applications.',
  experience: 'Senior Computer Vision Engineer at Airloop & MS in Information Security at NUST.',
  education: 'Academic qualifications from NUST and GIKI.',
  skills: 'Technical stack in PyTorch, TensorFlow, OpenCV, FastAPI, and Docker.',
  writing: 'Technical engineering articles and computer vision tutorials.',
  contact: 'Have an AI project or computer vision challenge? Let\'s connect.',
};

const NAME_SPOT = '.name .word:first-child';
const INTRO = "Hi! I'm Zahid's AI assistant. Welcome to Zahid Marwat's portfolio!";
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const stamp = () => new Date().toTimeString().slice(0, 8);
const STILL = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function useInView(ref, opts) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), opts);
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, opts]);
  return seen;
}
const STRIKE_OPTS = { rootMargin: '0px 0px -30% 0px' };
const REVEAL_OPTS = { rootMargin: '0px 0px -10% 0px' };

function CountUp({ value }) {
  const ref = useRef(null);
  const seen = useInView(ref, REVEAL_OPTS);
  const [n, setN] = useState(value);
  useEffect(() => {
    if (!seen || STILL) return;
    const target = Number(value.match(/\d[\d,]*/)[0].replace(/,/g, ''));
    let raf; const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 700), e = 1 - Math.pow(1 - k, 3);
      setN(value.replace(/\d[\d,]*/, Math.round(target * (0.7 + 0.3 * e)).toLocaleString('en-US')));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  return <dt ref={ref}>{n}</dt>;
}
CountUp.propTypes = { value: PropTypes.string.isRequired };

function ProjectCard({ p, i, onHover, onOpenViewer }) {
  const ref = useRef(null);
  const struck = useInView(ref, STRIKE_OPTS);
  const shown = useInView(ref, REVEAL_OPTS);

  const images = useMemo(() => {
    return p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
  }, [p]);

  const [activeShotIdx, setActiveShotIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveShotIdx((prev) => (prev + 1) % images.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [images]);

  const tilt = (e) => {
    if (STILL) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--rx', (((e.clientY - r.top) / r.height - 0.5) * -3).toFixed(2));
    ref.current.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 4).toFixed(2));
  };

  const reset = () => {
    if (ref.current) {
      ref.current.style.setProperty('--rx', 0);
      ref.current.style.setProperty('--ry', 0);
    }
    onHover(null);
  };

  const currentShot = images[activeShotIdx] || p.image || images[0];
  const shotCount = images.length || 1;

  return (
    <article
      ref={ref}
      id={`card-${slug(p.name)}`}
      className={`project-card${struck ? ' is-struck' : ''}${shown ? ' is-shown' : ''}`}
      style={{ '--i': i % 2 }}
      onMouseEnter={() => onHover(p)}
      onMouseMove={tilt}
      onMouseLeave={reset}
      onFocus={() => onHover(p)}
      onBlur={() => onHover(null)}
    >
      {/* Cover Image Stage with Auto-Slide */}
      {currentShot ? (
        <div className="card-img-stage" onClick={() => onOpenViewer(p, activeShotIdx)}>
          <img src={currentShot} alt={p.name} loading="lazy" key={currentShot} className="card-slide-img" />
          <div className="card-img-overlay" />
          <span className="card-img-badge-left">{p.category || 'Computer Vision'}</span>
          <span className="card-img-badge-right">
            <EyeIcon />
            <span>{shotCount > 1 ? `Shot ${activeShotIdx + 1}/${shotCount}` : '1 shot'}</span>
          </span>
        </div>
      ) : (
        <div
          className="card-img-stage"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#fff', borderBottom: '1px solid var(--rule)' }}
          onClick={() => onOpenViewer(p, 0)}
        >
          <span className="card-img-badge-left">{p.category || 'AI & ML'}</span>
          <h4 style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '16px' }}>{p.name}</h4>
        </div>
      )}

      {/* Content Body */}
      <div className="card-body">
        <div className="card-body-header">
          <h3>{p.name}</h3>
          <span className="card-year-pill">{p.year || '2024'}</span>
        </div>

        {p.problem && (
          <p className="card-problem" style={{ marginBottom: '8px' }}>
            <em>problem</em>
            <span>{p.problem}</span>
          </p>
        )}

        <p className="card-fix" style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.5' }}>
          {p.longDescription || p.fix || p.description}
        </p>

        {p.features && p.features.length > 0 && (
          <div className="card-features">
            <span className="card-features-title">Key Features:</span>
            <ul className="card-features-list">
              {p.features.map((feat, fIdx) => (
                <li key={fIdx}>
                  <span className="feature-dot" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(p.tags || p.technologies) && (
          <div className="card-tags">
            {(p.tags || p.technologies).map((t) => (
              <span key={t} className="tag-pill">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar - GitHub Code Link (Demo button removed) */}
      <div className="card-action-bar">
        <button type="button" className="btn-shots" onClick={() => onOpenViewer(p, activeShotIdx)}>
          <EyeIcon />
          <span>View Screenshots ({shotCount})</span>
        </button>

        <div className="card-action-links">
          {(p.repo || p.githubUrl) && (
            <a href={p.repo || p.githubUrl} target="_blank" rel="noreferrer" className="card-action-btn" title="GitHub Repository">
              <GithubIcon />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

ProjectCard.propTypes = {
  p: PropTypes.object.isRequired,
  i: PropTypes.number.isRequired,
  onHover: PropTypes.func.isRequired,
  onOpenViewer: PropTypes.func.isRequired,
};

function ProjectViewerModal({ project, index, onClose, onPrev, onNext, onJump }) {
  const images = project?.images && project.images.length > 0 ? project.images : (project?.image ? [project.image] : []);

  useEffect(() => {
    if (!project) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext, project]);

  // Lightbox auto-slideshow
  useEffect(() => {
    if (!project || images.length <= 1) return undefined;
    const timer = setInterval(() => {
      onNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length, onNext, project]);

  if (!project) return null;

  return (
    <div className="pmodal-overlay" onClick={onClose}>
      <div className="pmodal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pmodal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="pmodal-title">{project.name}</span>
            <span className="pmodal-category">{project.category || 'Computer Vision'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(project.repo || project.githubUrl) && (
              <a
                href={project.repo || project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="card-action-btn"
                style={{ fontSize: '0.75rem', padding: '4px 10px' }}
              >
                <GithubIcon /> GitHub ↗
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '1.25rem', cursor: 'pointer', padding: '2px 8px' }}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Stage */}
        <div className="pmodal-stage">
          {images.length > 0 ? (
            <img src={images[index]} alt={`${project.name} screenshot ${index + 1}`} />
          ) : (
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No preview screenshots available</div>
          )}

          {images.length > 1 && (
            <>
              <button type="button" className="pmodal-nav-btn prev" onClick={onPrev} aria-label="Previous screenshot">
                <ChevronLeftIcon />
              </button>
              <button type="button" className="pmodal-nav-btn next" onClick={onNext} aria-label="Next screenshot">
                <ChevronRightIcon />
              </button>
            </>
          )}

          {images.length > 0 && (
            <div className="pmodal-counter">{index + 1} / {images.length}</div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="pmodal-thumbs">
            {images.map((src, i) => (
              <div
                key={src + i}
                className={`pmodal-thumb${i === index ? ' active' : ''}`}
                onClick={() => onJump(i)}
              >
                <img src={src} alt={`Thumbnail ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

ProjectViewerModal.propTypes = {
  project: PropTypes.object,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onJump: PropTypes.func.isRequired,
};

const Letters = ({ text }) => (
  <span className="letters" aria-label={text}>
    {text.split(' ').map((w, wi) => (
      <span key={wi} className="word" aria-hidden="true">
        {[...w].map((c, ci) => <span key={ci} style={{ '--d': `${(wi * 6 + ci) * 18}ms` }}>{c}</span>)}
      </span>
    ))}
  </span>
);
Letters.propTypes = { text: PropTypes.string.isRequired };

export default function Home({ portfolioData }) {
  const { personal = {}, social = [], experience = [], education = [], skills = {}, certs = [], certifications = [] } = portfolioData;
  const problems = useMemo(() => portfolioData.problems || portfolioData.projects || [], [portfolioData.problems, portfolioData.projects]);
  const hunting = portfolioData.hunting || [];
  const youtube = portfolioData.youtube;

  const [section, setSection] = useState('about');
  const [blogs, setBlogs] = useState([]);
  const [focus, setFocus] = useState(null);
  const [spot, setSpot] = useState(NAME_SPOT);
  const [chat, setChat] = useState(() => ({ say: window.innerWidth < 700 ? null : INTRO, mood: 'happy' }));
  const [log, setLog] = useState(() => [{ t: stamp(), m: 'booted. landing on his name' }]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projectIndex, setProjectIndex] = useState(0);
  const [viewerProject, setViewerProject] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return problems;
    return problems.filter((p) => p.category === selectedCategory);
  }, [problems, selectedCategory]);

  const totalProjects = filteredProjects.length || 1;
  const safeActiveIndex = ((projectIndex % totalProjects) + totalProjects) % totalProjects;
  const currentProject = filteredProjects[safeActiveIndex] || filteredProjects[0];

  const nextProject = useCallback(() => {
    setProjectIndex((prev) => (prev + 1) % totalProjects);
  }, [totalProjects]);

  const prevProject = useCallback(() => {
    setProjectIndex((prev) => (prev - 1 + totalProjects) % totalProjects);
  }, [totalProjects]);

  const openViewer = useCallback((proj, startIndex = 0) => {
    setViewerProject(proj);
    setViewerIndex(startIndex);
  }, [setViewerIndex]);

  const closeViewer = useCallback(() => {
    setViewerProject(null);
    setViewerIndex(0);
  }, [setViewerIndex]);

  const prevModalSlide = useCallback(() => {
    if (!viewerProject) return;
    const imgs = viewerProject.images && viewerProject.images.length > 0 ? viewerProject.images : (viewerProject.image ? [viewerProject.image] : []);
    if (imgs.length === 0) return;
    setViewerIndex((i) => (i - 1 + imgs.length) % imgs.length);
  }, [viewerProject, setViewerIndex]);

  const nextModalSlide = useCallback(() => {
    if (!viewerProject) return;
    const imgs = viewerProject.images && viewerProject.images.length > 0 ? viewerProject.images : (viewerProject.image ? [viewerProject.image] : []);
    if (imgs.length === 0) return;
    setViewerIndex((i) => (i + 1) % imgs.length);
  }, [viewerProject, setViewerIndex]);

  const idle = useRef(null);
  const sleeping = useRef(false);
  const navigate = useNavigate();
  const leaving = useRef(false);
  const hush = useRef(null);

  const note = useCallback((m) => setLog((l) => (l[0]?.m === m ? l : [{ t: stamp(), m }, ...l].slice(0, 5))), []);
  const speak = useCallback((say, mood = 'idle', ms = 3600) => {
    setChat({ say, mood });
    clearTimeout(hush.current);
    hush.current = setTimeout(() => setChat((c) => (c.say === say ? { say: null, mood: c.mood === 'sleepy' ? 'sleepy' : 'idle' } : c)), ms);
  }, []);

  useEffect(() => { getBlogsData().then((d) => setBlogs(d.blogs || [])).catch(() => {}); }, []);
  useEffect(() => {
    hush.current = setTimeout(() => setChat((c) => (c.say === INTRO ? { say: null, mood: 'idle' } : c)), 4200);
    return () => clearTimeout(hush.current);
  }, []);

  useEffect(() => {
    const wake = () => {
      clearTimeout(idle.current);
      if (sleeping.current) { sleeping.current = false; speak("Oh! You're back.", 'wow', 2200); note('woke up'); }
      idle.current = setTimeout(() => {
        sleeping.current = true;
        setChat({ say: 'zz… (move the mouse)', mood: 'sleepy' });
        note('dozing. nobody is scrolling');
      }, 25000);
    };
    wake();
    const evs = ['pointermove', 'keydown', 'scroll', 'touchstart'];
    evs.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    return () => { clearTimeout(idle.current); evs.forEach((e) => window.removeEventListener(e, wake)); };
  }, [note, speak]);

  const lastSection = useRef('about');
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting || e.target.id === lastSection.current) return;
      const id = e.target.id; lastSection.current = id;
      setSection(id);
      if (window.matchMedia('(hover: none)').matches) setFocus(null);

      const target = { about: NAME_SPOT, writing: '.posts', contact: '.mail' }[id];
      if (target) setSpot(target);

      if (!sleeping.current) {
        note(`reading ${id}`);
        if (SECTION_LINE[id]) speak(SECTION_LINE[id]);
      }
    }), { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [note, speak]);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      setSpot(`#${e.target.id}`);
      const p = problems.find((x) => `card-${slug(x.name)}` === e.target.id);
      if (p) { note(`sitting on ${p.name}`); if (window.matchMedia('(hover: none)').matches && p.zahid) speak(p.zahid, p.zahidMood || 'happy', 3200); }
    }), { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('.card, .project-card, .job').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [problems, experience, note, speak]);

  const onCard = (p) => {
    if (!p) { setFocus(null); return; }
    setFocus({ perch: `#card-${slug(p.name)}`, say: p.zahid || null, mood: p.zahidMood || 'happy' });
    note(`hopped onto ${p.name}`);
  };

  const onPoke = () => {
    if (leaving.current) return;
    leaving.current = true;
    setFocus(null);
    speak("Come on, I'll show you my world!", 'happy', 1400);
    note('opening the world');
    setTimeout(() => navigate('/'), STILL ? 0 : 1100);
  };

  const assistant = focus || { perch: spot, ...chat };
  const email = personal.email;
  const years = (y) => y?.match(/\d{4}/)?.[0] || y;
  const certList = certifications.length > 0 ? certifications : certs;

  return (
    <div className="pf">
      <SEO
        title="Zahid Marwat · Senior Computer Vision Engineer & AI Specialist"
        description={personal.tagline}
        name="Zahid Marwat"
        keywords="Zahid Marwat, zahid-marwat, Computer Vision, AI Engineer, PyTorch, TensorFlow, OpenCV, FastAPI, Islamabad"
      />
      <a className="skip" href="#about">Skip to content</a>

      <ViewSwitch />
      <Slime perch={assistant.perch} say={assistant.say} mood={assistant.mood} onPoke={onPoke} />

      <div className="pf-grid">
        <header className="pf-side">
          <div className="side-top">
            <h1 className="name"><Letters text={personal.name || 'Zahid Marwat'} /></h1>
            <p className="role rise" style={{ '--d': '140ms' }}>{personal.title}</p>
            <p className="tagline rise" style={{ '--d': '173ms' }}>{personal.tagline}</p>
            <p className="stack rise" style={{ '--d': '206ms' }}>{(personal.stack || []).join(' · ')} <span className="open"><span className="live-dot" aria-hidden="true" />Available for hire</span></p>

            <div className="klog rise" style={{ '--d': '240ms' }} aria-label="AI Log">
              <div className="klog-head"><span className="live-dot" aria-hidden="true" />zahid.log<span className="dim">AI assistant status</span></div>
              <ol aria-live="polite">
                {log.map((l, i) => <li key={l.t + l.m} style={{ opacity: 1 - i * 0.2 }}><time>{l.t}</time>{l.m}</li>)}
              </ol>
            </div>

            <nav className="side-nav rise" style={{ '--d': '273ms' }} aria-label="Sections">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className={section === s.id ? 'active' : ''}>
                  <span className="tick" aria-hidden="true" />{s.label}
                  {s.id === 'shipped' && <sup>{problems.length}</sup>}
                </a>
              ))}
            </nav>
          </div>

          <ul className="socials rise" style={{ '--d': '300ms' }}>
            <li><button type="button" className="cv" onClick={() => generateCV(portfolioData)}>Download CV ↓</button></li>
            {social.map((s) => (
              <li key={s.platform}><a href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform}>{s.platform}</a></li>
            ))}
          </ul>
        </header>

        <nav className="mbar" aria-label="Sections">
          <div className="mbar-links">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={section === s.id ? 'active' : ''}>{s.label}</a>
            ))}
          </div>
        </nav>

        <main className="pf-main">
          <section id="about" aria-label="About">
            <p className="lede rise" style={{ '--d': '100ms' }}>{personal.bio}</p>
            <dl className="facts rise" style={{ '--d': '166ms' }}>
              <div><CountUp value="3+" /><dd>Years in AI &amp; Computer Vision</dd></div>
              <div><CountUp value="50+" /><dd>Deep Learning &amp; CV Projects Delivered</dd></div>
              <div><CountUp value="95%+" /><dd>Accuracy on Real-time Object Detection Models</dd></div>
            </dl>
          </section>

          <section id="experience" aria-labelledby="h-exp">
            <h2 id="h-exp" className="eyebrow">Experience</h2>
            <ol className="jobs">
              {experience.map((j, i) => {
                const logoUrl = j.logo || j.companyLogo || (j.company === 'Airloop' ? '/assets/airloop_logo.png' : null);
                return (
                  <li key={j.company + j.position} id={`job-${i}`} className="job">
                    <div className="job-left" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span className="when">{years(j.startDate)} — {j.endDate === 'Present' ? 'now' : years(j.endDate)}</span>
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt={j.company}
                          style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '8px', background: '#ffffff', padding: '4px', border: '1px solid var(--rule)' }}
                        />
                      )}
                    </div>
                    <div>
                      <h3>{j.position} <span className="at">· {j.company}</span></h3>
                      <ul>{(j.responsibilities || []).map((r, idx) => <li key={idx}>• {r}</li>)}</ul>
                      {j.technologies && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                          {j.technologies.map((tech) => (
                            <span key={tech} className="tag-pill">{tech}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section id="education" aria-labelledby="h-edu">
            <h2 id="h-edu" className="eyebrow">Education</h2>
            <ol className="jobs">
              {education.map((e) => {
                const eduLogo = e.logo || e.institutionLogo || (e.institution.includes('NUST') ? '/assets/NUST.png' : (e.institution.includes('GIKI') ? '/assets/GIKI.png' : null));
                return (
                  <li key={e.institution + e.degree} className="job">
                    <div className="job-left" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span className="when">{e.duration}</span>
                      {eduLogo && (
                        <img
                          src={eduLogo}
                          alt={e.institution}
                          style={{ width: '44px', height: '44px', objectFit: 'contain', borderRadius: '8px', background: '#ffffff', padding: '4px', border: '1px solid var(--rule)' }}
                        />
                      )}
                    </div>
                    <div>
                      <h3>{e.degree} <span className="at">· {e.institution}</span></h3>
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '4px' }}>GPA: {e.gpa} • {e.location}</p>
                      {e.coursework && (
                        <p style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--ink)' }}>
                          <strong>Coursework:</strong> {e.coursework.join(', ')}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section id="shipped" aria-labelledby="h-shipped">
            <h2 id="h-shipped" className="eyebrow">Projects &amp; AI Systems</h2>

            {/* Category Filter Pills */}
            <div className="category-filters">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`cat-pill${selectedCategory === cat ? ' active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setProjectIndex(0);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Carousel Navigation Control Bar */}
            <div className="carousel-nav-bar">
              <span className="carousel-counter">
                Project {safeActiveIndex + 1} of {filteredProjects.length}
              </span>

              <div className="carousel-arrows">
                <button
                  type="button"
                  onClick={prevProject}
                  className="carousel-arrow-btn"
                  aria-label="Previous project"
                >
                  <ChevronLeftIcon />
                </button>
                <button
                  type="button"
                  onClick={nextProject}
                  className="carousel-arrow-btn"
                  aria-label="Next project"
                >
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            {/* Project Showcase Stage */}
            {currentProject && (
              <ProjectCard
                key={`${currentProject.name}-${safeActiveIndex}`}
                p={currentProject}
                i={safeActiveIndex}
                onHover={onCard}
                onOpenViewer={openViewer}
              />
            )}

            {/* Pagination Dots */}
            {filteredProjects.length > 1 && (
              <div className="carousel-dots">
                {filteredProjects.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setProjectIndex(idx)}
                    className={`carousel-dot${idx === safeActiveIndex ? ' active' : ''}`}
                    aria-label={`Go to project slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {hunting.length > 0 && (
              <div className="hunting">
                <h3 className="eyebrow"><span className="pulse" aria-hidden="true" />Active R&amp;D Initiatives</h3>
                <ul>{hunting.map((h) => <li key={h.text}><a href={h.repo} target="_blank" rel="noreferrer">{h.text} ↗</a></li>)}</ul>
              </div>
            )}
          </section>

          <section id="skills" aria-labelledby="h-skills">
            <h2 id="h-skills" className="eyebrow">Technical Skills &amp; Certifications</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {Object.entries(skills).map(([category, items]) => (
                <div key={category} style={{ background: 'var(--card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--rule)' }}>
                  <h4 style={{ color: 'var(--signal)', marginBottom: '10px', fontSize: '0.95rem', fontWeight: '600' }}>{category}</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {items.map((item) => (
                      <li key={item} style={{ fontSize: '0.85rem', color: 'var(--ink)', marginBottom: '4px' }}>✓ {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {certList.length > 0 && (
              <div>
                <h3 className="eyebrow" style={{ marginTop: '24px', marginBottom: '12px' }}>Verified Certifications</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {certList.map((c, idx) => (
                    <li key={idx} style={{ background: 'var(--card)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--rule)' }}>
                      <a href={c.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--ink)' }}>{c.title} ↗</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '2px' }}>{c.issuer} • {c.date}</div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section id="writing" aria-labelledby="h-writing">
            <h2 id="h-writing" className="eyebrow">Writing &amp; Articles</h2>
            <ul className="posts">
              {blogs.slice(0, 4).map((b) => (
                <li key={b.slug}><Link to={`/blog/${b.slug}`}><span>{b.title}</span><span className="arrow" aria-hidden="true">→</span></Link></li>
              ))}
              {(youtube?.channels || []).map((c) => (
                <li key={c.handle}><a href={c.url} target="_blank" rel="noreferrer"><span>{c.name} on YouTube <em>{c.handle}</em></span><span className="arrow" aria-hidden="true">↗</span></a></li>
              ))}
            </ul>
            <Link className="more" to="/blog">All posts →</Link>
          </section>

          <section id="contact" aria-labelledby="h-contact">
            <h2 id="h-contact" className="big">Looking for a Computer Vision Engineer?</h2>
            <a
              className="mail" href={`mailto:${email}`}
              onMouseEnter={() => { setFocus({ perch: '.mail', say: 'Send a message! Zahid reads every email.', mood: 'wink' }); note('pointing at the email'); }}
              onMouseLeave={() => setFocus(null)}
            >{email}</a>
          </section>

          <footer className="pf-foot">Built for Zahid Marwat · Computer Vision Engineer &amp; AI Specialist.</footer>
        </main>
      </div>

      {/* Lightbox Screenshot Modal */}
      <ProjectViewerModal
        project={viewerProject}
        index={viewerIndex}
        onClose={closeViewer}
        onPrev={prevModalSlide}
        onNext={nextModalSlide}
        onJump={(i) => setViewerIndex(i)}
      />
    </div>
  );
}

Home.propTypes = { portfolioData: PropTypes.object.isRequired };
