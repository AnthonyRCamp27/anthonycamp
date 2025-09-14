import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * UWM Black–Gold–White Portfolio
 * - Single-file React app ready for GitHub Pages
 * - Sticky nav across pages (Home, Education, Projects, Work, Extracurriculars)
 * - Per‑page profile image uploader (stored in localStorage)
 * - Clean, modern UI with Tailwind classes (no external CSS required)
 * - Accessible and responsive
 *
 * HOW TO USE WITH VITE + TAILWIND (recommended for GitHub Pages):
 * 1) npm create vite@latest uwm-portfolio -- --template react
 * 2) cd uwm-portfolio && npm i
 * 3) npm i framer-motion react-router-dom
 * 4) Tailwind: npm i -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
 * 5) In tailwind.config.js: content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
 * 6) In src/index.css add:
 *      @tailwind base; @tailwind components; @tailwind utilities;
 * 7) Replace src/App.jsx with this file's content. Ensure index.jsx imports <App />.
 * 8) For GitHub Pages: set "base" in vite.config.js to "/<your-repo-name>/".
 *    Add script: "deploy": "npm run build && git subtree push --prefix dist origin gh-pages" OR use actions.
 * 9) Start: npm run dev  |  Build: npm run build
 */

// --- UWM THEME ---
const COLORS = {
  black: "#0b0b0b",
  white: "#ffffff",
  gold: "#f1b434", // close to UWM gold
  goldDeep: "#d99a00",
  gray: "#1a1a1a",
};

const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <TopBar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">{children}</main>
      <Footer />
    </div>
  );
};

const Logo = () => (
  <div className="inline-flex items-center gap-2">
    <span
      className="inline-block w-2 h-6 rounded-sm"
      style={{ background: COLORS.gold }}
      aria-hidden
    />
    <span className="font-extrabold tracking-wider text-lg">ANT CAMPBELL</span>
    <span className="hidden sm:inline text-xs opacity-70">| Portfolio</span>
  </div>
);

