import { useState } from 'react'
import portrait from './assets/kelvin-portrait.png'
import scholarData from './data/scholar.json'
import experienceData from './data/experience.json'
import researchAreaData from './data/researchArea.json'
import projectData from './data/project.json'
import './App.css'

const navigation = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Research', 'research'],
  ['Publications', 'publications'],
  ['Projects', 'projects'],
  ['Experience', 'experience'],
  ['Contact', 'contact'],
]

const researchAreas = researchAreaData.data
const projects = projectData.data
const experience = experienceData.data
const { metrics, publications } = scholarData
const citationHistory = scholarData.citationHistory || []

function SectionLabel({ children }) {
  return <p className="section-label"><span />{children}</p>
}

function Arrow({ diagonal = false }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? '↗' : '→'}</span>
}

function GoogleScholarIcon() {
  return (
    <svg className="profile-brand-icon scholar-brand-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 1.5 8.5 12 14l8.2-4.3v5.1h1.5V8.5L12 3Z" fill="currentColor" />
      <path d="M5 11.1v4.2c0 2.2 3.1 4 7 4s7-1.8 7-4v-4.2l-7 3.7-7-3.7Z" fill="currentColor" opacity=".72" />
    </svg>
  )
}

function ScopusIcon() {
  return (
    <span className="profile-brand-icon scopus-brand-icon" aria-hidden="true">
      Scopus
    </span>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [publicationFilter, setPublicationFilter] = useState('All')
  const [showAllPublications, setShowAllPublications] = useState(false)
  const filteredPublications = publicationFilter === 'All'
    ? publications
    : publications.filter((publication) => publication.type === publicationFilter)
  const visiblePublications = showAllPublications
    ? filteredPublications
    : filteredPublications.slice(0, 3)

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Kelvin Kohsasih home">
          KELVIN KOH<span>...</span>
        </a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="nav-cta" href="#contact" onClick={() => setMenuOpen(false)}>Let&apos;s connect <Arrow diagonal /></a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span />
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">ACADEMIA <i /> TECHNOLOGY <i /> IMPACT</p>
          <h1>Research. Technology.<br /><em>Real-world impact.</em></h1>
          <p className="hero-subtitle">Lecturer, ERP Project Manager, and Researcher in Intelligent Systems.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#research">Explore my work <Arrow /></a>
            <a className="button button-outline" href="#contact">Ask for my CV <Arrow diagonal /></a>
          </div>
          <p className="hero-note">Bridging academic research with practical technology solutions.</p>
        </div>
        <div className="hero-photo"><img src={portrait} alt="Kelvin Leonardi Kohsasih" /></div>
        <a className="scroll-cue" href="#publications">SCROLL TO EXPLORE <span>↓</span></a>
      </section>

      <section className="content-section publication-section" id="publications">
        <div className="section-heading publication-section-heading">
          <div className="publication-heading-copy">
            <SectionLabel>RESEARCH &amp; PUBLICATIONS</SectionLabel>
            <h2>Research &amp; Publications</h2>
            <p>Selected work in machine learning, computer vision, medical imaging, and intelligent systems.</p>
          </div>
          <div className="scholar-metrics" aria-label="Google Scholar metrics">
            <div><strong>{metrics.citations}</strong><span>Citations</span></div>
            <div><strong>{metrics.hIndex}</strong><span>h-index</span></div>
            <div><strong>{metrics.i10Index}</strong><span>i10-index</span></div>
          </div>
        </div>

        <div className="publication-layout">
          <article className="featured-research">
            <p className="card-tag">RESEARCH FOCUS</p>
            <h3>Intelligent systems for practical problems.</h3>
            <p>Research combines machine learning and deep learning with applications in computer vision, medical image analysis, natural language processing, and data-driven decision support.</p>
            <div className="topic-tags"><span>Machine Learning</span><span>Computer Vision</span><span>Medical AI</span><span>NLP</span></div>
            <div className="citation-history">
              <div className="citation-history-heading">
                <span>CITATIONS BY YEAR</span>
                <strong>{metrics.citations} total</strong>
              </div>
              {citationHistory.length > 0 ? (
                <div className="citation-bars" role="img" aria-label="Google Scholar citations by year">
                  {citationHistory.map(({ year, citations }) => {
                    const maxCitations = Math.max(...citationHistory.map((item) => item.citations), 1)
                    const height = Math.max((citations / maxCitations) * 100, 4)

                    return (
                      <div className="citation-bar-item" key={year} title={`${year}: ${citations} citations`}>
                        <span className="citation-bar-value">{citations}</span>
                        <span className="citation-bar" style={{ height: `${height}%` }} />
                        <span className="citation-bar-year">{year}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="citation-history-empty">Grafik akan muncul setelah sinkronisasi SerpApi pertama.</p>
              )}
            </div>
            <div className="featured-profile-links">
              <span className='text-link'>View profile on </span>
              <a className="text-link" href="https://scholar.google.com/citations?user=NxJb3rEAAAAJ&hl=en" target="_blank" rel="noreferrer"><GoogleScholarIcon /></a>
              <a className="text-link" href="https://www.scopus.com/authid/detail.uri?authorId=58110153800" target="_blank" rel="noreferrer"><ScopusIcon /></a>
            </div>
          </article>

          <div className="publication-list">
            <div className="publication-list-heading">
              <div><h3>Selected publications</h3><span>{filteredPublications.length} listed works</span></div>
              <a href="https://scholar.google.com/citations?user=NxJb3rEAAAAJ&hl=en" target="_blank" rel="noreferrer">Open profile <Arrow diagonal /></a>
            </div>
            <div className="publication-filters" aria-label="Filter publications">
              {['All', 'Journal', 'Conference', 'Book', 'Other'].map((filter) => (
                <button
                  className={publicationFilter === filter ? 'active' : ''}
                  key={filter}
                  type="button"
                  aria-pressed={publicationFilter === filter}
                  onClick={() => {
                    setPublicationFilter(filter)
                    setShowAllPublications(false)
                  }}
                >{filter === 'Book' ? 'Books' : filter}</button>
              ))}
            </div>
            <div className="publication-rows">
              {visiblePublications.map((publication) => (
                <article className="publication-row" key={publication.title}>
                  <div className="publication-year">{publication.year}</div>
                  <div className="publication-details">
                    <h4>{publication.title}</h4>
                    <p>{publication.authors}</p>
                    {publication.venue && <span className="publication-venue">{publication.venue}</span>}
                    <div className="publication-meta">
                      <span>{publication.type === 'Other' ? 'Academic work' : publication.type}</span>
                      {publication.citations > 0 && <span>{publication.citations} citations</span>}
                    </div>
                  </div>
                  <a className="publication-arrow" href={publication.link} target="_blank" rel="noreferrer" aria-label={`Open ${publication.title} on Google Scholar`}><Arrow diagonal /></a>
                </article>
              ))}
            </div>
            {filteredPublications.length > 6 && (
              <button className="show-publications" type="button" onClick={() => setShowAllPublications(!showAllPublications)}>
                {showAllPublications ? 'Show fewer publications' : `Show all ${filteredPublications.length} publications`}
                <span aria-hidden="true">{showAllPublications ? '↑' : '↓'}</span>
              </button>
            )}
          </div>
        </div>
        <p className="scholar-update-note">Publications and citation metrics are refreshed weekly from Google Scholar.</p>
      </section>

      <section className="intro-section" id="about">
        <div className="intro-heading">
          <SectionLabel>ABOUT ME</SectionLabel>
          <h2>Academic insight.<br /><em>Industry perspective.</em></h2>
        </div>
        <div className="intro-copy">
          <p>I am a lecturer and technology practitioner working across information systems, ERP, and intelligent systems. My experience connects software development and project delivery with teaching and applied research.</p>
          <div className="credential-list">
            <span><b>01</b> Computer Science</span>
            <span><b>02</b> ERP & Project Management</span>
            <span><b>03</b> Teaching & Research</span>
          </div>
        </div>
      </section>

      <section className="content-section research-section" id="research">
        <div className="section-heading">
          <div><SectionLabel>WHAT I EXPLORE</SectionLabel><h2>Research <em>interests</em></h2></div>
          <p>Focused on useful technology: from intelligent methods to systems people rely on.</p>
        </div>
        <div className="research-grid">
          {researchAreas.map((item) => (
            <article className="research-card" key={item.number}>
              <div className="card-index"><span>{item.number}</span><i /></div>
              <p className="card-tag">{item.tag}</p>
              <h3>{item.title}</h3>
              <p className="card-copy">{item.copy}</p>
              <span className="card-arrow"><Arrow diagonal /></span>
            </article>
          ))}
        </div>
      </section>


      <section className="content-section projects-section" id="projects">
        <div className="section-heading">
          <div><SectionLabel>SELECTED WORK</SectionLabel><h2>Projects with <em>purpose</em></h2></div>
          <p>Selected examples where software, research, and real operating needs meet.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className={`project-art ${project.style}`}>
                <span className="art-number">{project.number}</span>
                {project.style === 'erp' && <div className="dashboard-art"><i /><i /><i /><b /><b /><b /><b /></div>}
                {project.style === 'face' && <div className="scan-art"><i /><b /></div>}
                {project.style === 'vision' && <div className="tiles-art"><i /><i /><i /><i /><i /><i /></div>}
              </div>
              <div className="project-info">
                <p className="card-tag">{project.tag}</p>
                <h3>{project.title}</h3>
                <p>{project.copy}</p>
                <a href="#contact" aria-label={`Ask about ${project.title}`}><Arrow diagonal /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section experience-section" id="experience">
        <div className="section-heading">
          <div><SectionLabel>CAREER PATH</SectionLabel><h2>Experience <em>in context</em></h2></div>
          <p>A career spanning technology, project delivery, and higher education.</p>
        </div>
        <div className="timeline">
          {experience.map((item, index) => (
            <article className="timeline-row" key={`${item.year}-${item.role}`}>
              <span className="timeline-year">{item.year}</span>
              <span className={index === 0 ? 'timeline-dot current' : 'timeline-dot'} />
              <div><h3>{item.role}</h3><p>{item.detail}</p></div>
              {index === 0 && <span className="current-label">CURRENT</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="education-section">
        <div className="education-heading"><SectionLabel>EDUCATION</SectionLabel><h2>Learning that<br /><em>keeps moving.</em></h2></div>
        <div className="education-list">
          <article><span className="education-year">2023</span><div><p>MASTER&apos;S DEGREE</p><h3>Computer Science</h3><span>Universitas Potensi Utama</span></div></article>
          <article><span className="education-year">2021</span><div><p>BACHELOR&apos;S DEGREE</p><h3>Computer Science</h3><span>STMIK TIME</span></div></article>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div><SectionLabel>LET&apos;S CONNECT</SectionLabel><h2>Have a project or<br /><em>research idea?</em></h2><p>Open to conversations about academic collaboration, technology projects, and applied research.</p></div>
        <a className="button button-light" href="https://scholar.google.com/citations?user=NxJb3rEAAAAJ&hl=en" target="_blank" rel="noreferrer">Find me on Google Scholar <Arrow diagonal /></a>
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#home">KELVIN KOH<span>...</span></a>
        <p>Lecturer · Researcher · Technology Practitioner</p>
        <div className="footer-links"><a href="#about">About</a><a href="#research">Research</a><a href="#publications">Publications</a><a href="#projects">Projects</a></div>
        <span className="copyright">© {new Date().getFullYear()} Kelvin Leonardi Kohsasih</span>
      </footer>
    </main>
  )
}

export default App
