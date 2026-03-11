import React, { useState, useEffect } from 'react';
import { Trans } from 'react-i18next';
import { PortfolioService } from '../../domain/services/portfolio.service';
import { useSafeTranslation } from '../hooks/useSafeTranslation';
import SkillBar from '../components/SkillBar';
import ProjectCard from '../components/ProjectCard';
import ProjectModal from '../components/ProjectModal';
import type { Project, ProfessionalExperience, Formation, Passion, IutCompetence } from '../../domain/models';
import FormationModal from '../components/FormationModal';
import ProfExperienceModal from '../components/ProfExperienceModal';
import './Home.css';

const Home: React.FC = () => {
  const { t, translateField, translateArray } = useSafeTranslation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [selectedProfExperience, setSelectedProfExperience] = useState<ProfessionalExperience | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [professionalExperiences, setProfessionalExperiences] = useState<ProfessionalExperience[]>([]);
  const [passions, setPassions] = useState<Passion[]>([]);
  const [iutCompetences, setIutCompetences] = useState<IutCompetence[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllFormations, setShowAllFormations] = useState(false);
  const [showAllExperiences, setShowAllExperiences] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          formationsData,
          profExpData,
          passionsData,
          competencesData,
          projectsData
        ] = await Promise.all([
          PortfolioService.getFormations(),
          PortfolioService.getProfessionalExperiences(),
          PortfolioService.getPassions(),
          PortfolioService.getIutCompetences(),
          PortfolioService.getProjects()
        ]);

        setFormations([...formationsData].sort((a, b) => b.startDate?.localeCompare(a.startDate || '') || 0));
        setProfessionalExperiences([...profExpData].sort((a, b) => b.startDate?.localeCompare(a.startDate || '') || 0));
        setPassions(passionsData);
        setIutCompetences(competencesData);
        setProjects([...projectsData].sort((a, b) => b.startDate?.localeCompare(a.startDate || '') || 0));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const isModalOpen = selectedProject || selectedFormation || selectedProfExperience;
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedProject, selectedFormation, selectedProfExperience]);

  const handleOpenProjectModal = (project: Project) => {
    setSelectedProject(project);
  };

  const handleOpenFormationModal = (formation: Formation) => {
    setSelectedFormation(formation);
  };

  const handleOpenProfExperienceModal = (experience: ProfessionalExperience) => {
    setSelectedProfExperience(experience);
  };

  const handleCloseModals = () => {
    setSelectedProject(null);
    setSelectedFormation(null);
    setSelectedProfExperience(null);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <>
      <div className="home-page animate-fade-in">

        {/* SECTION ACCUEIL ET PHOTO */}
        <section id="home" className="hero-fullscreen">
          <div className="hero-content-wrapper">

            {/* Côté Gauche : Texte & Actions */}
            <div className="hero-text-side">
              <h1 className="hero-name-massive">
                Tom Frumy<span className="dot">.</span>
              </h1>
              <p className="hero-role">
                <Trans
                  i18nKey="hero.role"
                  components={{ span: <span className="highlight-text" /> }}
                />
              </p>
              <div className="hero-description">
                {t('hero.description')}
              </div>
              <div className="hero-action-bay">
                <a href="#parcours" className="cta-button primary">{t('hero.cta_parcours')}</a>
                <a href="/TOM_FRUMY_CV.pdf" download="Tom_Frumy_CV.pdf" className="cta-button secondary">{t('hero.cta_cv')}</a>
              </div>
            </div>

            {/* Côté Droit : Image de profil */}
            <div className="hero-visual-side">
              <div className="apple-id-card">
                <div className="apple-id-photo-wrapper">
                  <img
                    src="/images/ID_mono.png"
                    alt="Tom"
                    className="apple-id-photo"
                  />
                  <div className="apple-id-glare"></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <div className="main-content-container">
          {/* SECTION PARCOURS*/}
          <section id="parcours">

            {/* FORMATIONS */}
            <div id="formations" className="timeline-section" style={{ paddingTop: '2rem' }}>
              <h2 className="section-title">{t('sections.formations.title')}</h2>
              <p className="section-subtitle">{t('sections.formations.subtitle')}</p>
              {formations.length === 0 ? (
                <p>{t('sections.formations.loading')}</p>
              ) : (
                <>
                  <div className="timeline-grid">
                    {formations.slice(0, showAllFormations ? formations.length : 3).map(formation => (
                      <div key={formation.id} className="mac-card timeline-card formation-card" onClick={() => handleOpenFormationModal(formation)}>
                        <div className="timeline-header">
                          <span className="timeline-company">{translateField(formation, 'institution')}</span>
                          <span className="timeline-period">{translateField(formation, 'period')}</span>
                        </div>
                        <h3 className="timeline-title">{translateField(formation, 'title')}</h3>
                        <p className="timeline-desc">{translateField(formation, 'description')}</p>

                        {/* Affichage des Soft Skills sur la carte */}
                        {formation.softSkills && formation.softSkills.length > 0 && (
                          <div className="card-soft-skills">
                            {translateArray(formation, 'softSkills').slice(0, 3).map((skill, idx) => (
                              <span key={idx} className="mini-tag">{skill}</span>
                            ))}
                            {formation.softSkills.length > 3 && <span className="mini-tag">+{formation.softSkills.length - 3}</span>}
                          </div>
                        )}

                          {formation.type && <div className="formation-type-badge">{t(`labels.types.${formation.type}`)}</div>}
                      </div>
                    ))}
                  </div>
                  {formations.length > 3 && (
                    <div className="show-more-container">
                      <button className="show-more-btn" onClick={() => setShowAllFormations(!showAllFormations)}>
                        {showAllFormations ? t('common.show_less') : t('common.show_more')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="section-spacer" style={{ height: '6rem' }}></div>

            {/* EXPERIENCES PROFESSIONNELLES */}
            <div id="experiences" className="timeline-section">
              <h2 className="section-title">{t('sections.experiences.title')}</h2>
              <p className="section-subtitle">{t('sections.experiences.subtitle')}</p>
              {professionalExperiences.length === 0 ? (
                <p>{t('sections.experiences.loading')}</p>
              ) : (
                <>
                  <div className="timeline-grid">
                    {professionalExperiences.slice(0, showAllExperiences ? professionalExperiences.length : 3).map(exp => (
                      <div key={exp.id} className="mac-card timeline-card experience-card" onClick={() => handleOpenProfExperienceModal(exp)}>
                        <div className="timeline-header">
                          <span className="timeline-company">{translateField(exp, 'company')}</span>
                          <span className="timeline-period">{translateField(exp, 'period')}</span>
                        </div>
                        <h3 className="timeline-title">{translateField(exp, 'title')}</h3>
                        <p className="timeline-desc">{translateField(exp, 'description')}</p>
                          {exp.type && <div className="experience-type-badge">{t(`labels.types.${exp.type}`)}</div>}
                      </div>
                    ))}
                  </div>
                  {professionalExperiences.length > 3 && (
                    <div className="show-more-container">
                      <button className="show-more-btn" onClick={() => setShowAllExperiences(!showAllExperiences)}>
                        {showAllExperiences ? t('common.show_less') : t('common.show_more')}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          {/* SECTION PROJETS */}
          <section id="projects" className="projects-section">
            <h2 className="section-title">{t('sections.projects.title')}</h2>
            <p className="section-subtitle">{t('sections.projects.subtitle')}</p>
            <>
              <div className="projects-grid">
                {projects.slice(0, showAllProjects ? projects.length : 9).map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleOpenProjectModal(project)}
                  />
                ))}
              </div>
              {projects.length > 9 && (
                <div className="show-more-container">
                  <button className="show-more-btn" onClick={() => setShowAllProjects(!showAllProjects)}>
                    {showAllProjects ? t('common.show_less') : t('common.show_more')}
                  </button>
                </div>
              )}
            </>
          </section>

          {/* SECTION PASSIONS */}
          <section id="passions" className="passions-section">
            <h2 className="section-title">{t('sections.passions.title')}</h2>
            <p className="section-subtitle">{t('sections.passions.subtitle')}</p>
            <div className="passions-grid">
              {passions.map(passion => (
                <div key={passion.id} className="mac-card passion-card">
                  <div className="passion-image">
                    <img src={passion.imageUrl} alt={passion.name} />
                  </div>
                  <div className="passion-content">
                    <h3>{translateField(passion, 'name')}</h3>
                    <p>{translateField(passion, 'description')}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION IUT */}
          <section id="iut" className="iut-section">
            <h2 className="section-title">{t('sections.iut.title')}</h2>
            <p className="section-subtitle">
              {t('sections.iut.subtitle')}
            </p>
            <div className="iut-grid">
              {iutCompetences.map(comp => {
                const linkedProjects = PortfolioService.getProjectsByCompetence(projects, comp.id);
                return (
                  <div key={comp.id} className="mac-card iut-card">
                    <h3>{translateField(comp, 'name')}</h3>
                    <p className="iut-desc">{translateField(comp, 'description')}</p>
                    <SkillBar name={t('sections.iut.level_label')} mastery={comp.level} />


                    {linkedProjects.length > 0 && (
                      <div className="linked-projects-area">
                        <h4>{t('sections.iut.linked_projects')}</h4>
                        <div className="linked-projects-pills">
                          {linkedProjects.map(p => (
                            <button
                              key={p.id}
                              className="project-pill"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenProjectModal(p);
                              }}
                            >
                              {p.title.split('(')[0].trim()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* MODALS */}
      {selectedProject && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <ProjectModal project={selectedProject} onClose={handleCloseModals} />
        </div>
      )}
      {selectedFormation && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <FormationModal formation={selectedFormation} onClose={handleCloseModals} />
        </div>
      )}
      {selectedProfExperience && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <ProfExperienceModal experience={selectedProfExperience} onClose={handleCloseModals} />
        </div>
      )}
    </>
  );
};

export default Home;