const TopBar = () => {
  const navItems = [
    { to: "/", label: "Home" },
    { to: "/education", label: "Education" },
    { to: "/projects", label: "Projects" },
    { to: "/work", label: "Work Experience" },
    { to: "/extracurriculars", label: "Extracurriculars" },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/60"
      style={{ background: "rgba(11,11,11,0.6)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/5"
                }`
              }
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="border-t border-white/10 mt-12">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-white/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        © {new Date().getFullYear()} Ant Campbell • Made with React
      </div>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: COLORS.gold }} />
          <span>Black • Gold • White</span>
        </span>
        <a className="underline hover:text-white" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
        <a className="underline hover:text-white" href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </div>
  </footer>
);

// --- Utilities ---
const Section = ({ title, subtitle, children, actions }) => (
  <section className="mb-12">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          <span className="pr-2" style={{ color: COLORS.gold }}>{title}</span>
          <span className="text-white">/</span>
        </h2>
        {subtitle && <p className="text-white/70 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions}
    </div>
    {children}
  </section>
);

// --- Per-page Profile Image Manager (localStorage) ---
function usePageImage() {
  const { pathname } = useLocation();
  const key = `profile-image:${pathname || "/"}`;
  const [src, setSrc] = useState("");

  useEffect(() => {
    const cached = localStorage.getItem(key);
    if (cached) setSrc(cached);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const onFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setSrc(dataUrl);
      localStorage.setItem(key, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const setFromUrl = (url) => {
    setSrc(url);
    localStorage.setItem(key, url);
  };

  const clear = () => {
    setSrc("");
    localStorage.removeItem(key);
  };

  return { src, onFile, setFromUrl, clear };
}

const ImageUploader = () => {
  const { src, onFile, setFromUrl, clear } = usePageImage();
  const [tempUrl, setTempUrl] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="flex items-center gap-3">
        <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-xl border border-white/15 hover:border-white/30 transition">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          Upload photo
        </label>
        <button onClick={clear} className="px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 text-white/80">Clear</button>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="url"
          placeholder="Paste image URL…"
          className="bg-black/40 border border-white/15 rounded-xl px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[rgba(241,180,52,0.4)]"
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
        />
        <button onClick={() => tempUrl && setFromUrl(tempUrl)} className="px-3 py-2 rounded-xl border border-white/15 hover:border-white/30">Set</button>
      </div>
      {src && (
        <div className="mt-2 md:mt-0">
          <img src={src} alt="Profile preview" className="w-20 h-20 object-cover rounded-2xl border border-white/10" />
        </div>
      )}
    </div>
  );
};

// --- Reusable UI Bits ---
const Pill = ({ children }) => (
  <span className="px-3 py-1 rounded-full text-xs font-semibold border border-white/15 bg-white/5">
    {children}
  </span>
);

const Card = ({ children }) => (
  <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-black/20 shadow-lg shadow-black/20">
    {children}
  </div>
);

const CardBody = ({ children }) => (
  <div className="p-5 sm:p-6">
    {children}
  </div>
);

const GoldDivider = () => (
  <div className="h-[2px] w-full my-6" style={{ background: `linear-gradient(90deg, transparent, ${COLORS.gold}, transparent)` }} />
);

// --- Pages ---
const Home = () => (
  <>
    <Hero />
    <Section title="About" subtitle="Quick intro and what I bring to a software team.">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold mb-2">What I Do</h3>
            <p className="text-white/80">Full‑stack flavored problem solver: Python, React, data workflows, and clean deployments. I value reliability, performance, and clear UX.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold mb-2">My Edge</h3>
            <p className="text-white/80">Athlete mindset. I iterate, measure, and improve. I ship polished features and write docs others can follow.</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold mb-2">Now</h3>
            <p className="text-white/80">Seeking software development roles. Building data‑driven sports tools and robust support automations.</p>
          </CardBody>
        </Card>
      </div>
    </Section>
  </>
);

const Hero = () => {
  const { src } = usePageImage();
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black">
      <div className="absolute inset-0 opacity-40" style={{
        background: `radial-gradient(800px 300px at 0% 0%, ${COLORS.gold}22, transparent), radial-gradient(800px 300px at 100% 0%, ${COLORS.goldDeep}22, transparent)`
      }} />
      <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            Building <span style={{ color: COLORS.gold }}>useful</span> software.
          </motion.h1>
          <p className="text-white/80 mt-3 max-w-2xl">
            Graduate technologist and athlete aiming for elite execution—in code and competition. Focused on Python, React, data, and platform reliability.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#projects" className="px-4 py-2 rounded-xl border border-white/15 hover:border-white/30">View Projects</a>
            <a href="mailto:ant@example.com" className="px-4 py-2 rounded-xl" style={{ background: COLORS.gold, color: COLORS.black }}>Contact</a>
          </div>
        </div>
        <div className="w-full md:w-auto">
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl blur-xl opacity-40" style={{ background: COLORS.gold }} />
            <div className="relative rounded-3xl overflow-hidden border border-white/10 w-52 h-64 md:w-64 md:h-80 bg-white/5">
              {src ? (
                <img src={src} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-white/60 text-sm p-4">
                  Upload a per‑page photo using the controls below.
                </div>
              )}
            </div>
          </div>
          <div className="mt-4"><ImageUploader /></div>
        </div>
      </div>
    </div>
  );
};

const Education = () => (
  <>
    <Header title="Education" blurb="Academic path with a forward‑leaning focus on software, AI/ML, and security." />
    <Section title="Degrees" subtitle="What I studied and where it’s taking me.">
      <div className="space-y-4">
        <EduItem school="University of Wisconsin–Milwaukee" degree="M.S. Information Science & Technology (pivoting to AI/ML focus)" dates="2024 – Present" highlights={["Server‑Side Web (Django)", "Engineering Data Analytics", "Security foundations"]} />
        <EduItem school="Vincennes University" degree="A.S. Information Systems" dates="2019 – 2021" highlights={["Programming fundamentals", "Systems thinking"]} />
      </div>
    </Section>
    <Section title="Certs & Training" subtitle="Focused, practical learning that maps to real work.">
      <div className="flex flex-wrap gap-2">
        <Pill>CompTIA A+ / Security+ (studying)</Pill>
        <Pill>CCNA Labs</Pill>
        <Pill>Agile & Scrum</Pill>
        <Pill>Python, Pandas, SQL</Pill>
      </div>
    </Section>
    <GoldDivider />
    <ImageUploader />
  </>
);

const EduItem = ({ school, degree, dates, highlights = [] }) => (
  <Card>
    <CardBody>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">{school}</h3>
          <p className="text-white/80">{degree}</p>
        </div>
        <div className="text-white/60">{dates}</div>
      </div>
      {highlights.length > 0 && (
        <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 text-white/80 list-disc list-inside">
          {highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}
    </CardBody>
  </Card>
);

const Projects = () => {
  const items = useMemo(() => [
    {
      title: "PRogress – Track & Field Analytics",
      descr: "Streamlit + Python app for performance tracking (100m/200m/Long Jump) with trend lines and goals.",
      tags: ["Python", "Streamlit", "Pandas", "Plotly"],
      link: "#",
    },
    {
      title: "Long Jump Performance Analysis",
      descr: "Data wrangling + visualization; wind/altitude effects; reproducible notebooks.",
      tags: ["Python", "Pandas", "Matplotlib"],
      link: "#",
    },
    {
      title: "Knowledge Base → AI Automation",
      descr: "Migrated KB to new platform and connected to AI for support workflows (Freshdesk integration).",
      tags: ["Automation", "APIs", "Freshdesk"],
      link: "#",
    },
  ], []);

  return (
    <>
      <Header title="Projects" blurb="A few builds that show how I think and ship." />
      <Section title="Selected Work" subtitle="Click through or view code on GitHub.">
        <div id="projects" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))}
        </div>
      </Section>
      <GoldDivider />
      <ImageUploader />
    </>
  );
};

const ProjectCard = ({ title, descr, tags = [], link = "#" }) => (
  <Card>
    <CardBody>
      <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      <p className="text-white/80 mt-1">{descr}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((t, i) => (
          <Pill key={i}>{t}</Pill>
        ))}
      </div>
      <div className="mt-4">
        <a href={link} className="underline hover:text-white">View</a>
      </div>
    </CardBody>
  </Card>
);

const Work = () => (
  <>
    <Header title="Work Experience" blurb="Hands‑on IT + platform support with a software builder’s mindset." />
    <Section title="Roles" subtitle="Impact, not just responsibilities.">
      <div className="space-y-4">
        <RoleCard
          company="eGalvanic"
          title="Electrical Facilities AI Platform Support Specialist"
          dates="2024 – Present"
          points={[
            "Integrated knowledge base with AI workflows; accelerated ticket triage using Freshdesk APIs.",
            "Built data pipelines and troubleshooting playbooks to reduce MTTR.",
            "Partnered with engineers to turn recurring issues into product fixes and docs.",
          ]}
        />
        <RoleCard
          company="UWM (Help Desk / Tech Support)"
          title="IT Support"
          dates="2021 – 2024"
          points={[
            "Resolved Windows/macOS/mobile issues; AD, VPN, and remote support.",
            "Trained non‑technical users; wrote concise SOPs and quick‑start guides.",
          ]}
        />
      </div>
    </Section>
    <GoldDivider />
    <ImageUploader />
  </>
);

const RoleCard = ({ company, title, dates, points = [] }) => (
  <Card>
    <CardBody>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold">{company}</h3>
          <p className="text-white/80">{title}</p>
        </div>
        <div className="text-white/60">{dates}</div>
      </div>
      {points.length > 0 && (
        <ul className="mt-3 space-y-2 list-disc list-inside text-white/80">
          {points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      )}
    </CardBody>
  </Card>
);

const Extracurriculars = () => (
  <>
    <Header title="Extracurriculars" blurb="Leadership and athletics that shape how I work." />
    <Section title="Highlights" subtitle="Outside the classroom and office.">
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold">Track & Field – Long Jump</h3>
            <p className="text-white/80">High‑level collegiate athlete; data‑driven training and performance analysis.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>Team Leadership</Pill>
              <Pill>Discipline</Pill>
              <Pill>Goal Setting</Pill>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-lg font-bold">Youth Basketball Coach</h3>
            <p className="text-white/80">Mentored players on fundamentals, teamwork, and mindset.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill>Communication</Pill>
              <Pill>Mentorship</Pill>
              <Pill>Community</Pill>
            </div>
          </CardBody>
        </Card>
      </div>
    </Section>
    <GoldDivider />
    <ImageUploader />
  </>
);

const Header = ({ title, blurb }) => (
  <div className="mb-8">
    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
      <span style={{ color: COLORS.gold }}>{title}</span>
      <span className="text-white">.</span>
    </h1>
    {blurb && <p className="text-white/80 mt-2 max-w-2xl">{blurb}</p>}
  </div>
);

export default function App() {
  return (
    <BrowserRouter basename={import.meta?.env?.BASE_URL || "/"}>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/education" element={<Education />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/work" element={<Work />} />
          <Route path="/extracurriculars" element={<Extracurriculars />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
